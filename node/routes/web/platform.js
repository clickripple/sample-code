const router = require("express").Router(),
    Platform = require("../../db").models.platforms;

// get platforms list
router.get("", async (req, res) => {
    try {
        const platforms = await Platform.findAndCountAll({
             order: [
            ['id', 'DESC']
           
        ],
        });
        res.json({
            status: 200,
            platforms: platforms.rows,
            count: platforms.count
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// add platform
router.post("", async (req, res) => {
    try {
       
        const platform = new Platform(req.body);
        await platform.save();
        res.json({
            status: 200,
            message: "Platform added successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// delete platform
router.delete("", async (req, res) => {
    try {
        const { id } = req.query;
        await Platform.destroy({
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "Platform deleted successfully"
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
        const { id } = req.body;
        await Platform.update(req.body, {
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "Platform updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// get platform
router.get("/details", async (req, res) => {
    try {
        const { id } = req.query;
        const platform = await Platform.findOne({
            where: {
                id
            },
            
        });
        res.json({
            status: 200,
            platform
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

module.exports = router;
