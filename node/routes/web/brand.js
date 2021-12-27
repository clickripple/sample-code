const router = require("express").Router(),
    Brand = require("../../db").models.brands;

// get brands list
router.get("", async (req, res) => {
    try {
        var brands;
        if (req.query) {
            const { platformId } = req.query;
            if (platformId !== "") {
                brands = await Brand.findAndCountAll({ where: { platformId }, order: [
            ['id', 'DESC']
           
        ], });
            } else {
                brands = await Brand.findAndCountAll({ order: [
            ['id', 'DESC']
           
        ],});
            }
        } else {
            brands = await Brand.findAndCountAll({ order: [
            ['id', 'DESC']
           
        ],});
        }

        res.json({
            status: 200,
            brands: brands.rows,
            count: brands.count
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// add brand
router.post("", async (req, res) => {
    try {
        const brand = new Brand(req.body);
        await brand.save();
        res.json({
            status: 200,
            message: "Brand added successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            e,
            message: "Internal server error"
        });
    }
});

// delete brand
router.delete("", async (req, res) => {
    try {
        const { id } = req.query;
        await Brand.destroy({
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "Brand deleted successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// edit brand
router.put("", async (req, res) => {
    try {
        const { id } = req.body;
        await Brand.update(req.body, {
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "Brand updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// get brand
router.get("/details", async (req, res) => {
    try {
        const { id } = req.query;
        const brand = await Brand.findOne({
            where: {
                id
            }
        });
        res.json({
            status: 200,
            brand
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

module.exports = router;
