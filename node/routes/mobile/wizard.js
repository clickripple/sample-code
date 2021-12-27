const router = require("express").Router(),
  Model = require("../../db").models.models,
  Brand = require("../../db").models.brands,
  Platform = require("../../db").models.platforms,
  Issue = require("../../db").models.issues,
  Help = require("../../db").models.helps,
  Newsletter = require("../../db").models.newsletter,
  Problem = require("../../db").models.problems,
  TechSupport = require("../../db").models.tech_supports,
  Op = require("sequelize").Op,
  config = require("../../common/config"),
  { send_Email } = require("../../common/mailer")

// Home screen
router.get("/home", async (req, res) => {
  try {
    const { lang } = req.query;
    var devices = [];
    // var models = [];
    const device = await Brand.findAll({
      attributes: ["en_name", "es_name", "id"],
      include: [
        {
          model: Model,
          attributes: ["id", "es_name", "en_name", "image", "brandId", "release_date"],
        },
      ],
       order: [
          // Will escape title and validate DESC against a list of valid direction parameters
          ['data_order', 'ASC'],
        ]
    });
    if (device != "") {
      var processedItems = 0;
      var datad = {};
      var data = {};
      for (var i = 0; i < device.length; i++) {
        var element = device[i];
        if (lang === "es") {
          var datak = {
            id: element.id,
            name: element.es_name,
            models: [],
          };
        } else {
          var datak = {
            id: element.id,
            name: element.en_name,
            models: [],
          };
        }

        if (element.models == []) {
        } else {
            element.models = element.models.sort(function (a,b){
              return b.release_date - a.release_date;
            })
          
          for (var k = 0; k < element.models.length; k++) {
            if (lang === "es") {
              var ll = {
                id: element.models[k].id,
                name: element.models[k].es_name,
                brandId: element.models[k].brandId,
                image: element.models[k].image,
              };
              datak.models.push(ll);
            } else {
              var ll = {
                id: element.models[k].id,
                name: element.models[k].en_name,
                brandId: element.models[k].brandId,
                image: element.models[k].image,
              };
              datak.models.push(ll);
            }

          }
        }

        devices.push(datak);
        processedItems += 1;

        if (processedItems === device.length) {
          if (devices == "") {
            if (lang === "es") {
              var message = "Datos no encontrados";
            } else {
              var message = "No data found";
            }
            res.json({
              status: false,
              message,
            });
          } else {
            res.json({
              status: true,
              devices,
            });
          }
        }
      }
    } else {
      if (lang === "es") {
        var message = "Datos no encontrados";
      } else {
        var message = "No data found";
      }
      res.json({
        status: false,
        message,
      });
    }
  } catch (e) {
    res.json({ status: 500, message: "Internal server errora" });
  }
});

router.get("/problems", async (req, res) => {
  try{

    let { type } = req.query;

    let problems = await Problem.findAll({
      where: { type }
    });
    let rslt = [];

    problems.forEach((element) => {
      rslt.push(element.title)
    });

    res.json({
        status: 200,
        data: rslt
    })
  }catch(e){
    res.json({status:500, message: e && e.message ? e.message : "Internal Server Error" });
  }

});
router.get("/tech_support/tickets", async (req, res) => {
  try{
    let { email } = req.query;
    if(!email){
      res.json({status:false, message: "Email is required"}); return;
    }
    let supports = await TechSupport.findAll({
      where: { email }
    });
    res.json({status:true, supports });
  }catch(e){
    res.json({status:false, message: e && e.message ? e.message : "Internal Server Error" });
  }
});

router.post("/tech_support/create", async (req, res) => {
  try{
    let { issueType, issueTitle, message, email, bookingId } = req.body;
    let msg;
    let invalid = false;
    let types = ['Client','Payment','Service'];
    if(!issueType){
      invalid = true;
      msg = "The field issue type is required"  
    }else{
      if(!types.includes(issueType)){
        invalid = true;
        msg = "Invalid issue type"  
      }
    }
    if(!issueTitle){
      invalid = true;
      msg = "The field issue title is required"  
    }
    if(!message){
      invalid = true;
      msg = "The field message is required"  
    }
    if(!email){
      invalid = true;
      msg = "The field email is required"  
    }

    if(invalid){
      res.json({status:500, message: msg}); return;
    }
    let subject = issueType + " : " + issueTitle;
    let body = `<div>
                      <h4>Hello Support Team,</h4> 
                      <p>Message posted by user - ${email} is : </p>
                      <div>
                        ${message}
                      </div>
                      <p>Thank you</p>
                      <p>Blackpatch Team</p>
                  </div>`;
    await send_Email(config.mailer_mail,"shobhit@yopmail.com",subject,body);
    await TechSupport.create({ issueTitle, issueType, email , message, bookingId});
    res.json({ status: 200, message: "Email sent successfully!"})

  }catch(e){
    res.json({status:500, message: e && e.message ? e.message : "Internal Server Error" });
  }
});

router.get("/brand", async (req, res) => {
  try {
    const { lang } = req.query;
    const branddat = await Brand.findAll();
    var datad = {};
    var brand_data = [];
    branddat.forEach((element) => {
      if (lang === "es") {
        datad = {
          id: element.id,
          name: element.es_name,
          image: element.image,
          platformId: element.platformId,
        };
      } else {
        datad = {
          id: element.id,
          name: element.en_name,
          image: element.image,
          platformId: element.platformId,
        };
      }

      brand_data.push(datad);
    });
    if (branddat) {
      res.json({
        status: true,
        branddata: brand_data,
      });
    } else {
      if (lang === "es") {
        var message = "Datos no encontrados";
      } else {
        var message = "No data found";
      }
      res.json({
        status: false,
        message,
      });
    }
  } catch (e) {
    res.json({ status: 500, message: "Internal server error" });
  }
});
// get all platforms
router.get("/platform", async (req, res) => {
  try {
    var platforms = [];

    const { lang } = req.query;

    var platform = await Platform.findAll();
    var datad = {};
    if (platform) {
      platform.forEach((element) => {
        if (lang === "es") {
          datad = {
            id: element.id,
            name: element.es_name,
          };
          platforms.push(datad);
        } else {
          datad = {
            id: element.id,
            name: element.en_name,
          };
          platforms.push(datad);
        }
      });

      res.json({
        status: true,
        platforms,
      });
    } else {
      res.json({
        status: false,
        message: "No data found",
      });
    }
  } catch (e) {
    res.json({ status: 500, message: "Internal server error" });
  }
});

// // get all brands for selected platform
router.get("/brand", async (req, res) => {
  try {
    const { platformId, lang } = req.query;
    const brands = await Brand.findAll({
      where: { platformId },
    });
    if (brands) {
      res.json({
        status: true,
        brands,
      });
    } else {
      if (lang === "es") {
        var message = "Datos no encontrados";
      } else {
        var message = "No data found";
      }
      res.json({
        status: false,
        message,
      });
    }
  } catch (e) {
    res.json({ status: 500, message: "Internal server error" });
  }
});

// get all models for selected brand
router.get("/model", async (req, res) => {
  try {
    const { brandId } = req.query;
    const models = await Model.findAll({
      where: { brandId },
    });
    if (models) {
      res.json({
        status: true,
        models,
      });
    } else {
      res.json({
        status: false,
        message: "No data found",
      });
    }
  } catch (e) {
    res.json({ status: 500, message: "Internal server error" });
  }
});

// searching by brand, platform, model name
router.get("/device/search", async (req, res) => {
  try {
      var platforms = [];
    const { q, lang } = req.query;
    if (lang === "es") {
     
          var searched_itemss = await Model.findAll({
              where: { es_name: { [Op.like]: "%" + q + "%" } },
              order: [["brandId", "DESC"],['release_date','DESC']],
              attributes: ["es_name", "id", "brandId", "image"]
          });
      
     
      searched_itemss.forEach((element) => {
       
          var datad = {
            id: element.id,
            name: element.es_name,
            brandId:element.brandId,
            image:element.image
          };
          platforms.push(datad);
       
      });
    } else {

      
           var searched_itemss = await Model.findAll({
               where: { en_name: { [Op.like]: "%" + q + "%" } },
               order: [["brandId", "DESC"],['release_date','DESC']],
               attributes: ["en_name", "id", "brandId", "image"]
           });
       
      
      // var searched_itemss = await Model.findAll({
      //     where: { es_name: { [Op.like]: "%" + q + "%" } },
      //     order: [
              
      //         ["name", "ASC"]
      //     ],
      //     attributes: ["en_name", "id", "brandId", "image"]
      // });
      searched_itemss.forEach((element) => {
       
        var datad = {
          id: element.id,
          name: element.en_name,
          brandId:element.brandId,
          image:element.image
        };
        platforms.push(datad);
     
    });
    }

    res.json({
      status: true,
      searched_items:platforms,
    });
  } catch (e) {
    res.json({ status: 500, message: "Internal server error" });
  }
});

// device details screen / issues screen
router.get("/device/details", async (req, res) => {
  try {
    const { modelId, lang } = req.query;
    var model = await Model.findOne({
      where: { id : modelId}
    });
    var issue = await Issue.findOne({
      where: {
        modelId,
      },
    });

    if (issue) {
      if (lang === "es") {
        var issue_listt = JSON.parse(issue.es_issue_list);

        datad = {
          issue_list: issue_listt,
          image: issue.es_image,
          id: issue.id,
          modelId: issue.modelId
        };
      } else {
        var issue_listt = JSON.parse(issue.en_issue_list);
        datad = {
          issue_list: issue_listt,
          image: issue.en_image,
          id: issue.id,
          modelId: issue.modelId
        };
      }

      res.json({
        status: true,
        issues: datad,
        colors: model.colors ? model.colors.split(',') : []
      });
    } else {
      if (lang === "es") {
        var message = "Datos no encontrados";
      } else {
        var message = "No data found";
      }
      res.json({
        status: false,
        message,
      });
    }
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

router.get("/newsletter-list", async (req,res) => {
  try{
      let news = await Newsletter.findAll();

      res.json({
          status: 200,
          data: news
      });
  } catch (e) {
      res.json({
          status: 500,
          message: "Internal server error",
          e
      });
  }
}) 

router.get("/newsletter", async (req,res) => {
  try{
    let { id } = req.query;

      const news = await Newsletter.findOne({ 
        where : { id } 
      });
      if(news){

        let html = 
        `<html>
          <body>
            <h1>${news.title}</h1>
            <div>
              ${news.description}
            </div>
          </body>
        </html>`
        res.write(html)
        res.end()
      }else{
        res.json({
          status: 500,
          message: "Not found"
        });
      }
        
  } catch (e) {
      res.json({
          status: 500,
          message: "Internal server error",
          e
      });
  }
}) 

router.get("/getHelp", async (req, res) => {
  try {
    const { brandId, lang } = req.query;
    console.log(brandId);
    var helpdata = [];
    if (brandId == "") {
      var data = await Help.findAll();
      if (data) {
        data.forEach((item) => {
          var datad = {
            id: item.id,
            help_data: JSON.parse(item.help_data),
            brandId: item.brandId,
          };
          helpdata.push(datad);
        });
        res.json({
          status: true,
          helpdata,
        });
      } else {
        if (lang === "es") {
          var message = "Datos no encontrados";
        } else {
          var message = "No data found";
        }
        res.json({
          status: false,
          message,
        });
      }
    } else {
      var helpdata = await Help.findOne({
        where: {
          brandId,
        },
      });
      if (helpdata) {
        helpdata.help_data = JSON.parse(helpdata.help_data);
        res.json({
          status: true,
          helpdata,
        });
      } else {
        if (lang === "es") {
          var message = "Datos no encontrados";
        } else {
          var message = "No data found";
        }
        res.json({
          status: false,
          message,
        });
      }
    }
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

module.exports = router;
