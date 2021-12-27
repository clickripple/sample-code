const router = require("express").Router(),
    Model = require("../../db").models.models,
    Platform = require("../../db").models.platforms,
    Brand = require("../../db").models.brands,
    Booking = require("../../db").models.bookings,
    Sequelize = require("sequelize");
// get models list

router.get("", async (req, res) => {
    try {
        var models;

        //Seeding release date in database for iPhones
        const data = require('./../../mobile.json');
        for(let i= 0;i<data.length; i++){
            let phone = data[i].Phone;
            let announced = data[i].Announced;
            announced = announced.substring(0, announced.length-1);
            announced = new Date(announced);
            const model = await Model.findOne({
                where:{
                    en_name : phone.substring(6,phone.length)
                }
            })
            if (model !== null) {
                model.update({
                    release_date: announced
                })
                await model.save();
            }
        }

        const { platformId, brandId } = req.query;
        if (brandId !== "" && platformId !== "") {
            models = await Model.findAndCountAll({
                where: { brandId },
                include: [
                    {
                        model: Brand,
                        where: {
                            platformId
                        },
                        required: true
                    }
                ],
                order: [['release_date', "DESC"]]
            });
        } else if (brandId === "" && platformId !== "") {
            models = await Model.findAndCountAll({
                include: [
                    {
                        model: Brand,
                        where: {
                            platformId
                        },
                        required: true
                    }
                ],
                order: [['release_date', "DESC"]]
            });
        } else if (brandId !== "" && platformId === "") {
            const { brandId } = req.query;
            models = await Model.findAndCountAll({
                where: {brandId},
                include: [
                    {
                        model: Brand,
                        required: true
                    }
                ],
                order: [['release_date', "DESC"]]
            });
        } else {
            models = await Model.findAndCountAll({
                include: [
                    {
                        model: Brand,
                        required: true
                    }
                ],
                order: [['release_date', "DESC"]]
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
            message: "Internal server error " +e
        });
    }
});

router.get("/datamodels", async (req,res) =>{
    try{
        models = [];
        //Seeding release date in database for iPhones
        const data = require('./../../mobile.json');
        for(let i= 0;i<data.length; i++){
            let phone = data[i].Phone;
            let announced = data[i].Announced;
            announced = announced.substring(0, announced.length-1);
            announced = new Date(announced);
            const model = await Model.findOne({
                where:{
                    en_name : phone.substring(6,phone.length)
                }
            })
            if (model !== null) {
                model.update({
                    release_date: announced
                })
                await model.save();
            }
        }
        res.json({
            status: 200,
            models
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error " +e
        });
    }
})

// add model
router.post("", async (req, res) => {
    try {
        
        const model = new Model(req.body);
        await model.save();
        res.json({
            status: 200,
            message: "Model added successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// delete model
router.delete("", async (req, res) => {
    try {
        const { id } = req.query;
        await Model.destroy({
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "Model deleted successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// edit model
router.put("", async (req, res) => {
    try {
        const { id } = req.body;
        await Model.update(req.body, {
            where: {
                id
            }
        });
        res.json({
            status: 200,
            message: "Model updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// get model
router.get("/details", async (req, res) => {
    try {
        const { id } = req.query;
        const model = await Model.findOne({
            where: {
                id
            }
        });
        res.json({
            status: 200,
            model
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

router.get("/modelCount", async (req, res) => {
    try {
        
        var data = await Platform.findAll();

        var android_data = [];
        var ios_data = [];
        var processedItems = 0;
        // res.json(data);
        for (var i = 0; i < data.length; i++) {
            var element = data[i].en_name;

            if (element === "Android") {
                var android = await Brand.findAll({
                    where: {
                        platformId: data[i].id
                    },
                    include: [
                        {
                            model: Model
                        }
                    ]
                });

                // var model_count = android[i].brands[i].models;
                
               var Samsung = [];
               var Huawei = [];

                // console.log(model_count.length)
                for (var j = 0; j < android.length; j++) {
                    const model_data = android[j].models;

                    // console.log(android[j].en_name);
                    for (var ii = 0; ii < model_data.length; ii++) {
                        var model_id = model_data[ii].id;

                        if(android[j].en_name==='Samsung')
                        {
                            var daily_count = await Booking.findAll({
                                            where: {
                                                modelId: model_id
                                            },

                                            attributes: [
                                                "modelName",
                                                [
                                                    Sequelize.fn("COUNT", "modelId"),
                                                    "android_modelIssueCount"
                                                ]
                                            ]
                                        });
                            res.json({
                                status: 200,
                                daily_count
                            });
                        // res.json(daily_count);
                        daily_count.map((dataa, index) => {
                            var obj = {};
                            if (dataa.dataValues.modelName != null) {
                                obj[dataa.dataValues.modelName] =
                                    dataa.dataValues.android_modelIssueCount;
                                    Samsung.push(obj)
                               
                            }
                        });

                        }
                         if(android[j].en_name==='Huawei')
                        {
                             var daily_count = await Booking.findAll({
                            where: {
                                modelId: model_id
                            },

                            attributes: [
                                "modelName",
                                [
                                    Sequelize.fn("COUNT", "modelId"),
                                    "android_modelIssueCount"
                                ]
                            ]
                        });
                        daily_count.map((dataa, index) => {
                            var obj = {};
                            if (dataa.dataValues.modelName != null) {
                                obj[dataa.dataValues.modelName] =
                                    dataa.dataValues.android_modelIssueCount;
                                    Huawei.push(obj)
                                
                            }
                        });

                        }
                       
                    }
                }
            }
            if (element === "IOS") {
                var android = await Brand.findAll({
                    where: {
                        platformId: data[i].id
                    },
                    include: [
                        {
                            model: Model
                        }
                    ]
                });
                // var model_count = android[i].brands[i].models;
                console.log(android.length);

                // console.log(model_count.length)
                for (var j = 0; j < android.length; j++) {
                    const model_data = android[j].models;
                    for (var ii = 0; ii < model_data.length; ii++) {
                        var model_id = model_data[ii].id;
                        const daily_count = await Booking.findAll({
                            where: {
                                modelId: model_id
                            },

                            attributes: [
                                "modelName",
                                [
                                    Sequelize.fn("COUNT", "modelId"),
                                    "android_modelIssueCount"
                                ]
                            ]
                        });
                        daily_count.map((dataa, index) => {
                            var obj = {};
                            if (dataa.dataValues.modelName != null) {
                                obj[dataa.dataValues.modelName] =
                                    dataa.dataValues.android_modelIssueCount;
                                ios_data.push(obj);
                            }
                        });
                    }
                }
            }

            processedItems += 1;

            if (processedItems === data.length) {
                res.json({
                    status: 200,
                    
                         android_data:Samsung,
                         huwaei_data:Huawei,
                         ios_data
                });
            }
        }
    } catch (e) {
        res.json({
            status: e,
            message: "Internal server error"
        });
    }
});

module.exports = router;
