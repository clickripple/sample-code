const router = require("express").Router(),
    Cms = require("../../db").models.cms,
    Technician = require("../../db").models.technicians,
    User = require("../../db").models.users,
    Booking = require("../../db").models.bookings,
    Newsletter = require("../../db").models.newsletter,
    Payment = require("../../db").models.payment_histories,
    Account = require("../../db").models.accounts,
    db = require("../../db"),
    Sequelize = require("sequelize"),
    Op = require("sequelize").Op,
    Paid = require("../../db").models.paids,
    Model = require("../../db").models.models,
    moment = require("moment"),
    UserRequest = require("../../db").models.requests;
var csv_export = require("csv-export");
const fs = require("fs");
const path = require("path");
const os = require("os");
const { QueryTypes } = require("sequelize");
// get cms

router.get("", async (req, res) => {
    try {
        if(req.query.lang==='es')
        {
             const cms_data = await Cms.findAll({
             attributes: ["es_about_us", "es_tnc", "es_policy"]
        });
        res.json({
            status: 200,
            cms_data: cms_data.length > 0 ? cms_data[0] : null
        });

        }else{
           
             const cms_data = await Cms.findAll({
             attributes: ["en_about_us", "en_tnc", "en_policy"]
        });
        res.json({
            status: 200,
            cms_data: cms_data.length > 0 ? cms_data[0] : null
        });
        }
       
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/get_privacy_terms", async (req, res) => {
    try {
        
             const cms_data = await Cms.findOne();
                res.json({
                    status: 200,
                    cms_data: cms_data

                });

 
       
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// add cms
router.post("", async (req, res) => {
    try {
        const cms_data = new Cms(req.body);
        await cms_data.save();
        res.json({
            status: 200,
            message: "CMS data added"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// update cms
router.put("", async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.body;
        await Cms.update(req.body, { where: { id } });
        res.json({
            status: 200,
            message: "CMS data updated"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/getAvailableAreaImage", async (req, res)=>{
    try {
        const cms_data = await Cms.findOne();
        data = {
            image1: cms_data.available_area_image,
            image2: cms_data.available_image2,
            image3: cms_data.available_image3,
            image4: cms_data.available_image4,
            image5: cms_data.available_image5,
            video: cms_data.video,
        }
        res.json({
            status: 200,
            image: cms_data.available_area_image,
            data
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
})

router.get("/newsletter", async (req,res) => {
    try{
        const letters = await Newsletter.findAll();
        res.json({
            status: 200,
            data: letters
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
})  

router.post("/add-news", async (req,res) => {
    try{
        const { title, description } = req.body;

        await Newsletter.create({
            title, description
        });
        res.json({
            status: 200,
            message: "News was added successfully!"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
})

router.post("/edit-news", async (req,res) => {
    try{
        const { news_id, title, description } = req.body;

        let news = await Newsletter.findOne({
            id: news_id
        });
        news.title = title;
        news.description = description;
        await news.save();

        res.json({
            status: 200,
            message: "News was updated successfully!"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
})

router.post("/delete-news", async (req,res) => {
    try{
        const { id } = req.body;

        await Newsletter.destroy({ 
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "News was deleted successfully!"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error",
            e
        });
    }
}) 



router.post("/deleteAreaImage", async (req, res)=>{
    const {type} = req.body;
    if(type == "image1"){
        var cms = await Cms.update({
                available_area_image: null
            },{
                where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
        });
    }
    if(type == "image2"){
        var cms = await Cms.update({
                available_image2: null
            },{
                where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
        });
    }
    if(type == "image3"){
        var cms = await Cms.update({
                available_image3: null
            },{
                where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
        });
    }

    if(type == "image4"){
        var cms = await Cms.update({
                available_image4: null
            },{
                where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
        });
    }

    if(type == "image5"){
        var cms = await Cms.update({
                available_image5: null
            },{
                where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
        });
    }

    if (cms) {
        res.json({ status: true });
    } else {
        res.json({ status: false });
    }


});
    router.post("/availableAreaImage", async (req, res)=>{
    try {
        const {type, image} = req.body;
        if(type == "image1"){
            var cms = await Cms.update({
                    available_area_image: image
                },{
                    where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
            });
        }
        if(type == "image2"){
            var cms = await Cms.update({
                    available_image2: image
                },{
                    where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
            });
        }
        if(type == "image3"){
            var cms = await Cms.update({
                    available_image3: image
                },{
                    where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
            });
        }

        if(type == "image4"){
            var cms = await Cms.update({
                    available_image4: image
                },{
                    where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
            });
        }

        if(type == "image5"){
            var cms = await Cms.update({
                    available_image5: image
                },{
                    where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
            });
        }

        if(type == "video"){
            var cms = await Cms.update({
                    video: image
                },{
                    where: { id: "1b59edfb-81bb-4815-a473-94f5421f0fff" }
            });
        }

        if (cms) {
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
})


router.get("/count_data", async (req, res) => {
    try {
        
        var d = new Date();
        var year = d.getFullYear();
        const Techcount = await Technician.findAndCountAll();
        const Usercount = await User.findAndCountAll();
        const Cpmolete_booking = await Booking.findAndCountAll({
            where: {
                booking_complete: true
            }
        });
        let earnings = 0;
        for(let booking of Cpmolete_booking.rows){
            earnings = earnings + parseInt(booking.afterDiscount_amount);
        }
      

        let resuu = [];

        var daily_complete_booking = await db.query(
            `SELECT MONTHNAME(createdAt) MONTH, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND booking_complete = true GROUP BY MONTHNAME(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );
        daily_complete_booking.map((data, index) => {
            var obj = {};
            obj[
                moment()
                    .month(data.MONTH)
                    .format("MMM")
            ] = data.COUNT;
            resuu.push(obj);
        });
      
        const inCpmolete_booking = await Booking.findAndCountAll({
            where: {
                booking_complete: false
            }
        });
        const total_earning = await Payment.findAll({
            attributes: [
                [Sequelize.fn("sum", Sequelize.col("amount")), "totalAmount"]
            ]
        });

      
        let resu = [];
          var daily_count = await db.query(
            `SELECT MONTHNAME(createdAt) MONTH, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND booking_complete = false GROUP BY MONTHNAME(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );

        daily_count.map((data, index) => {
            var obj = {};
            obj[
                moment()
                    .month(data.MONTH)
                    .format("MMM")
            ] = data.COUNT;
            resu.push(obj);
        });



        const total_booking = await Booking.findAndCountAll({});
        // const users_da = await db.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
        var user_data = await db.query(
            "select concat(10*floor(dob/10), '-', 10*floor(dob/10) + 10) as `range`, count(id) as count from users group by `range`",
            { type: db.QueryTypes.SELECT }
        );
        const reject_booking = await Booking.findAndCountAll({
            where: {
                booking_complete: false,
                technicianId: null
            }
        });
        var technician_data = await db.query(
            "select concat(10*floor(dob/10), '-', 10*floor(dob/10) + 10) as `range`, count(id) as count from technicians group by `range`",
            { type: db.QueryTypes.SELECT }
        );

        var user_male_female = await db.query(
            "SELECT SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) as MaleCount, SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) as FemaleCount,SUM(CASE WHEN gender = 'O' THEN 1 ELSE 0 END) as OtherCount, COUNT(*) as TotalCount FROM users",
            { type: db.QueryTypes.SELECT }
        );
        var technician_male_female = await db.query(
            "SELECT SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END) as MaleCount, SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END) as FemaleCount,SUM(CASE WHEN gender = 'O' THEN 1 ELSE 0 END) as OtherCount, COUNT(*) as TotalCount FROM technicians",
            { type: db.QueryTypes.SELECT }
        );


        let dailyData = [];
        let cdailyData = [];
        for(let i=6; i>=0; i--){
            let NOW = new Date(moment().subtract(i, 'days').endOf('day'));
            let TODAY_START = new Date(moment().subtract(i, 'days').startOf('day'));
            
            let rlt = await Booking.sum('afterDiscount_amount',{
                where: {
                            createdAt: { 
                                [Op.gt]: TODAY_START,
                                [Op.lt]: NOW
                            },
                        }
            });
            let crlt = await Booking.count({
                where: { 
                    createdAt: { 
                        [Op.gt]: TODAY_START,
                        [Op.lt]: NOW
                    },
                    booking_complete : 1 
                }
            });
            dailyData.push(rlt);
            cdailyData.push(crlt);
        }

        const labels = [
            moment().subtract(6, "days").format('Do MMM'),
            moment().subtract(5, "days").format('Do MMM'),
            moment().subtract(4, "days").format('Do MMM'),
            moment().subtract(3, "days").format('Do MMM'),
            moment().subtract(2, "days").format('Do MMM'),
            moment().subtract(1, "days").format('Do MMM'),
            moment().format('Do MMM'),
        ];

        let dailyBookingData = {
            labels,
            series: [dailyData],
        };

        let dailyCompBookingData = {
            labels,
            series: [cdailyData],
        };

        let weeklyData = [];
        let cweeklyData = [];
        for(let i=6; i>=0; i--){
            let NOW = new Date(moment().subtract(i, 'weeks').endOf('week'));
            let TODAY_START = new Date(moment().subtract(i, 'weeks').startOf('week'));
            
            let rlt = await Booking.sum('afterDiscount_amount',{
                where: {
                            createdAt: { 
                                [Op.gt]: TODAY_START,
                                [Op.lt]: NOW
                            },
                        }
            });

            let crlt = await Booking.count({
                where: {
                            createdAt: { 
                                [Op.gt]: TODAY_START,
                                [Op.lt]: NOW
                            },
                            booking_complete : 1 
                        }
            });
            weeklyData.push(rlt);
            cweeklyData.push(crlt);
        }
        const wlabels=  [
            moment().subtract(42, "days").format('Do MMM'),
            moment().subtract(35, "days").format('Do MMM'),
            moment().subtract(28, "days").format('Do MMM'),
            moment().subtract(21, "days").format('Do MMM'),
            moment().subtract(14, "days").format('Do MMM'),
            moment().subtract(7, "days").format('Do MMM'),
            moment().format('Do MMM'),
        ];

        let weeklyBookingData = {
            labels: wlabels,
            series: [weeklyData],
        };

        let weeklyCompBookingData = {
            labels: wlabels,
            series: [cweeklyData],
        };

        let monthlyData = [];
        let cMonthlyData = [];
        for(let i=6; i>=0; i--){
            let TODAY_START = new Date(moment().subtract(i, 'months').startOf('month').format('MM/DD/YYYY'));
            let NOW = new Date(moment().subtract(i, 'months').endOf('month').format('MM/DD/YYYY'));
            
            let rlt = await Booking.sum('afterDiscount_amount',{
                where: {
                            createdAt: { 
                                [Op.gt]: TODAY_START,
                                [Op.lt]: NOW
                            },
                        }
            });
            let crlt = await Booking.count({
                where: {
                            createdAt: { 
                                [Op.gt]: TODAY_START,
                                [Op.lt]: NOW
                            },
                            booking_complete : 1 
                        }
            });
            monthlyData.push(rlt);
            cMonthlyData.push(crlt);
        }
        const Mlabels = [
            moment().subtract(180, "days").format('MMM'),
            moment().subtract(150, "days").format('MMM'),
            moment().subtract(120, "days").format('MMM'),
            moment().subtract(90, "days").format('MMM'),
            moment().subtract(60, "days").format('MMM'),
            moment().subtract(30, "days").format('MMM'),
            moment().format('MMM'),
        ];

        let monthlyBookingData = {
            labels: Mlabels,
            series: [monthlyData],
        };

        let monthlyCompBookingData = {
            labels: Mlabels,
            series: [cMonthlyData],
        };

        let yearlyData = [];
        let cYearlyData = [];
        for(let i=6; i>=0; i--){
            let TODAY_START = new Date(moment().subtract(i, 'years').startOf('year').format('MM/DD/YYYY'));
            let NOW = new Date(moment().subtract(i, 'years').endOf('year').format('MM/DD/YYYY'));
            
            let rlt = await Booking.sum('afterDiscount_amount',{
                where: {
                            createdAt: { 
                                [Op.gt]: TODAY_START,
                                [Op.lt]: NOW
                            },
                        }
            });
            let crlt = await Booking.count({
                where: {
                            createdAt: { 
                                [Op.gt]: TODAY_START,
                                [Op.lt]: NOW
                            },
                            booking_complete : 1 
                        }
            });
            yearlyData.push(rlt);
            cYearlyData.push(crlt);
        }
        const yLables = [
            moment().subtract(2160, "days").format('YYYY'),
            moment().subtract(1800, "days").format('YYYY'),
            moment().subtract(1440, "days").format('YYYY'),
            moment().subtract(1080, "days").format('YYYY'),
            moment().subtract(720, "days").format('YYYY'),
            moment().subtract(360, "days").format('YYYY'),
            moment().format('YYYY'),
        ];
        let yearlyBookingData = {
            labels: yLables,
            series: [yearlyData],
        };

        let yearlyCompBookingData = {
            labels: yLables,
            series: [cYearlyData],
        };


        //   const { count } = await Technician.findAndCountAll();
        res.json({
            status: true,
            technician: Techcount.count,
            user: Usercount.count,
            complete_booking: Cpmolete_booking.count,
            inprohress_booking: inCpmolete_booking.count,
            total_earning: total_earning[0].dataValues.totalAmount,
            total_booking: total_booking.count,
            reject_booking: reject_booking.count,
            daily_active_booking: resu,
            dailyComplete_booking: resuu,
            user_data,
            technician_data,
            user_male_female,
            technician_male_female,
            earnings,
            dailyBookingData,
            monthlyBookingData,
            yearlyBookingData,
            dailyData,
            weeklyBookingData,
            weeklyData,
            dailyCompBookingData,
            weeklyCompBookingData,
            monthlyCompBookingData,
            yearlyCompBookingData
        });
    } catch (e) {
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

router.get("/payment_history", async (req, res) => {
    try {
        var amt = [];

        var amount = await Booking.findAll({
            where: {
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
            group: ["technicianId"],
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: Technician,
                    attributes: ["username", "email", "phone"]
                }
            ]
        }).then(async data => {
            // console.log(data);
            // return;
            var processedItems = 0;
            for (i = 0; i < data.length; i++) {
                var paid = await Paid.findAll({
                    where: {
                        technicianId: data[i].technicianId
                    },
                    attributes: [
                        "technicianId",
                        [
                            Sequelize.fn("sum", Sequelize.col("pay_amount")),
                            "totalPaidAmount"
                        ],
                        [
                            Sequelize.fn(
                                "sum",
                                Sequelize.col("after_discount")
                            ),
                            "after_paid_discount"
                        ]
                    ],
                    group: ["technicianId"],
                    order: [["id", "DESC"]]
                });
                console.log("paid", paid);
                var user_data = {
                    technicianId: data[i].dataValues.technicianId,
                    totalAmount: data[i].dataValues.totalAmount,
                    afterDiscountamount: data[i].dataValues.afterDiscountamount,
                    technician: data[i].dataValues.technician,
                    totalPaidAmount:
                        paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0
                };

                amt.push(user_data);
                processedItems += 1;

                if (processedItems === data.length) {
                    if (amt) {
                        res.json({
                            status: 200,
                            paymentHistory: amt,
                            count: data.length
                        });
                    } else {
                        res.json({
                            status: false
                        });
                    }
                }
            }
        });
    } catch (e) {
        // res.json({ status: 500, message: e });
    }
});
router.post("/paid_technician", async (req, res) => {
    try {
        const paid = new Paid(req.body);
        await paid.save();
        res.json({
            status: 200,
            message: "You have successfully paid to the technician"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/booking", async (req, res) => {
    try {
        const booking_history = await Booking.findAndCountAll({
            include: [
                {
                    // model: Technician,
                    model: Technician,
                    attributes: ["email", "username"]
                },
                {
                    // model: Technician,
                    model: User,
                    attributes: ["email", "username"]
                }
            ],

            order: [["createdAt", "DESC"]]
        });

        res.json({
            status: 200,
            booking_history: booking_history.rows,
            count: booking_history.count
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/payment_search", async (req, res) => {
    try {
        const { q } = req.query;

        var amt = [];
        var users = await Technician.findAll({
            where: {
                [Op.or]: [
                    { email: { [Op.like]: q + "%" } },
                    { phone: { [Op.like]: q + "%" } },
                    { username: { [Op.like]: q + "%" } }
                ]
            }
        });
        if (users.length === 0) {
            res.json({
                status: 200,
                paymentHistory: [],
                count: users.length
            });
        }
        var processedItems = 0;
        for (var i = 0; i < users.length; i++) {
            var amount = await Booking.findAll({
                where: {
                    technicianId: users[i].id,
                    booking_complete: true
                },
                attributes: [
                    "technicianId",
                    [
                        Sequelize.fn("sum", Sequelize.col("total_amount")),
                        "totalAmount"
                    ],
                    [
                        Sequelize.fn(
                            "sum",
                            Sequelize.col("afterDiscount_amount")
                        ),
                        "afterDiscountamount"
                    ]
                ],
                group: ["technicianId"],
                order: [["id", "DESC"]],
                include: [
                    {
                        model: Technician,
                        attributes: ["username", "email", "phone"]
                    }
                ]
            });

            var paid = await Paid.findAll({
                where: {
                    technicianId: users[i].id
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
                group: ["technicianId"],
                order: [["id", "DESC"]]
            });

            var user_data = {
                technicianId:
                    amount.length > 0 ? amount[i].dataValues.technicianId : 0,
                totalAmount:
                    amount.length > 0 ? amount[i].dataValues.totalAmount : 0,
                afterDiscountamount:
                    amount.length > 0
                        ? amount[i].dataValues.afterDiscountamount
                        : 0,
                technician:
                    amount.length > 0 ? amount[i].dataValues.technician : 0,
                totalPaidAmount:
                    paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0
            };

            amt.push(user_data);
            processedItems += 1;

            if (processedItems === users.length) {
                if (amt) {
                    res.json({
                        status: 200,
                        paymentHistory: amt,
                        count: users.length
                    });
                } else {
                    res.json({
                        status: false
                    });
                }
            }
        }
    } catch (e) {
        res.json({ status: 500, message: "Internal server error" });
    }
});
router.get("/export_user", async (req, res) => {
    try {
        var data = await User.findAll({
            attributes: ["username","country_code","phone", "email", "address"]
        });
        const { query } = req.query;
        if (query === "excel") {
            var filename = path.join(__dirname, "user.xlsx");
        } else {
            var filename = path.join(__dirname, "user.csv");
        }

        const output = []; // holds all rows of data

        const column = [];
        column.push("Username");
        column.push("Phone");
        column.push("Email");
        column.push("Address");
        output.push(column.join());
        data.forEach((d, c) => {
            const row = []; // a new array for each row of data
            row.push(d.username);
            row.push(d.country_code ? d.country_code+ d.phone : d.phone);
            row.push(d.email);
            row.push(d.address);

            output.push(row.join()); // by default, join() uses a ','
        });

        fs.writeFileSync(filename, output.join(os.EOL));
        setTimeout(function() {
            fs.unlink(filename, function(err) {
                // delete file after 30 sec
                if (err) {
                    console.error(err);
                }
                console.log("File has been Deleted");
            });
        }, 3000);
        res.download(filename);

        // await  res.download(filePath);
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/export_technician", async (req, res) => {
    try {
        var data = await Technician.findAll({
            attributes: ["username", "email","country_code","phone", "address"]
        });
        const { query } = req.query;
        if (query === "excel") {
            var filename = path.join(__dirname, "technician.xlsx");
        } else {
            var filename = path.join(__dirname, "technician.csv");
        }

        const output = []; // holds all rows of data

        const column = [];
        column.push("Username");
        column.push("Phone");
        column.push("Email");
        column.push("Address");
        output.push(column.join());
        data.forEach((d, c) => {
            const row = []; // a new array for each row of data
            row.push(d.username);
            row.push(d.country_code ? d.country_code+ d.phone : d.phone);
            row.push(d.email);
            row.push(d.address);
            output.push(row.join()); // by default, join() uses a ','
        });

        fs.writeFileSync(filename, output.join(os.EOL));
        setTimeout(function() {
            fs.unlink(filename, function(err) {
                // delete file after 30 sec
                if (err) {
                    console.error(err);
                }
                console.log("File has been Deleted");
            });
        }, 3000);
        res.download(filename);

        // await  res.download(filePath);
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/search_booking", async (req, res) => {
    try {
        const { q } = req.query;
        var booking_history = await Booking.findAndCountAll({
            where: {
                [Op.or]: [
                    { id: { [Op.like]: q + "%" } },
                    { status: { [Op.like]: q + "%" } },
                    { modelName: { [Op.like]: q + "%" } }
                ]
            },
            include: [
                {
                    // model: Technician,
                    model: Technician,
                    attributes: ["email", "username"]
                },
                {
                    // model: Technician,
                    model: User,
                    attributes: ["email", "username"]
                }
            ]
        });
        if (booking_history.length === 0) {
            res.json({
                status: 200,
                booking_history: [],
                count: booking_history.length
            });
        }

        res.json({
            status: 200,
            booking_history: booking_history.rows,
            count: booking_history.count
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});
router.get("/search_model", async (req, res) => {
    try {
        const { q } = req.query;
        var models = await Model.findAndCountAll({
            where: {
                [Op.or]: [
                    { en_name: { [Op.like]: q + "%" } },
                    { es_name: { [Op.like]: q + "%" } }
                ]
            },
            attributes: ["en_name", "es_name", "id", "brandId", "image"]
        });
        if (models.length === 0) {
            res.json({
                status: 200,
                models: models.rows,
                count: models.count
            });
        }

        res.json({
            status: 200,
            models: models.rows,
            count: models.count
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/export_payment", async (req, res) => {
    try {
        var amt = [];

        var amount = await Booking.findAll({
            where: {
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
            group: ["technicianId"],
            order: [["id", "DESC"]],
            include: [
                {
                    model: Technician,
                    attributes: ["username", "email", "phone"]
                }
            ]
        }).then(async data => {
            // console.log(data);
            // return;
            var processedItems = 0;
            for (i = 0; i < data.length; i++) {
                var paid = await Paid.findAll({
                    where: {
                        technicianId: data[i].technicianId
                    },
                    attributes: [
                        "technicianId",
                        [
                            Sequelize.fn("sum", Sequelize.col("pay_amount")),
                            "totalPaidAmount"
                        ],
                        [
                            Sequelize.fn(
                                "sum",
                                Sequelize.col("after_discount")
                            ),
                            "after_paid_discount"
                        ]
                    ],
                    group: ["technicianId"],
                    order: [["id", "DESC"]]
                });

                var user_data = {
                    technicianId: data[i].dataValues.technicianId,
                    totalAmount: data[i].dataValues.totalAmount,
                    afterDiscountamount: data[i].dataValues.afterDiscountamount,
                    technician: data[i].dataValues.technician,
                    totalPaidAmount:
                        paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0
                };

                amt.push(user_data);
                processedItems += 1;

                if (processedItems === data.length) {
                    if (amt) {
                        const { query } = req.query;
                        if (query === "excel") {
                            var filename = path.join(__dirname, "payment.xlsx");
                        } else {
                            var filename = path.join(__dirname, "payment.csv");
                        }

                        const output = []; // holds all rows of data

                        const column = [];

                        // const column = [];
                        column.push("Name");
                        column.push("Email");
                        column.push("Phone");
                        column.push("Total Amount");
                        column.push("Commisioned Amount");
                        column.push("Due Amount");
                        column.push("Paid Amount");
                        output.push(column.join());
                        amt.forEach((d, c) => {
                            var dueAmount =
                                parseInt(d.afterDiscountamount) -
                                parseInt(d.totalPaidAmount);
                            const row = []; // a new array for each row of data
                            row.push(d.technician.username);
                            row.push(d.technician.email);
                            row.push(d.technician.phone);
                            row.push(d.totalAmount);
                            row.push(d.afterDiscountamount);
                            row.push(dueAmount);
                            row.push(d.totalPaidAmount);
                            output.push(row.join()); // by default, join() uses a ','
                        });

                        fs.writeFileSync(filename, output.join(os.EOL));
                        setTimeout(function() {
                            fs.unlink(filename, function(err) {
                                // delete file after 30 sec
                                if (err) {
                                    console.error(err);
                                }
                                console.log("File has been Deleted");
                            });
                        }, 3000);
                        res.download(filename);
                    } else {
                        res.json({
                            status: false
                        });
                    }
                }
            }
        });
    } catch (e) {
        // res.json({ status: 500, message: e });
    }
});

router.get("/export_booking", async (req, res) => {
    try {
        const booking_history = await Booking.findAll({
            order: [["id", "DESC"]]
        });

        const { query } = req.query;
        if (query === "excel") {
            var filename = path.join(__dirname, "booking.xlsx");
        } else {
            var filename = path.join(__dirname, "booking.csv");
        }

        const output = []; // holds all rows of data

        const column = [];

        // const column = [];
        column.push("Booking Id");
        column.push("Model");
        column.push("Submission Date");
        column.push("Status");
        output.push(column.join());
        booking_history.forEach((d, c) => {
            const row = []; // a new array for each row of data
            row.push(d.id);
            row.push(d.modelName);
            row.push(d.dateTime);
            row.push(d.status);

            output.push(row.join()); // by default, join() uses a ','
        });

        fs.writeFileSync(filename, output.join(os.EOL));
        setTimeout(function() {
            fs.unlink(filename, function(err) {
                // delete file after 30 sec
                if (err) {
                    console.error(err);
                }
                console.log("File has been Deleted");
            });
        }, 3000);
        res.download(filename);
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/payment_filter", async (req, res) => {
    try {
        var amt = [];
        const{type,from,to} = req.query;

          if(type==='unpaid')
          {
           var where = {
             booking_complete: true,
                createdAt: {
               [Op.between]: [from, to]
            }
            };
          } else{
            var where = {
             booking_complete: true,
                
            };
          }
    

        var amount = await Booking.findAll({
            where: where,
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
            group: ["technicianId"],
            order: [["id", "DESC"]],
            include: [
                {
                    model: Technician,
                    attributes: ["username", "email", "phone"]
                }
            ]
        }).then(async data => {
            if(data.length==0)
            {
                
              res.json({
                 status: 200,
                 paymentHistory: data,
                 count: data.length
              });

            }
           
            var processedItems = 0;
            for (i = 0; i < data.length; i++) {

                if(type ==='paid')
                {
                    var paid = await Paid.findAll({
                    where: {
                        technicianId: data[i].technicianId,
                          createdAt: {
                            [Op.between]: [from, to]
                          }
                    },
                    attributes: [
                        "technicianId",
                        [
                            Sequelize.fn("sum", Sequelize.col("pay_amount")),
                            "totalPaidAmount"
                        ],
                        [
                            Sequelize.fn(
                                "sum",
                                Sequelize.col("after_discount")
                            ),
                            "after_paid_discount"
                        ]
                    ],
                    group: ["technicianId"],
                    order: [["id", "DESC"]]
                });
                    var amtt = [];
                    var processedItemss = 0;
                  for (j = 0; j < paid.length; j++) {
                   var paid_unpaid = paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0;
                   if(paid_unpaid!=0)
                   {

                  var user_data = {
                    technicianId: data[i].dataValues.technicianId,
                    totalAmount: data[i].dataValues.totalAmount,
                    afterDiscountamount: data[i].dataValues.afterDiscountamount,
                    technician: data[i].dataValues.technician,
                    totalPaidAmount:
                        paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0
                    };

                   }

               }
               amtt.push(user_data);
                processedItemss += 1;
                if (processedItemss === paid.length) {
                    if (amt) {
                        res.json({
                            status: 200,
                            paymentHistory: amtt,
                            count: paid.length
                        });
                    } else {
                        res.json({
                            status: false
                        });
                    }
                }
                  
                }else{
                    var paid = await Paid.findAll({
                    where: {
                        technicianId: data[i].technicianId,
                          
                    },
                    attributes: [
                        "technicianId",
                        [
                            Sequelize.fn("sum", Sequelize.col("pay_amount")),
                            "totalPaidAmount"
                        ],
                        [
                            Sequelize.fn(
                                "sum",
                                Sequelize.col("after_discount")
                            ),
                            "after_paid_discount"
                        ]
                    ],
                    group: ["technicianId"],
                    order: [["id", "DESC"]]
                });
                   var paid_unpaid = paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0;
                   if(paid_unpaid===0)
                   {


                        var user_ddata = {
                            technicianId: data[i].dataValues.technicianId,
                            totalAmount: data[i].dataValues.totalAmount,
                            afterDiscountamount: data[i].dataValues.afterDiscountamount,
                            technician: data[i].dataValues.technician,
                            totalPaidAmount:
                                paid.length > 0 ? paid[0].dataValues.totalPaidAmount : 0
                            };

                   }

                }

              

                
            amt.push(user_ddata);
                processedItems += 1;
               

     

                if (processedItems === data.length) {
                    if (amt) {
                        res.json({
                            status: 200,
                            paymentHistory: amt,
                            count: data.length
                        });
                    } else {
                        res.json({
                            status: false
                        });
                    }
                }
               
            }
        });
    } catch (e) {
        // res.json({ status: 500, message: e });
    }
});


router.get("/daily_booking_filter", async (req, res) => {
    try {
        
        let resuu = [];
        var d = new Date();
        var year = d.getFullYear();
        
        if(req.query.type==='yearly')
        {
            var daily_complete_booking = await db.query(
            `SELECT YEAR(createdAt) YEAR, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND  booking_complete = false GROUP BY YEAR(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );

             daily_complete_booking.map((data, index) => {
                console.log(data)
            var obj = {};
            obj[data.YEAR] = data.COUNT;
            resuu.push(obj);
        });
              res.json({
            status: true,
            
            dailyComplete_booking: resuu,
            
        });

        }
        if(req.query.type==='monthly')
        {
             var daily_complete_booking = await db.query(
            `SELECT MONTHNAME(createdAt) MONTH, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND  booking_complete = false GROUP BY MONTHNAME(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );
             daily_complete_booking.map((data, index) => {
            var obj = {};
            obj[
                moment()
                    .month(data.MONTH)
                    .format("MMM")
            ] = data.COUNT;
            resuu.push(obj);
        });
              res.json({
            status: true,
            
            dailyComplete_booking: resuu,
            
        });
        }
      
        if(req.query.type==='weekly')
        {
             var daily_complete_booking = await db.query(
            `SELECT WEEK(createdAt) WEEK, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND  booking_complete = true GROUP BY WEEK(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );
             daily_complete_booking.map((data, index) => {
              
            var obj = {};
            obj[
                moment()
                    .month(data.WEEK)
                    .format("[Week]WW-MMM")
            ] = data.COUNT;
            resuu.push(obj);
        });
              res.json({
            status: true,
           
            dailyComplete_booking: resuu,
            
        });
        }
      
       
       
    } catch (e) {
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

router.get("/complete_booking_filter", async (req, res) => {
    try {


      
        let resuu = [];
        var d = new Date();
        var year = d.getFullYear();
        
        if(req.query.type==='yearly')
        {
            var daily_complete_booking = await db.query(
            `SELECT YEAR(createdAt) YEAR, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND  booking_complete = false GROUP BY YEAR(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );

             daily_complete_booking.map((data, index) => {
                console.log(data)
            var obj = {};
            obj[data.YEAR] = data.COUNT;
            resuu.push(obj);
        });
              res.json({
            status: true,
            
            dailyComplete_booking: resuu,
            
        });

        }
        if(req.query.type==='monthly')
        {
             var daily_complete_booking = await db.query(
            `SELECT MONTHNAME(createdAt) MONTH, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND  booking_complete = false GROUP BY MONTHNAME(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );
             daily_complete_booking.map((data, index) => {
            var obj = {};
            obj[
                moment()
                    .month(data.MONTH)
                    .format("MMM")
            ] = data.COUNT;
            resuu.push(obj);
        });
              res.json({
            status: true,
            
            dailyComplete_booking: resuu,
            
        });
        }
      
        if(req.query.type==='weekly')
        {
             var daily_complete_booking = await db.query(
            `SELECT WEEK(createdAt) WEEK, COUNT(*) COUNT FROM  bookings WHERE YEAR(createdAt)=${year} AND  booking_complete = false GROUP BY WEEK(createdAt)`,
            { type: db.QueryTypes.SELECT }
        );
             daily_complete_booking.map((data, index) => {
              
            var obj = {};
            obj[
                moment()
                    .month(data.WEEK)
                    .format("[Week]WW-MMM")
            ] = data.COUNT;
            resuu.push(obj);
        });
              res.json({
            status: true,
           
            daily_active_booking: resuu,
            
        });
        }
      
       
       
    } catch (e) {
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

module.exports = router;
