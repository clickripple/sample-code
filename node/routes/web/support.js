const router = require("express").Router(),
    Support = require("../../db").models.supports,
    Supportmail = require("../../db").models.supportmails,
    User = require("../../db").models.users,
    config = require("../../common/config"),
    Op = require("sequelize").Op,
    { send_Email } = require("../../common/mailer");
    var csv_export = require("csv-export");
const fs = require("fs");
const path = require("path");
const os = require("os");

router.get("", async (req, res) => {
    try {
        var support = await Support.findAndCountAll({
            include: [
                {
                    model: User,

                    attributes: ["username", "email", "phone"]
                }
            ],
            order: [["id", "DESC"]]
        });

        res.json({
            status: 200,
            support: support.rows,
            count: support.count
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.put("", async (req, res) => {
    try {
        const { id, subject, message, email } = req.body;

        if (id === "") {
            res.json({
                status: 500,
                message: "Please enter missing field"
            });
        }

        send_Email(config.mailer_mail, email, subject, message);

        var support_update = await Support.update(
            { status: true, mail_subject: subject, mail_message: message },
            {
                where: {
                    id
                }
            }
        );
        if (support_update) {
            res.json({
                status: 200,
                message: "Status updated successfully"
            });
        } else {
            res.json({
                status: 500,
                message: "Something went wrong"
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/user_search", async (req, res) => {
    try {
        const { q } = req.query;
        var support = [];
        var users = await User.findAll({
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
                support: [],
                count: users.length
            });
        }
        var processedItems = 0;
        for (var i = 0; i < users.length; i++) {
            var supports = await Support.findAll({
                where: {
                    userId: users[i].id
                },
                include: [
                    {
                        model: User,

                        attributes: ["username", "email", "phone"]
                    }
                ],
                order: [["id", "DESC"]]
            });

            if (supports.length > 0) {
                for (var j = 0; j < supports.length; j++) {
                    support.push(supports[j]);
                }
            }

            processedItems += 1;

            if (processedItems === users.length) {
                if (support) {
                    res.json({
                        status: 200,
                        support,
                        count: support.length
                    });
                } else {
                    res.json({
                        status: 500
                    });
                }
            }
        }
    } catch (e) {
        res.json({ status: 500, message: "Internal server error" });
    }
});


router.get("/export_support", async (req, res) => {
    try {
        var support = await Support.findAll({
            include: [
                {
                    model: User,

                    attributes: ["username", "email", "phone"]
                }
            ],
            order: [["id", "DESC"]]
        });
                        if(req.query.query==="excel")
                        {
                            var filename = path.join(__dirname, "support.xlsx");
                        }else{
                            var filename = path.join(__dirname, "support.csv");
                        }
        
        const output = []; // holds all rows of data

        const column = [];

        // const column = [];
        column.push("User Name");
        column.push("User Email");
        column.push("Issue");
        column.push("Status");
        output.push(column.join());
        support.forEach((d, c) => {
            
            const row = []; // a new array for each row of data
            row.push(d.user.username);
            row.push(d.user.email);
            row.push(d.subject);
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

        // res.json({
        //     status: 200,
        //     support: support.rows,
        //     count: support.count
        // });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});
module.exports = router;
