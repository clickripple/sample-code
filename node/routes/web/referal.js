const router = require("express").Router(),
    Referal = require("../../db").models.referals,
    Technician = require("../../db").models.technicians,
    Cms = require("../../db").models.cms,
    Problem = require("../../db").models.problems,
    TechSupport = require("../../db").models.tech_supports,
    Discount = require("../../db").models.discount,
    jwt = require("jsonwebtoken"),
    config = require("../../common/config");

router.get("", async (req, res) => {
    try {
        const reff = await Referal.findOne();
        const cms_data = await Cms.findOne();
        const discounts = await Discount.findAll();
       
        if (reff) {
            let images = {
                image1: cms_data.available_area_image,
                image2: cms_data.available_image2,
                image3: cms_data.available_image3,
                image4: cms_data.available_image4,
                image5: cms_data.available_image5,
                video: cms_data.video,
            }
            let refferal = {
                id: reff.id,
                amount: reff.amount,
                discount: reff.discount,
                createdAt: reff.createdAt,
                updatedAt: reff.updatedAt,
                images,
                discounts,
                promo_text_en: cms_data.promo_text_en,
                promo_text_es: cms_data.promo_text_es
            }
            res.json({
                status: true,
                referal: refferal
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
            message: "Internal server error" + e
        });
    }
});

router.get("/problems", async (req, res) => {
    let problems = await Problem.findAll();
    res.json({
        status: 200,
        data: problems
    })
});

router.get("/tech_supports", async (req, res) => {
    try{

        let problems = await TechSupport.findAll();
        res.json({
            status: 200,
            data: problems
        })
    } catch (e) {
        res.json({
            status: 500,
            message: e && e.message ? e.message : "Internal Server Error"
        });
    }
});

router.post("/problem/create", async (req, res) => {
    let { title, type } = req.body;
    await Problem.create({ title, type});
    res.json({
        status: 200,
        data: "Problem created successfully!"
    });
});

router.post("/problem/update", async (req, res) => {
    let { title, type, id } = req.body;

    await Problem.update({
         title, 
         type 
        },{
        where: { id }
    });

    res.json({
        status: 200,
        data: "Problem updated successfully!"
    });
});

router.post("/problem/delete", async (req, res) => {
    let { id } = req.body;

    await Problem.destroy({
        where: { id }
    });

    res.json({
        status: 200,
        message: "Problem deleted successfully!"
    });
});

router.post("/udpateStatus", async (req, res)=>{
    try {
        const {id} = req.body;
        let discount = await Discount.findOne({
            where: { id }
        });
        const status = discount.status == "active" ? "inactive" : "active";
        console.log(status);
        await Discount.update({
            status: status
        },{
            where: { id}
    });
        console.log(id);
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.post("/udpatePromo", async (req, res)=>{
    try {
        const {promo_text_en , promo_text_es } = req.body;
        const cms_data = await Cms.findOne();
        cms_data.promo_text_en = promo_text_en;
        cms_data.promo_text_es = promo_text_es;
        await cms_data.save();
        
        res.json({
            status: 200,
            message: "Updated successfully!"
        })
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.post("/deleteDiscount", async (req, res)=>{
    try {
        const { id } = req.body;

        await Discount.destroy({
            where: {
                id: id
            }
        });

        res.json({
            status: 200,
            message: "Discount code deleted successfully!"
        })

    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.post("/updateDiscount", async (req, res)=>{
    try {
        const {code, discount, id} = req.body;

        let discount_code = await Discount.findOne({
            where: {
                id: id
            }
        });

        discount_code.code = code;
        discount_code.discount_percent = discount;
        await discount_code.save();

        res.json({
            status: 200,
            message: "Discount code updated successfully!"
        })
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.post("/addDiscount", async (req, res)=>{
    try {
        const {code, discount} = req.body;
        await Discount.create({
            code,
            discount_percent : discount,
            status: "active"
        })

        res.json({
            status: 200,
            message: "Discount code added successfully!"
        })
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.put("", async (req, res) => {
    try {
        const { id, amount ,discount } = req.body;
        await Referal.update(
            {
                amount,
                discount
            },
            {
                where: {
                    id
                }
            }
        );
        res.json({
            status: true,
            message: "referal updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});
module.exports = router;
