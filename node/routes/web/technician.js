const router = require("express").Router(),
  Technician = require("../../db").models.technicians,
  Session = require("../../db").models.login_sessions,
  jwt = require("jsonwebtoken"),
   random = require("random-string-generator"),
  config = require("../../common/config"),
  upload = require("../../common/multer"),
  Op = require("sequelize").Op,
  SALT_WORK_FACTOR = 14,
  bcrypt = require("bcrypt"),
  { send_Email } = require("../../common/mailer"),
  { compareTechPassword, encryptPassword } = require("../../common/bcrypt");


router.post("",async (req, res) => {
        // console.log(req.body);
    
        try {

            if (JSON.stringify(req.body) == "{}") {
                if (lang === 'es') {
                    var message = "El cuerpo de la solicitud de registro está vacío"
                } else {
                    var message = "registration request body is empty"
                }
                return res.json({
                    status: false,
                    message
                });


            }
            if (
                !req.body.email ||
                !req.body.username ||
                !req.body.phone ||
                !req.body.address
            ) {
               
                return res.json({
                    status: false,
                    message:"Missing fields for signup"
                });


            }
            
                    req.body.isActive = true;
                    req.body.emailVerify = true;
                    req.body.provider = "email";
                    req.body.password = random(10);
                
                    const user = new Technician(req.body);
                    await user.save();
                  
                    const htmll = `Hello ${user.username}, Your Blackpatch password is ${req.body.password}`;
                    send_Email(
                        config.mailer_mail,
                        req.body.email,
                        "Black Patch: Account registered",
                        htmll
                    );
                
               
                res.json({
                    status: 200,
                    message:"Technician account has been created."
                });

            

            //
        } catch (e) {
            if (e.name === "SequelizeUniqueConstraintError") {
            
                    res.json({ status: false, message: "Email already exists" });
                

            } else {
                
                res.json({
                    status: 500,
                    message:"Internal server error"
                });


            }
        }
    }
);
// get tech
router.get("", async (req, res) => {
  try {
    const { email } = req.query;
    const technician = await Technician.findOne({
      where: {
        email,
      },
      attributes: { exclude: ["password"] },
    });
    res.json({
      status: 200,
      technician,
    });
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

// update user
router.put("", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(req.body)
    await Technician.update(req.body, {
      where: {
        id,
      },
    });
    res.json({
      status: 200,
      message: "Technician updated successfully",
    });
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

// logout API
router.put("/logout", async (req, res) => {
  try {
    const { technicianId, deviceId } = req.body;
    await Session.update(
      { isActive: false },
      {
        where: {
          technicianId,
          deviceId,
        },
      }
    );
    res.json({
      status: true,
      message: "Logout successfully",
    });
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

// get tech
router.post("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const technician = await Technician.findOne({
      where: {
        id,
      },
      attributes: { exclude: ["password"] },
    });
    await technician.destroy();

    res.json({
      status: 200,
      message: "Technician destroyed successfully!"
    });
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

// to get all sessions of specific user
router.get("/sessions", async (req, res) => {
  try {
    const { technicianId, deviceId } = req.query;
    const sessions = await Session.findAndCountAll({
      where: {
        technicianId,
        deviceId,
      },
    });
    res.json({
      status: true,
      sessions: sessions.rows,
      count: sessions.count,
    });
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

// forgot password API
router.get("/password/forgot", async (req, res) => {
  try {
    const { email } = req.query;
    const technician = await Technician.findOne({ where: { email } });
    const refresh_token = jwt.sign(
      {
        id: technician.id,
        email: technician.email,
        role: technician.role,
      },
      config.secretKey,
      { expiresIn: "0.05h" }
    );

    const html = `
        Hello ${user.username}, Please <a href='${config.WEB_URL}/password/reset?refresh_token=${refresh_token}'>click here</a> to reset your password. This link will expire in 180 seconds. 
        `;

    send_Email(config.mailer_mail, email, "Reset Password", html);

    res.json({
      status: "success",
      message: "Password reset link has been sent to your registered Email Id",
    });
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});

// request to technician for repair
router.post("/wizard/request", async (req, res) => {
  try {
  } catch (e) {
    res.json({
      status: 500,
      message: "Internal server error",
    });
  }
});



module.exports = router;
