const router = require("express").Router(),
    Help = require("../../db").models.helps;

router.get("", async (req, res) => {
    try {
        const { brandId } = req.query;

        var helpdata = [];
        if (brandId == "") {
            return res.json({
                status: false,
                message: "Brand ID is missing"
            });
        } else {
            var helpdata = await Help.findOne({
                where: {
                    brandId
                }
            });
            if (helpdata) {
                helpdata.help_data = JSON.parse(helpdata.help_data);
                res.json({
                    status: true,
                    helpdata
                });
            } else {
                res.json({
                    status: false,
                    message: "No data found"
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

router.get("/help-centre", async (req, res) => {
    try {
        var helpdata = [];

        var data = await Help.findAll();
        if (data > 0) {
            data.forEach(item => {
                var datad = {
                    id: item.id,
                    help_data: JSON.parse(item.help_data),
                    brandId: item.brandId
                };
                helpdata.push(datad);
            });
            res.json({
                status: true,
                helpdata
            });
        } else {
            res.json({
                status: false,
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

module.exports = router;
