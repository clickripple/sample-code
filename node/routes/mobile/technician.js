const { fstat } = require("fs");

const router = require("express").Router(),
    Technician = require("../../db").models.technicians,
    Pincode = require("../../db").models.pincode,
    Session = require("../../db").models.login_sessions,
    Account = require("../../db").models.accounts,
	  Rating = require("../../db").models.ratings;
    jwt = require("jsonwebtoken"),
    config = require("../../common/config"),
    Notification = require("../../db").models.notifications,
    random = require("random-string-generator"),
    upload = require("../../common/multer"),
    upload2 = require("../../common/multers3"),
    Op = require("sequelize").Op,
    SALT_WORK_FACTOR = 14,
    bcrypt = require("bcrypt"),
    generatePassword = require("password-generator"),
    { send_Email } = require("../../common/mailer"),
    fs = require('fs'),
    AWS = require('aws-sdk'),

    verifyToken = require("../../common/auth"),
    {
        compareTechPassword,
        encryptPassword,
        tech_change_Password
    } = require("../../common/bcrypt");




router.post("/login", async (req, res) => {
  try {
    // const { lang } = req.query;
    console.log(req.body);
    const {
      email,
      password,
      fcm_token,
      device_type,
      deviceId,
      lang
    } = req.body;
    if (JSON.stringify(req.body) == "{}") {
      if (lang === "es") {
        var message = "El cuerpo de solicitud de inicio de sesión esta vacío";
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

    Technician.findOne({
      where: { email }
    }).then(async function(technician) {
      if (!technician) {
       
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
      if(technician.isActive===false)
      {
         if (lang === "es") {
             var message = "No se le permite iniciar sesión porque el administrador ha bloqueado su cuenta";
         } else {
             var message =
                 "You are not allowed to login as admin has blocked your account";
         }
      	return res.json({
              status: false,
              message
          });
      }
      if (technician.emailVerify === false) {

        var refresh_token = jwt.sign(
          {
              id: technician.id,
              email: technician.email,
              type: "technician",
              lang: lang
          },
          config.secretKey,
          { expiresIn: "24h" }
      );

      if (lang === "es") {
          var htmll = `Hola ${technician.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click aquí</a>`;
      } else {
          var htmll = `Hello ${technician.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
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
      } else {
      const isMatch = await bcrypt.compare(password, technician.password);
      if (isMatch) {
        const technician = await Technician.findOne({
          where: { email },
          attributes: {
            exclude: ["password", "emailVerify", "isActive"]
          }
        });
        const session_data = await Session.findOne({
          where: {
            technicianId: technician.id,
           
          }
        });

        if (session_data) {
          // res.json(req.body);
          // res.json(req.body.fcm_token);

          await Session.update(
              { fcm_token: req.body.fcm_token, language: lang, isActive: true },
              {
                  where: { id: session_data.id }
              }
          );
        } else {
          const session = new Session({
            isActive: true,
            technicianId: technician.id,
            deviceId,
            fcm_token,
            device_type,
            language:lang
          });
          await session.save();
        }

        const token = jwt.sign(
            {
                timestamp: new Date().getTime(),
                email: technician.email,
                id: technician.id
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
          id: technician.id,
          technician,
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
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "server issues when trying to login!" });
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

// user social login

router.post("/social/login", async (req, res) => {
  try {
    // const { lang } = req.query;
    const { id, fb_token, deviceId,lang } = req.body;
    var technician = await Technician.findOne({
      where: { id },
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      req.body.isActive = true;
      const new_user = new Technician(req.body);
      technician = await new_user.save();
    }

    const session_data = await Session.findOne({
      where: { technicianId: technician.id, deviceId, isActive: true }
    });

    if (session_data) {
      await Session.update(
        { fb_token },
        {
          where: { id: session_data.id }
        }
      );
    } else {
      const session = new Session({
        isActive: true,
        userId: technician.id,
        deviceId,
        fb_token
      });
      await session.save();
    }

    const token = jwt.sign(
      {
        // role: user.role,
        timestamp: new Date().getTime(),
        email: technician.email,
        id: technician.id,
        type:"tech"
      },
      config.secretKey,
      {
        expiresIn: "24h"
      }
    );
    if (lang === "es") {
      var message = "Inicio de Sesión Correcto";
    } else {
      var message = "Login successfully";
    }
    res.json({
      status: 200,
      accessToken: token,
      message
    });
  } catch (e) {
    res.json({
      status: 500,
      e,
      message: "Internal server error"
    });
  }
});

router.post(
  "",
  upload.single("profile_pic"),

  async (req, res) => {
    const { lang } = req.body;
    try {
      if (JSON.stringify(req.body) == "{}") {
        if (lang === "es") {
          var message = "El cuerpo de la solicitud de registro está vacío";
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
        !req.body.address
      ) {
        if (lang === "es") {
          var message = "Campos pendientes en la solicitud de registro";
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


      //Validating Zip Code
      if (req.body.zip){

        let zip = req.body.zip;

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
                var message =
                    "Sorry, but we are NOTLo sentimos, pero aún NO estamos en esta zona. Sin embargo, puedes solicitar tu servicio dentro de las Áreas con Cobertura en algún café, restaurante u oficina.";
            } else {
                var message = "Sorry, but we are NOT in your home area yet, however, you can request your service within the covered areas, in a cafe, restaurant, or";
            }
            res.json({
                status: 400,
                message
            })
        }
    }

      if (typeof req.file === "undefined") {
        req.body.isActive = true;
        req.body.emailVerify = false;
        req.body.provider = "email";
        const technician = new Technician(req.body);
        await technician.save();
        var refresh_token = jwt.sign(
            {
                id: technician.id,
                email: technician.email,
                type: "tech",
                lang: lang
            },
            config.secretKey,
            { expiresIn: "1h" }
        );
         if (lang === "es") {
             var htmll = `Hola ${technician.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click aquí</a>`;
         } else {
             var htmll = `Hello ${technician.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
         }
        send_Email(
          config.mailer_mail,
          req.body.email,
          "Black Patch: Account registered",
          htmll
        );
      } else {
        req.body.profile_pic = req.file.filename;
        req.body.emailVerify = false;
        req.body.isActive = false;
        req.body.provider = "email";
        const technician = new Technician(req.body);
        await technician.save();

        var refresh_token = jwt.sign(
            {
                id: technician.id,
                email: technician.email,
                type: "tech",
                lang: lang
            },
            config.secretKey,
            { expiresIn: "1h" }
        );
          if (lang === "es") {
              var htmll = `Hola ${technician.username}, porfavor da click aquí para verificar tu cuenta. Este link expirará en 180 segundos y tendrás que volver a registrar tu cuenta.<br> The link goes on <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click aquí</a>`;
          } else {
              var htmll = `Hello ${technician.username}, Please <a href='http://52.201.54.3:3010/api/user/email-verify?refresh_token=${refresh_token}''>click here</a> to verify your account. This link will expire in 180 seconds`;
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

      //
    } catch (e) {
      if (e.name === "SequelizeUniqueConstraintError") {
        if (lang === "es") {
          res.json({
            status: false,
            message: "El correo electrónico ya existe"
          });
        } else {
          res.json({ status: false, message: "Email already exists" });
        }
        // res.json({ status: false, message });
      } else {
        res.json({
          e,
          status: 500,
          message: e && e.message ? e.message : "Internal server error"
        });
      }
    }
  }
);

// get tech verifyToken
router.get("/profile",  async (req, res) => {
  try {
    const { id, lang } = req.query;
    const technician = await Technician.findOne({
      where: { id },
      attributes: { exclude: ["password"] }
    });

    const options = {
      where: {technicianId: technician.id }
    };

    const ratingSum = await Rating.sum('rates',options);
    const ratingCount = await Rating.count(options);
    const ratings = ratingCount && ratingCount > 0 ? (ratingSum/ratingCount).toFixed(2) : 0;

    const tech = technician.toJSON();
    tech.ratings = String(ratings);
    if (technician) {
        res.json({
          status: true,
          technician : tech
      });
    } else {
      if (lang === "es") {
        var message = "Usuario inválida";
      } else {
        var message = "Invalid user";
      }
      res.json({
        status: false,
        message
      });
    }
  } catch (e) {
    res.json({
      status: 400,
      message: "Internal server error"
    });
  }
});



// update user
// router.put("", async (req, res) => {
//     try {
//         const { email } = req.body;
//         await Technician.update(req.body, {
//             where: {
//                 email
//             }
//         });
//         res.json({
//             status: 200,
//             message: "User updated successfully"
//         });
//     } catch (e) {
//         res.json({
//             status: 500,
//             message: "Internal server error"
//         });
//     }
// });

router.post( "/upload_to_s3", upload2.single("doc"), async (req, res) => {
    const fileContent = await fs.createReadStream(req.file.path);
    const s3 = new AWS.S3({
      accessKeyId: 'AKIAYERD463SBLKWXFZH',
      secretAccessKey: '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'
    });

    const getRndInteger = (min, max) => {
      return Math.floor(Math.random() * (max - min) ) + min;
    }
    const params = {
        Bucket: 'blackpatchadmin',
        Key: 'uploads/'+ getRndInteger(100000000,999999999) +'.jpg', // File name you want to save as in S3
        Body: fileContent
    };
    s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }

      res.json(`File uploaded successfully. ${data.Location}`);
      console.log(`File uploaded successfully. ${data.Location}`);
  });
})

  router.post( "/upload_document", upload.single("doc"), async (req, res) => {
  const { doc_type, id, lang } = req.body;

  if(![
    'id_doc',
    'actual_photo',
    'address_doc',
    'reference_doc',
    'secure_doc',
    'other_doc'
  ].includes(doc_type)){
    res.json({
      status: false,
      message : "Invalid document type!"
    });
  }
  try {
    if (req.file) {
      
      req.body.doc = req.file.filename;
      let data = {
        [doc_type] : req.body.doc
      }
      var user_update = await Technician.update(data, {
        where: { id }
      });

      const tech = await Technician.findOne({
        where: {
          id
        }
      });


      //When all the documents are uploaded
      if(tech.id_doc && 
         tech.actual_photo && 
         tech.address_doc && 
         tech.reference_doc &&
         tech.secure_doc &&
         tech.other_doc){

          await Technician.update({
            doc_status:"in_progress"
          }, {
            where: { id }
          });

      }

      if (user_update) {
        res.json({
          status: true,
          message : "Updated successfully!"
        });
      }
    }

  } catch (e) {
    if (lang === "es") {
      var message = "Error interno del servidor";
    } else {
      var message = "Internal server error";
    }
    res.json({
      status: 500,
      message,
      e
    });
  }
});

router.put(
  "/update_profile",
  verifyToken,
  upload.single("profile_pic"),
  async (req, res) => {
    
    const { lang } = req.body;
    try {
      var token = req.headers.authorization.split("Bearer ");
      var decoded = jwt.verify(token[1], config.secretKey);

      var user_update;

      var user = await Technician.findOne({
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
          const tech = await Technician.findOne({
            where: {
                id: decoded.id
            },
            attributes: { exclude: ["password"] }
          });

          res.json({
            status: 400,
            message,
            tech
          })
        }
    
        if (!req.file) {
          var user_update = await Technician.update(req.body, {
            where: {
              id: decoded.id
            }
          });
        } else {
          req.body.profile_pic =
            req.file.filename;
          var user_update = await Technician.update(req.body, {
            where: {
              id: decoded.id
            }
          });
        }
        if (lang === "es") {
          var message = "Perfil de técnico actualizado correctamente";
        } else {
          var message = "Technician profile updated successfully";
        }
        if (user_update) {
            const technician = await Technician.findOne({
                where: {
                    id: decoded.id
                },
                attributes: { exclude: ["password"] }
              });
          res.json({
            status: true,
            message,
            technician
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
      if (lang === "es") {
        var message = "Error interno del servidor";
      } else {
        var message = "Internal server error";
      }
      console.log("shobhit",e.message);
      res.json({
        status: 500,
        message: e && e.message ? e.message : "Internal server error"
      });
    }
  }
);

// logout API
router.put("/logout", async (req, res) => {
  try {
    // const { lang } = req.query;
    const { technicianId, deviceId,lang} = req.body;
    await Session.update(
      { isActive: false },
      {
        where: {
          technicianId,
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
    const { technicianId, deviceId } = req.query;
    const sessions = await Session.findAndCountAll({
      where: {
        technicianId,
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
    const technician = await Technician.findOne({ where: { email } });
    if (technician) {
     
     var val = Math.floor(1000 + Math.random() * 9000);
      const html = `Hello ${technician.username}, ${val} this is your OTP(One time password) to reset your password. 
        `;
      send_Email(config.mailer_mail, email, "Reset Password", html);
      if (lang === "es") {
        var message =
          "El Link para reiniciar la contraseña fue enviado al correo electrónico registrado";
      } else {
        var message =
          "Password reset link has been sent to your registered Email Id";
      }
      res.json({
        status: true,
        message,
        otp:val
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

router.get("/email-verify", async (req, res) => {
  try {
    if (!req.headers.token) {
      return res.json({
        status: false,
        message: "token must be provide"
      });
    }
    var token = req.headers.token;
    var decoded = jwt.verify(token, config.secretKey);

    const check_technician = await Technician.findOne({
      where: { id: decoded.id }
    });

    if (check_technician.emailVerify === false) {
      var tech_update = await Technician.update(
        { emailVerify: true },
        {
          where: {
            email: decoded.email,
            id: decoded.id
          }
        }
      );
      if (tech_update) {
        res.json({
          status: true,
          message: "Email verify successfully"
        });
      } else {
        res.json({
          status: false,
          message: "Please try again later"
        });
      }
    } else {
      res.json({
        status: false,
        message: "You have already verify your email"
      });
    }
  } catch (err) {
    res.json({
      err
    });
  }
});

router.post("/change-password", encryptPassword, async (req, res) => {
  try {
      const { lang,email } = req.body;
   
    const check_technician = await Technician.findOne({
      where: { email }
    });
    if (check_technician) {
      var password_technician = await Technician.update(
        { password: req.body.password },
        {
          where: {
            email,
           
          }
        }
      );
      if (password_technician) {
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
    } else {
      if (lang === "es") {
        var message = "Usuario no encontrado";
      } else {
        var message = "No user found";
      }
      return res.json({
        status: false,
        message
      });
    }
  } catch (err) {
    res.json({
      status: false,
      message: "link is expire"
    });
  }
});

router.put(
  "/change_password",
  verifyToken,
  encryptPassword,
  async (req, res) => {
    try {
      const { lang,current_password,password } = req.body;
      var token = req.headers.authorization.split("Bearer ");
      var decoded = jwt.verify(token[1], config.secretKey);
      if (current_password == "" || password == "") {
        if (lang === "es") {
          var message = "Campos pendientes para el cambio de contraseña";
        } else {
          var message = "Missing fields for change password";
        }
        return res.json({
          status: false,
          message
        });
      }
      
      var data_user = await Technician.findOne({
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
      }else{
      tech_change_Password(
        decoded.id,
        current_password,

        async isMatch => {
          if (isMatch) {
            var password_change = await Technician.update(
              { password:password },
              {
                where: {
                  id: decoded.id
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
    }
    } catch (err) {
      res.json({
        err
      });
    }
  }
);

router.put("/language", verifyToken, async (req, res) => {
  try {
    const { deviceId, lang } = req.query;
   
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

router.post("/bank_detail", verifyToken, async (req, res) => {
  try {
    const { lang } = req.body;
    
    var token = req.headers.authorization.split("Bearer ");
    var decoded = jwt.verify(token[1], config.secretKey);
    req.body.technicianId = decoded.id;
    const account = new Account(req.body);
    const temp = await account.save();
    if(temp){
        var user_update = await Technician.update({isaccountadded:true}, {
            where: {
              id: decoded.id
            }
          });
          if (lang === "es") {
            var message = "Añadir con éxito";
          } else {
            var message = "Successfully add";
          }
          res.json({
            status: true,
            message
          });
    }
   
  } catch (e) {
    res.json({
      status: "500",
      error: e,
      message: "Internal server error"
    });
  }
});

router.put("/edit_bank", verifyToken, async (req, res) => {
  try {
    const {
      lang,
      bank_name,
      account_number,
      account_name,
      client_number
    } = req.body;

    var token = req.headers.authorization.split("Bearer ");
    var decoded = jwt.verify(token[1], config.secretKey);

    var account = await Account.update(
      {
        bank_name,
        account_number,
        account_name,
        client_number
       
      },
      {
        where: { technicianId: decoded.id }
      }
    );
   
    if (account) {
      if (lang === "es") {
        var message = "Cuenta actualizada con éxito";
      } else {
        var message = "account successfully updated";
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

router.get("/language", async (req, res) => {
  try {
    var token = req.headers.authorization.split("Bearer ");
    var decoded = jwt.verify(token[1], config.secretKey);
    const { lang } = req.query;
    const sessions = await Session.findAndCountAll({
      where: {
        technicianId,
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

router.get("/bank_detail", verifyToken, async (req, res) => {
  try {
    const { lang } = req.query;
    var token = req.headers.authorization.split("Bearer ");
    var decoded = jwt.verify(token[1], config.secretKey);
    const account = await Account.findOne({
      where: {
        technicianId: decoded.id
      }
    });
    if (account) {
      res.json({
        status: true,
        account
      });
    } else {
      if (lang === "es") {
        var message = "No hay cuenta agregada todavía";
      } else {
        var message = "No Account added yet";
      }
      res.json({
        status: false,
        message
      });
    }
  } catch (e) {
    res.json({
      status: "500",
      error: e,
      message: "Internal server error"
    });
  }
});


module.exports = router;
