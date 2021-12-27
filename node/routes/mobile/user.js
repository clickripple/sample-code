const { QueryTypes } = require('sequelize');

const router = require("express").Router(),
    User = require("../../db").models.users,
    Country = require("../../db").models.country_codes,
    Pincode = require("../../db").models.pincode,
    Booking = require("../../db").models.bookings,
    Session = require("../../db").models.login_sessions,
    Rating = require("../../db").models.ratings,
    Coupan = require("../../db").models.coupans,
    Notification = require("../../db").models.notifications,
    jwt = require("jsonwebtoken"),
    config = require("../../common/config"),
    upload = require("../../common/multer"),
    Op = require("sequelize").Op,
    SALT_WORK_FACTOR = 14,
    Sequelize = require("sequelize"),
    sequelize = require("../../db"),
    bcrypt = require("bcrypt"),
    couponCode = require("coupon-code"),
    verifyToken = require("../../common/auth"),
    random = require("random-string-generator"),
    generatePassword = require("password-generator"),
    { send_Email } = require("../../common/mailer"),
	moment = require("moment"),
    nodemailer = require('nodemailer'),
    {
        comparePassword,
        encryptPassword,
        change_Password
    } = require("../../common/bcrypt");

router.post("/login", async (req, res) => {

    try {
        console.log(req.body.email);
        const {
            email,
            password,
            deviceId,
            device_type,
            fcm_token,
            lang
        } = req.body;
        console.log(req.body);
        if (JSON.stringify(req.body) == "{}") {
            if (lang === "es") {
                var message =
                    "El cuerpo de solicitud de inicio de sesión esta vacío";
            } else {
                var message = "Login request body is empty";
            }

            return res.json({
                status: false,
                message
            });
        }
        if (!email || !password) {
            if (lang === "es") {
                var message = "Falta información para Inicio de Sesión";
            } else {
                var message = "Missing fields for login";
            }
            return res.json({
                status: false,
                message
            });
        }

        User.findOne({
            where: { email }
        }).then(async function(users) {
            if (!users) {
                if (lang === "es") {
                    var message = "Sin Autorización";
                } else {
                    var message = "Unauthorized";
                }

                return res.json({
                    status: false,
                    message
                });
            }

            if (users.isActive === false) {
                return res.json({
                    status: false,
                    message:
                        "You are not allowed to login as admin has blocked your account"
                });
            }
        
            const isMatch = await bcrypt.compare(password, users.password);
            if (isMatch) {
                const user = await User.findOne({
                    where: { email },
                    attributes: {
                        exclude: [
                            "password",
                            "referal_code",
                            "invite_status",
                            "isActive"
                        ]
                    }
                });
                const session_data = await Session.findOne({
                    where: { userId: user.id }
                });

                if (user.emailVerify === false) {

                    var refresh_token = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            type: "user",
                            lang: lang
                        },
                        config.secretKey,
                        { expiresIn: "24h" }
                    );

                    if (lang === "es") {
                        var htmll = `Hola ${user.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click aquí</a>`;
                    } else {
                        var htmll = `Hello ${user.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
                    }

                    send_Email(
                        config.mailer_mail,
                        req.body.email,
                        "Black Patch: Account registered",
                        htmll
                    );
                    

                    if (lang === "es") {
                        var message = "Por favor verifica tu Correo Electrónico";
                    } else {
                        var message = "Please verify your email";
                    }
    
                    return res.json({
                        status: false,
                        message
                    });
                }

                if (session_data) {
                    await Session.update(
                        {
                            fcm_token,
                            device_type,
                            deviceId,
                            language: lang,
                            isActive: true
                        },
                        {
                            where: { id: session_data.id }
                        }
                    );
                } else {
                    const session = new Session({
                        isActive: true,
                        userId: user.id,
                        deviceId,
                        fcm_token,
                        device_type,
                        language: lang
                    });
                    await session.save();
                }

                const token = jwt.sign(
                    {
                        timestamp: new Date().getTime(),
                        email: user.email,
                        id: user.id
                    },
                    config.secretKey,
                    {
                        expiresIn: "365d"
                    }
                );
                if (lang === "es") {
                    var message = "Inicio de Sesión Correcto";
                } else {
                    var message = "Login successfully";
                }
                res.json({
                    status: true,
                    accessToken: token,
                    id: user.id,
                    user,
                    message
                });
            } else {
                if (lang === "es") {
                    var message = "Por favor ingrese una contraseña válida";
                } else {
                    var message = "Please enter valid password";
                }

                return res.json({
                    status: false,
                    message
                });
            }
            
        });
    } catch (e) {
        if (lang === "es") {
            return res
                .status(500)
                .json({ message: "Error en el servidor al iniciar sesión" });
        } else {
            return res
                .status(500)
                .json({ message: "server issues when trying to login!" });
        }
    }
});

// Suggesting a alphanumeric password based on what user typed
router.get("/password-suggestion/", async (req,res)=>{
    try{
        const password = req.query.password;

        if(password.length<=3){
            res.json({
                status: 400,
                message: "The password is should be more than 3 characters"
            });
        }else if(password.length>8){
            res.json({
                status: 400,
                message: "The password is should be less than 8 characters"
            });
        }
        else{
            res.json({
                status: 200,
                message: "The suggested password is: "+generatePassword(8, false, /\d/, password)
            });
        }
    }catch(e){
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// List of country dialing codes along with country names
router.get("/country_codes/", async (req,res)=>{
    try{
        let id = null;
        if (id = req.query.id){
            const country = await Country.findOne({
                where: {
                    id: id
                }
            });
            res.json({
                status: 200,
                country: country
            });
        }else{
            const countries = await Country.findAll({
                attributes: ['id','country_name','country_code']
            });
            res.json({
                status: 200,
                countries: countries
            });
        }
    }catch(e){
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/booking_dates", async (req,res)=>{
    const { id } = req.query;
    let bookings = await Booking.findAll({
        where: { userId : id },
        attributes: ['dateTime']
    });
    let bookArray = [];
    for(let booking of bookings){
        bookArray.push(moment(booking.dateTime).format('YYYY/MM/DD'))
    }
    res.json({
        status: 200,
        bookings: bookArray
    });
});

// user social login
router.post("/social/login", async (req, res) => {
    try {

        const { social_id, fcm_token, deviceId, lang } = req.body;
        var user = await User.findOne({
            where: { 
                social_id: social_id
            },
            attributes: { exclude: ["password"] }
        });


        if (user) {
            const session_data = await Session.findOne({
                where: { userId: user.id, deviceId, isActive: true }
            });

            if (session_data) {
                await Session.update(
                    { fcm_token },
                    {
                        where: { id: session_data.id }
                    }
                );
            } else {
                const session = new Session({
                    isActive: true,
                    userId: user.id,
                    deviceId,
                    fcm_token,
                    device_type: "android",
                    language: "en"
                });
                await session.save();
            }

            const token = jwt.sign(
                {
                    role: user.role,
                    timestamp: new Date().getTime(),
                    email: user.email,
                    id: user.id,
                    type: "user"
                },
                config.secretKey,
                {
                    expiresIn: "24h"
                }
            );
            if (lang === "es") {
                var message = "Cierre de Sesión correcto";
            } else {
                var message = "Login successfully";
            }
            res.json({
                status: true,
                accessToken: token,
                user,
                message
            });
        } else {
            if (lang === "es") {
                var message = "El usuario No Existe";
            } else {
                var message = "User does not exits";
            }
            res.json({
                status: false,
                message
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error",
            e
        });
    }
});

router.post("", upload.single("profile_pic"), async (req, res) => {
        // console.log(req.body);
        const { lang } = req.body;
        req.body.unique_id = "UI"+Math.floor(100000000 + Math.random() * 100000000);
        try {
            if (JSON.stringify(req.body) == "{}") {
                if (lang === "es") {
                    var message =
                        "El cuerpo de la solicitud de registro está vacío";
                } else {
                    var message = "Signup request body is empty";
                }
                return res.json({
                    status: false,
                    message
                });
            }
            if (
                !req.body.email ||
                !req.body.username ||
                !req.body.phone ||
                !req.body.address ||
                !req.body.country_code
            ) {
                if (lang === "es") {
                    var message =
                        "Campos pendientes en la solicitud de registro";
                } else {
                    var message = "Missing fields for signup";
                }
                return res.json({
                    status: false,
                    message
                });
            }

            //Validating phone number
            let phone = req.body.phone;

            //Trim all white spaces
            phone = phone.split(" ").join("");
            //Trim all - signs
            phone = phone.split("-").join("");
            if(phone.length !== 10){
                let message = "Phone number length must be 10 characters long";
                return res.json({
                    status: false,
                    message
                });
            }

            

            if (req.body.invite_code != "") {
                const user_code = await User.findOne({
                    where: {
                        referal_code: req.body.invite_code
                    }
                });
                if (user_code != null) {
                    if (typeof req.file === "undefined") {
                        req.body.isActive = true;
                        req.body.emailVerify = false;
                        req.body.provider = "email";
                        req.body.referal_code = "BKP" + random(12);
                        const user = new User(req.body);
                        await user.save();
                        var refresh_token = jwt.sign(
                            {
                                id: user.id,
                                email: user.email,
                                referal_code: user_code.referal_code,
                                from: user_code.id,
                                type: "user",
                                lang: lang
                            },
                            config.secretKey,
                            { expiresIn: "24h" }
                        );
                        if (lang === "es") {
                            var htmll = `Hola ${user.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click aquí</a>`;
                        } else {
                            var htmll = `Hello ${user.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
                        }

                        send_Email(
                            config.mailer_mail,
                            req.body.email,
                            "Black Patch: Account registered",
                            htmll
                        );
                    } else {
                        req.body.profile_pic =req.file.filename;
                        req.body.emailVerify = false;
                        req.body.isActive = true;
                        req.body.provider = "email";
                        req.body.referal_code = "BKP" + random(12);
                        const user = new User(req.body);
                        await user.save();
                        var refresh_token = jwt.sign(
                            {
                                id: user.id,
                                email: user.email,
                                referal_code: user_code.referal_code,
                                from: user_code.id,
                                lang: lang,
                                type: "user"
                            },
                            config.secretKey,
                            { expiresIn: "24h" }
                        );
                        if (lang === "es") {
                            var htmll = `Hola ${user.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click aquí</a>`;
                        } else {
                            var htmll = `Hello ${user.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
                        }
                        send_Email(
                            config.mailer_mail,
                            req.body.email,
                            "Black Patch: Account registered",
                            htmll
                        );
                    }
                    if (lang === "es") {
                        var message =
                            "Tu cuenta ha sido Creada con Éxito. Por favor revisa tu correo electrónico para verificar tu cuenta";
                    } else {
                        var message =
                            "Your account has been created successfully. Please check your email to verify your account.";
                    }
                    res.json({
                        status: true,
                        message
                    });
                } else {
                    if (lang === "es") {
                        var message = "Código de referencia, Inválido";
                    } else {
                        var message = "Invalid referal code";
                    }
                    res.json({
                        status: false,
                        message
                    });
                }
            } else {
                if (typeof req.file === "undefined") {
                    req.body.isActive = true;
                    req.body.emailVerify = false;
                    req.body.provider = "email";
                    req.body.referal_code = "BKP" + random(12);
                    const user = new User(req.body);
                    await user.save();
                    var refresh_token = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            // referal_code: null,
                            lang: lang
                        },
                        config.secretKey,
                        { expiresIn: "1h" }
                    );
                    if (lang === "es") {
                        var htmll = `Hola ${user.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click aquí</a>`;
                    } else {
                        var htmll = `Hello ${user.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
                    }
                    send_Email(
                        config.mailer_mail,
                        req.body.email,
                        "Black Patch: Account registered",
                        htmll
                    );
                } else {
                    req.body.profile_pic =req.file.filename;
                    req.body.emailVerify = false;
                    req.body.isActive = true;
                    req.body.provider = "email";
                    req.body.referal_code = "BKP" + random(12);
                    const user = new User(req.body);
                    await user.save();
                    var refresh_token = jwt.sign(
                        {
                            id: user.id,
                            email: user.email,
                            referal_code: null
                        },
                        config.secretKey,
                        { expiresIn: "1h" }
                    );
                    if (lang === "es") {
                        var htmll = `Hola ${user.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}'>click aquí</a>`;
                    } else {
                        var htmll = `Hello ${user.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
                    }
                    send_Email(
                        config.mailer_mail,
                        req.body.email,
                        "Black Patch: Account registered",
                        htmll
                    );
                }
                
                if (lang === "es") {
                    var message =
                        "Tu cuenta ha sido Creada con Éxito. Por favor revisa tu correo electrónico para verificar tu cuenta";
                } else {
                    var message =
                        "Your account has been created successfully. Please check your email to verify your account.";
                }
                //Validating Zip Code
                if (req.body.zip){

                    let zip = req.body.zip;

                    const pin = await Pincode.findOne({
                        attributes: ['code'],
                        where:{
                            code: zip
                        }
                    });
                    if (pin === null){
                        if (lang === "es") {
                            var message =
                                "Lo sentimos, pero aún NO estamos en esta zona. Sin embargo, puedes solicitar tu servicio dentro de las Áreas con Cobertura en algún café, restaurante u oficina.";
                        } else {
                            var message = "Sorry, but we are NOT in your home area yet, however, you can request your service within the covered areas, in a cafe, restaurant, or";
                        }
                    }
                }
                res.json({
                    status: true,
                    message
                });
            }

            //
        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
                if (lang === "es") {
                    res.json({
                        status: false,
                        message: "El correo electrónico ya existe"
                    });
                } else {
                    res.json({
                        status: false,
                        message: "Email already exists"
                    });
                }
            } else {
                if (lang === "es") {
                    var message = "Error interno del servidor";
                } else {
                    var message = "Internal server error";
                }
                res.json({
                    status: 400,
                    message: e.message
                });
            }
        }
    }
);

router.post("/social/signup", async (req, res) => {
    try {
        const { lang, email, device_type } = req.body;
        req.body.isActive = true;
        req.body.emailVerify = true;
        req.body.provider = "email";
        req.body.language = lang ? lang : 'es';
        req.body.device_type = device_type ? device_type : 'android';
        req.body.referal_code = "BKP" + random(12);
        const check = await User.count({
            where:{
                email
            }
        });
        
        if(check === 0){
            var user = new User(req.body);
            var user_signup = await user.save();
        }else{

            var user_signup = await User.findOne({ where: { email }});
            var user = user_signup;
        }

        if (user_signup) {
            console.log(user_signup);
            const session = new Session({
                isActive: true,
                userId: user_signup.id,
                deviceId: req.body.deviceId,
                fcm_token: req.body.fcm_token,
                device_type: req.body.device_type,
                language:lang
            });
            await session.save();

            const token = jwt.sign(
                {
                    role: user.role,
                    timestamp: new Date().getTime(),
                    email: user.email,
                    id: user.id
                },
                config.secretKey,
                {
                    expiresIn: "24h"
                }
            );
            if (lang === "es") {
                var message = "Usuario creado con éxito";
            } else {
                var message = "User created successfully!";
            }
            res.json({
                status: true,
                accessToken: token,
                id: user_signup.id,
                user: user_signup,
                message
            });
        }
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
            res.json({ status: false, message: "Email already exists" });
        } else {
            res.json({
                status: 500,
                message: "Internal server error",
                e
            });
        }
    }
});
// get user
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const { id, lang } = req.query;
        const user = await User.findOne({
            where: {
                id
            },
            attributes: {
                exclude: [
                    "password",
                    "isActive",
                    "invite_code",
                    "emailVerify",
                    "invite_status"
                ]
            }
        });
        const promo = await Cms.findOne();

        if (user) {
            res.json({
                status: true,
                user,
                promo_text_en: promo.promo_text_en,
                promo_text_es: promo.promo_text_es
            });
        } else {
            if (lang === "es") {
                var message = "Datos no encontrados";
            } else {
                var message = "No data found";
            }
            res.json({
                status: false,
                message
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

//get user's address from his previous five bookings and profile's address
router.get("/getSavedAddress", async (req,res) => {
    try{
        const profile_address = await User.findOne({
            where: {
                id: req.query.id
            },
            attributes:['address', 'lat', 'lng', 'zip']
        });
        const booking_address = await sequelize.query("SELECT LTRIM(address) as address,`lat`,`lng`,`zip` FROM `bookings` WHERE userId=? GROUP BY `address` ORDER BY `address` LIMIT 5",{
            replacements: [req.query.id],
                type: QueryTypes.SELECT
        })
        res.json({
            status:200,
            profile_address,
            booking_address
        })
    } catch (e){
        res.json({
            status: false,
            message: "Internal server error" + e
        })
    }
})

// update user
router.put(
    "/update_profile",
    verifyToken,
    upload.single("profile_pic"),
    async (req, res) => {
        try {
            const { lang } = req.body;
            var token = req.headers.authorization.split("Bearer ");
            var decoded = jwt.verify(token[1], config.secretKey);

            var user_update;

            var user = await User.findOne({
                where: {
                    id: decoded.id
                }
            });

            if (user) {
                
                const { zip } = req.body;

                let zipLength = zip.length;

                if (zipLength > 5){
                    return res.json({
                        status: false,
                        message: "Zip Code must be equal to 5 characters"
                    });
                }

                const pin = await Pincode.findOne({
                    attributes: ['code'],
                    where:{
                        code: zip
                    }
                });

                if (pin === null){
                    if (lang === "es") {
                        var message = "Lo sentimos, pero aún NO estamos en esta zona. Sin embargo, puedes solicitar tu servicio dentro de las Áreas con Cobertura en algún café, restaurante u oficina.";
                    } else {
                        var message = "Sorry, but we are NOT in your home area yet, however, you can request your service within the covered areas, in a cafe, restaurant, or";
                    }
                    var user = await User.findOne({
                        where: {
                            id: decoded.id
                        }
                    });

                    res.json({
                        status: 400,
                        message,
                        user

                    })
                }


                if (!req.file) {
                    var user_update = await User.update(req.body, {
                        where: {
                            id: decoded.id
                        }
                    });
                } else {
                    req.body.profile_pic =req.file.filename;
                    var user_update = await User.update(req.body, {
                        where: {
                            id: decoded.id
                        }
                    });
                }

                if (user_update) {
                    const user = await User.findOne({
                        where: {
                            id: decoded.id
                        },
                        attributes: {
                            exclude: [
                                "password",
                                "isActive",
                                "invite_code",
                                "emailVerify",
                                "invite_status"
                            ]
                        }
                    });
                    if (lang === "es") {
                        var message =
                            "Perfil de usuario actualizado correctamente";
                    } else {
                        var message = "User profile updated successfully";
                    }
                    res.json({
                        status: true,
                        message,
                        user
                    });
                } else {
                    if (lang === "es") {
                        var message = "Algo salió mal";
                    } else {
                        var message = "Some thing went wrong";
                    }
                    res.json({
                        status: false,
                        message
                    });
                }
            } else {
                if (lang === "es") {
                    var message = "Usuario no encontrado";
                } else {
                    var message = "No user found";
                }
                res.json({
                    status: false,
                    message
                });
            }
        } catch (e) {
            res.json({
                status: 500,
                message: "Internal server error"
            });
        }
    }
);

// logout API
router.put("/logout", async (req, res) => {
    try {
        const { userId, deviceId, lang } = req.body;
        await Session.update(
            { isActive: 0 },
            {
                where: {
                    userId,
                    deviceId
                }
            }
        );
        if (lang === "es") {
            var message = "Cierre de Sesión correcto";
        } else {
            var message = "Logout successfully";
        }
        res.json({
            status: true,
            message
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// to get all sessions of specific user
router.get("/sessions", async (req, res) => {
    try {
        const { userId, deviceId } = req.query;
        const sessions = await Session.findAndCountAll({
            where: {
                userId,
                deviceId
            }
        });
        res.json({
            status: true,
            sessions: sessions.rows,
            count: sessions.count
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// forgot password API
router.get("/password/forgot", async (req, res) => {
    try {
        const { email, lang } = req.query;
        const user = await User.findOne({ where: { email } });
        if (user != null) {
            var val = Math.floor(1000 + Math.random() * 9000);
            if (lang === "es") {
                var html = `
                Hola ${user.username}, Usa este Código OTP (One Time Password) ${val} para reiniciar tu contraseña. Si tienes problemas o dudas, puedes comunicarte con nosotros por WhatsApp al +52 1 55 1188 3914 o al correo consulta@blackpatch.app

                Atentamente: equipo Black Patch. 
                `;
            } else {
                var html = `
                Hello ${user.username}, Use this OTP Code (One Time Password ) ${val} to reset your password. If you have problems or doubts, you can contact us by WhatsApp at +52 1 55 1188 3914 or by email consulta@blackpatch.app

                Attentively: Black Patch Team 
                `;
            }
            // const html = `
            //     Hello ${user.username}, ${val} this is your OTP(One time password) to reset your password. 
            //     `;

            send_Email(config.mailer_mail, email, "Reset Password", html);
            if (lang === "es") {
                var message =
                    "Restablecer contraseña OTP (contraseña única) se ha enviado a su ID de correo electrónico registrado";
            } else {
                var message =
                    "Reset Password OTP(One time password) has been sent to your registered Email Id";
            }
            res.json({
                status: true,
                message,
                otp: val
            });
        } else {
            if (lang === "es") {
                var message = "Correo electrónico inválido";
            } else {
                var message = "Invalid email";
            }
            res.json({
                status: false,
                message
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// request to technician for repair
router.post("/wizard/request", async (req, res) => {
    try {
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.post("/change-password", encryptPassword, async (req, res) => {
    try {
        const { lang, email } = req.body;
        var password_change = await User.update(
            { password: req.body.password },
            {
                where: {
                    email
                }
            }
        );
        if (password_change) {
            if (lang === "es") {
                var message = "La contraseña cambio correctamente";
            } else {
                var message = "Password changed successfully";
            }
            res.json({
                status: true,
                message
            });
        } else {
            if (lang === "es") {
                var message = "Por favor intenta otra vez";
            } else {
                var message = "Please try again";
            }
            res.json({
                status: false,
                message
            });
        }
    } catch (err) {
        res.json({
            status: false,
            err
        });
    }
});

router.put(
    "/change_password",
    verifyToken,
    encryptPassword,
    async (req, res) => {
        try {
            const { lang, email } = req.query;
            var token = req.headers.authorization.split("Bearer ");
            var decoded = jwt.verify(token[1], config.secretKey);
            if (req.body.current_password == "" || req.body.password == "") {
                if (lang === "es") {
                    var message =
                        "Campos pendientes para el cambio de contraseña";
                } else {
                    var message = "Missing fields for change password";
                }
                return res.json({
                    status: false,
                    message
                });
            }
            console.log(decoded.id);
            var data_user = await User.findOne({
                where: { id: decoded.id }
            });

            if (!data_user) {
                if (lang === "es") {
                    var message = "Usuario invalido";
                } else {
                    var message = "Invalid user";
                }
                return res.json({
                    status: false,
                    message
                });
            }
            change_Password(
                decoded.id,
                req.body.current_password,

                async isMatch => {
                    if (isMatch) {
                        var password_change = await User.update(
                            { password: req.body.password },
                            {
                                where: {
                                    id: decoded.id
                                }
                            }
                        );
                        if (password_change) {
                            if (lang === "es") {
                                var message =
                                    "La contraseña cambio correctamente";
                            } else {
                                var message = "Password changed successfully";
                            }
                            res.json({
                                status: true,
                                message
                            });
                        } else {
                            if (lang === "es") {
                                var message = "Por favor intenta otra vez";
                            } else {
                                var message = "Please try again";
                            }
                            res.json({
                                status: false,
                                message
                            });
                        }
                    } else {
                        if (lang === "es") {
                            var message = "La contraseña actual no coincide";
                        } else {
                            var message = "Current password is not matched";
                        }
                        res.json({
                            status: false,
                            message
                        });
                    }
                }
            );
        } catch (err) {
            res.json({
                err
            });
        }
    }
);

router.get("/get_referal", verifyToken, async (req, res) => {
    try {
        const { lang } = req.query;
        var token = req.headers.authorization.split("Bearer ");
        console.log(token);
        var decoded = jwt.verify(token[1], config.secretKey);
        var coupans = await Coupan.findAll({
            where: {
                userId: decoded.id,
                isUsed: false
            }
        });

        if (coupans != "") {
            res.json({
                status: true,
                coupans
            });
        } else {
            if (lang === "es") {
                var message = "No tienes cupones";
            } else {
                var message = "You have no coupans";
            }
            res.json({
                status: false,
                message
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});
router.put("/language", verifyToken, async (req, res) => {
    try {
        const { deviceId, lang } = req.query;
        console.log(req.query);
        var token = req.headers.authorization.split("Bearer ");
        var decoded = jwt.verify(token[1], config.secretKey);
        var session = await Session.update(
            { language: lang },
            {
                where: { deviceId }
            }
        );
        if (session) {
            if (lang === "es") {
                var message = "cambio de idioma";
            } else {
                var message = "language change";
            }
            res.json({
                status: true,
                message
            });
        } else {
            if (lang === "es") {
                var message = "algo salió mal";
            } else {
                var message = "something went wrong";
            }
            res.json({
                status: false,
                message
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});
router.post("/ratings", verifyToken, async (req, res) => {
    try {
        const { lang } = req.body;
        var token = req.headers.authorization.split("Bearer ");
        var decoded = jwt.verify(token[1], config.secretKey);
        req.body.userId = decoded.id;
        var rating = new Rating(req.body);
        var save_rating = await rating.save();

        if (save_rating) {
            if (lang === "es") {
                var message = "Gracias por tu valoración";
            } else {
                var message = "Thanks for the rating";
            }
            res.json({
                status: true,
                message
            });
        } else {
            if (lang === "es") {
                var message = "algo salió mal";
            } else {
                var message = "something went wrong";
            }
            res.json({
                status: false,
                message
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/ratings", function(req, res, next) {
    Rating.findAll({
        attributes: [[Sequelize.fn("AVG", Sequelize.col("rates"))]] // <--- All you need is this
    }).then(data => {
        console.log(data);
        res.json({
            rating: data
        });
    });
});

module.exports = router;
