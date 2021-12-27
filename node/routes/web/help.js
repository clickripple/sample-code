const router = require("express").Router(),
    Help = require("../../db").models.helps;

router.post("", async (req, res) => {
    try {
        // res.json(req.body);
        req.body.help_data = JSON.stringify(req.body.help_data);
        const help = new Help(req.body);
        await help.save();
        res.json({
            status: 200,
            message: "Data added"
        });
    } catch (e) {
        console.log(e);
        res.json({
            status: 400,
            message: "Internal server error"
        });
    }
});
// delete platform
router.delete("", async (req, res) => {
    try {
        const { brandId } = req.query;
        await Help.destroy({
            where: {
                brandId
            }
        });
        res.json({
            status: 200,
            message: "Data deleted successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// edit platform
router.put("", async (req, res) => {
    try {
        console.log(req.body);
        req.body.help_data = JSON.stringify(req.body.help_data);
        await Help.update(req.body, {
            where: {
                brandId: req.body.brandId
            }
        });
        res.json({
            status: 200,
            message: "Data updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// get platform
router.get("", async (req, res) => {
    try {
        const { brandId } = req.query;

        var helpdata = [];
        if (brandId == "") {
            var data = await Help.findAll();
            if (data) {
                data.forEach(item => {
                    var datad = {
                        id: item.id,
                        help_data: JSON.parse(item.help_data),
                        brandId: item.brandId
                    };
                    helpdata.push(datad);
                });
                res.json({
                    status: 200,
                    helpdata
                });
            } else {
                res.json({
                    status: 200,
                    helpdata
                });
            }
        } else {
            var helpdata = await Help.findOne({
                where: {
                    brandId
                }
            });
            if (helpdata) {
                helpdata.help_data = JSON.parse(helpdata.help_data);
                res.json({
                    status: 200,
                    helpdata
                });
            } else {
                res.json({
                    status: 200,
                    helpdata
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

module.exports = router;
