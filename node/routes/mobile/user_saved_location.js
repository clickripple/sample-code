const router = require("express").Router(),
        seq = require("../../db"),
        Session = require("../../db").models.login_sessions,
        Savelocation = require("../../db").models.user_saved_location,
        jwt = require("jsonwebtoken"),
        config = require("../../common/config"),
        Notification = require("../../db").models.notifications,
        random = require("random-string-generator"),
        upload = require("../../common/multer"),
        Op = require("sequelize").Op,
        SALT_WORK_FACTOR = 14,
        bcrypt = require("bcrypt")
,
        {send_Email} = require("../../common/mailer"),
verifyToken = require("../../common/auth")
,
        {
            compareTechPassword,
            encryptPassword,
            tech_change_Password
        } = require("../../common/bcrypt");

router.post("/save", verifyToken, async (req, res) => {
    try {
        const {lang} = req.body;
        var token = req.headers.authorization.split("Bearer ");
        var decoded = jwt.verify(token[1], config.secretKey);
        req.body.id = decoded.id;
        console.log(req.body);
        const saveLocation = new Savelocation(req.body);
        const temp = await saveLocation.save();
        console.log(temp);

        if (temp) {
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


router.post("/list", verifyToken, async (req, res) => {
    try {
        const {lang} = req.body;
        var userId=req.body.userId;
        var token = req.headers.authorization.split("Bearer ");
        var decoded = jwt.verify(token[1], config.secretKey);
        console.log(decoded.id)
        query = "SELECT lat,lng,curr_address FROM user_saved_locations where userId like '"+userId+"' ORDER BY id desc limit 5";
        console.log(query)
        const result = seq.query(query, {
            type: seq.QueryTypes.SELECT
        }).then(async user_location => {

            console.log(user_location);

            if (user_location.length < 1) {
                res.json({status: false, message: "Record Not Found"});
            } else {
                if (lang === "es") {
                    var message = "Lista con éxito";
                } else {
                    var message = "Successfully List";
                }
                res.json({
                    status: true,
                    location_list:user_location,
                    message
                });
            }
        });


    } catch (e) {
        res.json({
            status: "500",
            error: e,
            message: "Internal server error"
        });
    }
});

module.exports = router;