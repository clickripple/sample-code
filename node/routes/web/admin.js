const e = require("express");

const router = require("express").Router(),
    { comparePassword, encryptPassword } = require("../../common/bcrypt"),
    Service = require("../../db").models.service;
    Pincode = require("../../db").models.pincode;
    Technician = require("../../db").models.technicians,
    UserRequest = require("../../db").models.requests,
    Ratings = require("../../db").models.ratings,
    mailer = require("../../common/mailer"),
    jwt = require("jsonwebtoken"),
    config = require("../../common/config"),
    Cryptr = require("cryptr"),
    Booking = require("../../db").models.bookings,
    cryptr = new Cryptr(config.cryptoKey),
    bcrypt = require("bcrypt"),
    User = require("../../db").models.users,
    Admin = require("../../db").models.admins;

// add admin API
router.post("", async (req, res) => {
    try {
        console.log(req.body);
        const admin = new Admin(req.body);
        await admin.save();
        res.json({
            status: 200,
            message: "Admin created"
        });
    } catch (e) {
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

router.get("/service", async (req,res) =>{
    try {
        const ser = await Service.findOne({
            where: {
                id : 1
            }
        })
        res.json({
            status : 200,
            service : ser
        })
    } catch (e) {
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
})

router.post("/service", async (req,res) => {
    try {
        const ser = await Service.findOne({
            where: {
                id : 1
            }
        })

        ser.update({
            days: req.body.days,
            hours: req.body.hours,
            minutes: req.body.minutes
        })
        await ser.save();

        res.json({
            status : 200,
            service : req.body
        })
    } catch (e) {
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (JSON.stringify(req.body) == "{}") {
            return res
                .status(400)
                .json({ Error: "Login request body is empty" });
        }
        if (!email || !password) {
            return res.status(400).json({ Error: "Missing fields for login" });
        }

        Admin.findOne({
            where: { email }
        }).then(async function(admins) {

            // res.json(admins);
            // if(!admins){
            //     return res.status(401).json({ status: 404, message: "Unauthorized" });
            // }
            const isMatch = await bcrypt.compare(password, admins.password);
            if (isMatch) {
                const token = jwt.sign(
                    {
                        role: "Admin",
                        timestamp: new Date().getTime(),
                        email: admins.email,
                        id: admins.id
                    },
                    config.secretKey,
                    {
                        expiresIn: "24h"
                    }
                );
                return res.status(200).json({
                    status: 200,
                    message: "login successful",
                    accessToken: token
                });
            } else {
                return res
                    .status(401)
                    .json({ status: 404, message: "Unauthorized" });
            }
        });
    } catch (e) {
        return res
            .status(500)
            .json({ message: "server issues when trying to login!" });
    }
});

// get admin API
router.post("", async (req, res) => {
    try {
        const { email } = req.query;
        const admin = await Admin.findOne({
            email
        });
        res.json({
            status: 200,
            admin
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/password/reset", async (req, res) => {
    try {
        const { to } = req.query;
        const from = "testeresfera@gmail.com";
        const subject = "Reset password";
        const text = "Hello Admin, Please click below button to reset password";

        mailer(from, to, subject, text);

        res.json({
            status: 200,
            message: "Email sent."
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

//Get all Reports
router.get("/reports", async (req,res) => {
    try{
        // const technicians = await Technician.findAll();
        const technicians = await Technician.findAll({
            attributes:
                ["id","username"]
        }); 
        let techs = [];
        for(let technician of technicians){
            let bookings = [];
            let booking = await Booking.findAndCountAll({
                where: {
                    technicianId: technician.id
                 },
                attributes:
                    ["userId","modelName","status","afterDiscount_amount"]
            });

            let requests = await UserRequest.findAndCountAll({
                where: {
                    technicianId: technician.id,
                    technician_Status : "rejected"
                 },
                attributes:
                    ["technician_Status"]
            });

            let ratings = await Ratings.findAndCountAll({
                where: {
                    technicianId: technician.id,
                 },
                attributes:
                    ['rates']
            });

            let avgRating = 0;

            if(ratings.count > 0){
                for(let book of ratings.rows){
                    avgRating += book.rates;
                }
            }

            let completed = await Booking.count({
                where: {
                    technicianId: technician.id,
                    booking_complete : 1
                 }
            });

            let sum = await Booking.sum('afterDiscount_amount',{
                where: {
                    technicianId: technician.id,
                    booking_complete : 1
                 }
            });

            if(booking.count > 0){
                for(let book of booking.rows){
                    let user = await User.findOne({
                        where: {
                            id: book.userId
                        },
                        attributes : ['username']
                    })
                    bookings.push([
                       user.username,
                       book.modelName,
                        book.status.toUpperCase(),
                       book.afterDiscount_amount
                    ]);
                }
            }

            

            let tech = {
                id: technician.id,
                name: technician.username,
                bookings_count : booking.count,
                completed_count : completed,
                sum : sum + " $",
                bookings : bookings,
                rejected : requests.count,
                avgRating : avgRating ? (avgRating/ratings.count).toFixed(2) : 0
            }
            techs.push(tech);
            // technician.bookings_count = 5;
            // ids.push(technician.id);
        }
        res.json({
            status: 200,
            techs
        });
    }catch (e){
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

router.post("/doc_status", async (req,res) => {
    try{
        const { status, id } = req.body;
        const result = await Technician.update({
            doc_status: status
        },{
            where: {id}
        });
        if(result){
            res.json({
                status: 200,
                message : "Document status changed successfully!"
            });
        }
    }catch (e){
        res.json({
            status: e.message,
            message: "Internal server error"
        });
    }
});


//Get single report
router.post("/single_report", async (req,res) => {
    try{
        const {technician} = req.body;
        // return res.json(technician);
        let completed = await Booking.findAll({
            where: {
                technicianId: technician,
                booking_complete : 1
             },
             attributes: ['id',"modelName","issue","afterDiscount_amount","dateTime","EndRepair_date"]
        });

        let data = [];

        for(let booking of completed){
            let rating = await Ratings.findOne({
                where: {
                    technicianId: technician,
                    bookingId : booking.id
                 },
                 attributes: ['rates','comment']
            });
            data.push({
                'id':booking.id,
                'modelName':booking.modelName,
                'issue':booking.issue,
                'afterDiscount_amount':booking.afterDiscount_amount,
                'dateTime':booking.dateTime,
                'EndRepair_date':booking.EndRepair_date,
                'rating': rating ? rating.rates : 0,
                'feedback': rating ? rating.comment : 0,
            });
        }

        res.json({
            status: 200,
            completed : data
        });
    }catch (e){
        res.json({
            status: e.message,
            message: "Internal server error"
        });
    }
});

//Get all pincodes
router.get("/pincodes", async (req,res) => {
    try{
            const pincodes = await Pincode.findAll({
                attributes:
                    ["id","code", "country","activated"]
            });
            res.json({
                status: 200,
                pincodes
            });
    }catch (e){
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

//Get single pincode by id
router.get("/pincode", async (req,res)=>{
    try{
        if(req.query.id){
            id = req.query.id;
            const pincode = await Pincode.findOne({
                where: {
                    id: id
                }
            });
            if(pincode){
                res.json({
                    status:200,
                    pincode
                })    
            }else{
                res.json({
                    status:404,
                    pincode : "not found"
                }) 
            }   
        }
    } catch(e){
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
})

//Add a pincode
router.post("/pincode", async (req,res)=>{
    try{
        if(!req.body.code || !req.body.country || !req.body.activated){
            res.json({
                status: e,
                message: "You have missing values"
            })
        }else{
            const pincode = new Pincode({
                code: req.body.code,
                country: req.body.country,
                activated: req.body.activated
            })
            await pincode.save();
            res.json({
                status: e,
                message: "Success",
                pincode
            })
        }
    } catch(e){
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
})

//Edit a pincode
router.post("/pincode/edit", async (req,res)=>{
    try{
        if(req.body.id){
            id = req.body.id;
            const pincode = await Pincode.findOne({
                where: {
                    id: id
                }
            });
            if(pincode){
                pincode.update({
                    code: req.body.code,
                    country: req.body.country,
                    activated: req.body.activated
                })
                await pincode.save();
                res.json({
                    status:200,
                    pincode
                })   

            }else{
                res.json({
                    status:404,
                    pincode : "not found"
                }) 
            }   
        }
    } catch(e){
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
})

//Delete a pincode
router.delete("/pincode", async (req,res)=>{
    try{
        if(req.query.id){
            id = req.query.id;
            const pincode = await Pincode.findOne({
                where: {
                    id: id
                }
            });
            if(pincode){
                await Pincode.destroy({
                    where: {
                        id
                    }
                });
                res.json({
                    status: 200,
                    message: "Pincode deleted successfully"
                });  

            }else{
                res.json({
                    status:404,
                    pincode : "not found"
                }) 
            }   
        }
    } catch(e){
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
})

module.exports = router;
