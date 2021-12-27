const router = require("express").Router(),
    User = require("../../db").models.users,
    Technician = require("../../db").models.technicians,
    Coupan = require("../../db").models.coupans,
    jwt = require("jsonwebtoken"),
    config = require("../../common/config"),
    random = require("random-string-generator"),
    UserRequest = require("../../db").models.requests,
    couponCode = require("coupon-code"),
    Payment = require("../../db").models.payment_histories,
    Paid = require("../../db").models.paids,
    Booking = require("../../db").models.bookings,
    Sequelize = require("sequelize"),
    Rating = require("../../db").models.ratings,
    Op = require("sequelize").Op,
    { send_Email } = require("../../common/mailer"),
    { comparePassword, encryptPassword } = require("../../common/bcrypt");
    var path = require('path');

// get active/blocked user list

router.post("", async (req, res) => {
    // console.log(req.body);

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
            !req.body.address
        ) {
            return res.json({
                status: false,
                message: "Missing fields for signup"
            });
        }

        req.body.isActive = true;
        req.body.emailVerify = true;
        req.body.provider = "email";
        req.body.password = random(10);
        req.body.referal_code = "BKP" + random(12);
        const user = new User(req.body);
        await user.save();

        const htmll = `Hello ${user.username}, Your Blackpatch password is ${req.body.password}`;
        send_Email(
            config.mailer_mail,
            req.body.email,
            "Black Patch: Account registered",
            htmll
        );

        res.json({
            status: 200,
            message: "user account has been created."
        });

        //
    } catch (e) {
        if (e.name === "SequelizeUniqueConstraintError") {
            res.json({ status: false, message: "Email already exists" });
        } else {
            res.json({
                status: 500,
                message: "Internal server error"
            });
        }
    }
});
router.put("", async (req, res) => {
    try {
        const { id } = req.body;
        await User.update(req.body, {
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "User updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});
router.get("/operation", async (req, res) => {
    try {
        const { q } = req.query;
        var users;
        if (q === "blocked") {
            users = await User.findAndCountAll({
                where: { isActive: false },
                attributes: { exclude: ["password"] }
            });

            res.json({
                status: 200,
                count: users.count,
                blocked_users: users.rows
            });
        } else if (q === "active") {
            users = await User.findAndCountAll({
                where: { isActive: true },
                attributes: { exclude: ["password"] }
            });
            res.json({
                status: 200,
                count: users.count,
                active_users: users.rows
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// get all users/technicians

router.get("/user", async (req, res) => {
    // console.log('object');
    try {
        // const { role } = req.query;
        const users = await User.findAndCountAll({
            // where: { role },
            attributes: { exclude: ["password"] },
            order: [["createdAt", "DESC"]]
        });
        let userData = [];
        for(let user of users.rows){
            let completedServices = await Booking.count({
                where: { 
                    userId: user.id,
                    booking_complete : 1
                }
            });
            let ongoingServices = await Booking.count({
                where: { 
                    userId: user.id,
                    booking_complete : 0
                }
            });
            user = user.toJSON();
            user.completedServices = completedServices;
            user.ongoingServices = ongoingServices;
            userData.push(user);
        }

        

        res.json({
            status: 200,
            count: users.count,
            users: userData
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error" +e
        });
    }
});

router.get("/technician", async (req, res) => {
    // console.log('object');
    try {
        // const { role } = req.query;
        var users = [];
        const users_data = await Technician.findAll({
            // where: { role },
            attributes: { exclude: ["password"] },

            order: [["createdAt", "DESC"]]
        });

        var processedItems = 0;
        for (i = 0; i < users_data.length; i++) {
            var rating = await Rating.findAll({
                // where: { role },
                where: { technicianId: users_data[i].id },
                attributes: [
                    [Sequelize.fn("avg", Sequelize.col("rates")), "rating"]
                ]
            });
            var data = {
                id: users_data[i].id,
                username: users_data[i].username,
                phone: users_data[i].phone,
                email: users_data[i].email,
                address: users_data[i].address,
                isActive: users_data[i].isActive,
                rating: rating.length > 0 ? rating[0].dataValues.rating : 0
            };

            // data.rating.push(rating);

            users.push(data);

            processedItems += 1;

            if (processedItems === users_data.length) {
                res.json({
                    status: 200,
                    count: users_data.length,
                    users
                });
            }
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/typeOfService", async (req,res) => {

})
// get user details
router.get("/details", async (req, res) => {
    try {
        const { id } = req.query;
        const user = await User.findOne({
            where: { id },
            attributes: { exclude: ["password"] }
        });

        //Total number of bookings
        const bookingCount = await Booking.count({
            where: { userId: id}
        })

        //Total amount of bookings
        const bookingSum = await Booking.sum('afterDiscount_amount',{
            where: { userId: id}
        })

        //Phone Model per service
        const phoneBooking = await Booking.findAll({
            attributes: ['id','userId','modelName'],
            where: { userId: id}
        });

        let phone_bookings = [];
        for(let booking of phoneBooking){
            let exists = false;
            for(let newList of phone_bookings){
                if(newList.phone == booking.modelName){
                    exists = true;
                    newList.bookings = newList.bookings +1;
                }
            }
            if(!exists){
                phone_bookings.push({
                    phone: booking.modelName,
                    bookings: 1
                })
            }
        }

        //Issue repaired per service
        const issueBooking = await Booking.findAll({
            attributes: ['id','userId','issue'],
            where: { userId: id}
        });

        let issue_bookings = [];

        for(let booking of issueBooking){
            issue_bookings.push({
                id: booking.id,
                issues: JSON.parse(booking.issue).length
            })
        }

        //Amount Paid per service
        const amountBooking = await Booking.findAll({
            attributes: ['id','userId','afterDiscount_amount'],
            where: { userId: id}
        });



        let info = {
            booking_count: bookingCount,
            booking_total: bookingSum,
            phone_bookings,
            issue_bookings,
            amountBooking
        }


        if (user) {
            res.json({
                status: 200,
                user,
                info
            });
        } else {
            res.json({
                status: 500,
                message: "no data found"
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"+e.message
        });
    }
});

router.get("/tec_details", async (req, res) => {
    try {
        const { id } = req.query;
        // var amt = [];

        var amount = await Booking.findAll({
            where: {
                technicianId: id,
                booking_complete: true
            },
            attributes: [
                "technicianId",
                [
                    Sequelize.fn("sum", Sequelize.col("total_amount")),
                    "totalAmount"
                ],
                [
                    Sequelize.fn("sum", Sequelize.col("afterDiscount_amount")),
                    "afterDiscountamount"
                ]
            ],
            group: ["technicianId"]
        });

        var rating = await Rating.findAll({
            // where: { role },
            where: { technicianId: id },
            attributes: [
                [Sequelize.fn("avg", Sequelize.col("rates")), "rating"]
            ]
        });

        var paid = await Paid.findAll({
            where: {
                technicianId: id
            },
            attributes: [
                "technicianId",
                [
                    Sequelize.fn("sum", Sequelize.col("pay_amount")),
                    "totalPaidAmount"
                ],
                [
                    Sequelize.fn("sum", Sequelize.col("after_discount")),
                    "after_paid_discount"
                ]
            ],
            group: ["technicianId"]
        });

        var user_data = {
            totalAmount:
                amount.length > 0 ? amount[0].dataValues.totalAmount : 0,
            afterDiscountamount:
                amount.length > 0
                    ? amount[0].dataValues.afterDiscountamount
                    : 0,
            totalPaidAmount:
                paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0
        };

        // amt.push(user_data);

        const user = await Technician.findOne({
            where: { id },
            attributes: { exclude: ["password"] }
        });

        const Cpmolete_booking = await Booking.findAndCountAll({
            where: {
                technicianId: id,
                booking_complete: true
            }
        });
        const total_booking = await Booking.findAndCountAll({
            where: {
                technicianId: id
            }
        });
        const pending_booking = await Booking.findAndCountAll({
            where: {
                technicianId: id,
                booking_complete: false
            }
        });
        res.json({
            status: 200,
            user,
            Cpmolete_booking: Cpmolete_booking.count,
            total_booking: total_booking.count,
            pending_booking: pending_booking.count,
            user_data,
            rating: rating.length > 0 ? rating[0].dataValues.rating : 0
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});
// block user
router.put("/updateStatus", async (req, res) => {
    try {
        const { id, isActive } = req.body;
        await User.update(
            {
                isActive
            },
            {
                where: {
                    id
                }
            }
        );
        res.json({
            status: 200,
            message: "User updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.put("/technician", async (req, res) => {
    try {
        const { id, isActive } = req.body;
        await Technician.update(
            {
                isActive
            },
            {
                where: {
                    id
                }
            }
        );
        res.json({
            status: 200,
            message: "technican updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/email-verify", async (req, res) => {
    try {
        // var token = req.headers.token;

        var token = req.query.refresh_token;

        var decoded = jwt.verify(token, config.secretKey);
        const redirectUrl = 'https://user.blackpatch.app/comingsoon/verified.html';
        const errorUrl = 'https://user.blackpatch.app/comingsoon/error.html';

        if (decoded.type === "technician" || decoded.type === "tech") {
            var check_user = await Technician.findOne({
                where: { id: decoded.id }
            });
            if (check_user.emailVerify === false) {
                await Technician.update(
                    { emailVerify: true },
                    {
                        where: {
                            email: decoded.email,
                            id: decoded.id
                        }
                    }
                );
                if (decoded.lang === "es") {
                    var message =
                        "Verificación de correo electrónico con éxito";
                } else {
                    var message = "Email verify successfully";
                }
                res.redirect(redirectUrl);
            } else {
                if (decoded.lang === "es") {
                    var message = "Ya has verificado tu correo electrónico";
                } else {
                    var message = "You have already verified your email";
                }
                res.redirect(errorUrl);
            }
        } else {
            var check_user = await User.findOne({
                where: { id: decoded.id }
            });

            if (check_user.emailVerify === false) {
                if (decoded.referal_code === null) {
                    await User.update(
                        { emailVerify: true },
                        {
                            where: {
                                email: decoded.email,
                                id: decoded.id
                            }
                        }
                    );
                    if (decoded.lang === "es") {
                        var message =
                            "Verificación de correo electrónico con éxito";
                    } else {
                        var message = "Email verify successfully";
                    }
                    res.redirect(redirectUrl);

                } else {
                    var email_verify = await User.update(
                        {
                            emailVerify: true,
                            invite_code: decoded.referal_code,
                            invite_status: true
                        },
                        {
                            where: {
                                email: decoded.email,
                                id: decoded.id
                            }
                        }
                    );
                    if (email_verify) {
                        if (decoded.from) {
                            const referal = new Coupan({
                                userId: decoded.from,
                                coupan_code: "BKPCOUPAN_" + random(12),
                                referal_code: decoded.referal_code,
                                referalamount: "10"
                            });

                            var checkSave = await referal.save();
                        }

                        if (decoded.id) {
                            const referal = new Coupan({
                                userId: decoded.id,
                                coupan_code: "BKPCOUPAN_" + random(12),
                                referal_code: decoded.referal_code,
                                referalamount: "10"
                            });

                            var checkSave = await referal.save();
                        }

                        if (checkSave) {
                            if (decoded.lang === "es") {
                                var message =
                                    "Verificación de correo electrónico con éxito";
                            } else {
                                var message = "Email verify successfully";
                            }
                            res.redirect(redirectUrl);
                        } else {
                            if (decoded.lang === "es") {
                                var message =
                                    "Por favor, inténtelo de nuevo más tarde";
                            } else {
                                var message = "please try again later";
                            }
                            res.json({
                                status: false,
                                message
                            });
                        }
                    }
                }
            } else {
                if (decoded.lang === "es") {
                    var message = "Ya has verificado tu correo electrónico";
                } else {
                    var message = "You have already verified your email";
                }
                res.redirect(errorUrl);
            }
        }
    } catch (err) {
        res.json({
            err
        });
    }
});

router.get("/technician-payment", async (req, res) => {
    try {
        var tech = await Technician.findAll({
            include: [
                {
                    model: Booking,
                    include: [
                        {
                            model: Payment
                        }
                    ]
                }
            ]
        });
        res.json({
            status: 500,
            tech
        });
    } catch (e) {
        res.json({
            status: 400,
            message: "Internal server error"
        });
    }
});

router.get("/user_search", async (req, res) => {
    try {
        const { q } = req.query;

        var users = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    { email: { [Op.like]: q + "%" } },
                    { phone: { [Op.like]: q + "%" } },
                    { username: { [Op.like]: q + "%" } }
                ]
            }
        });

        res.json({
            status: 200,
            users: users.rows,
            count: users.count
        });
    } catch (e) {
        res.json({ status: 500, message: "Internal server error" });
    }
});

router.get("/tech_search", async (req, res) => {
    try {
        const { q } = req.query;

        var users = await Technician.findAndCountAll({
            where: {
                [Op.or]: [
                    { email: { [Op.like]: q + "%" } },
                    { phone: { [Op.like]: q + "%" } },
                    { username: { [Op.like]: q + "%" } }
                ]
            }
        });

        res.json({
            status: 200,
            users: users.rows,
            count: users.count
        });
    } catch (e) {
        res.json({ status: 500, message: "Internal server error" });
    }
});
module.exports = router;
