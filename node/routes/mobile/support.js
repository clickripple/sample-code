const router = require("express").Router(),
    Support = require("../../db").models.supports,
    User = require("../../db").models.users,
    jwt = require("jsonwebtoken"),
    verifyToken = require("../../common/auth"),
    config = require("../../common/config");
    Cms = require("../../db").models.cms,

router.post("", verifyToken, async (req, res) => {
    try {
        var token = req.headers.authorization.split("Bearer ");
        var decoded = jwt.verify(token[1], config.secretKey);
        req.body.status = false;
        req.body.userId = decoded.id;
        const support = new Support(req.body);
        await support.save();
        res.json({
            status: 200,
            message:
                "Your query is submit successfully, We will contact you soon"
        });
    } catch (e) {
        res.json({
            e,
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("", verifyToken, async (req, res) => {
    try {
        var token = req.headers.authorization.split("Bearer ");
        var decoded = jwt.verify(token[1], config.secretKey);
        console.log(decoded);
        var support = await Support.findAll({ where: { userId: decoded.id } });
        if (support) {
            res.json({
                status: 200,
                support
            });
        } else {
            res.json({
                status: 404,
                message: "No data found"
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/getDetail", async (req, res) => {
    try {
        const { id } = req.query;
        if (id === "") {
            res.json({
                status: 500,
                message: "Please enter missing field"
            });
        }
        var support = await Support.findOne({
            where: {
                id
            }
        });

        if (support) {
            support.attachment = JSON.parse(support.attachment);
            res.json({
                status: 200,
                support
            });
        } else {
            res.json({
                status: 404,
                message: "No data found"
            });
        }
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
        res.json({
            status: 200,
            image: cms_data.available_area_image
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
})
module.exports = router;
