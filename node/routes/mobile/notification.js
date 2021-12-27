const express = require("express"),
    router = express.Router(),
    seq = require("../../db"),
    Notification = seq.models.notifications,
    Op = require("sequelize").Op,
    moment = require("moment"),
    Booking = require("../../db").models.bookings,
    verifyToken = require("../../common/auth");

router.get("", async (req, res) => {
    try {
        const notifications = await Booking.findAndCountAll({
            where: {
                [Op.or]: [
                    {
                        userId: req.query.id,
                        user_seen_unseen:true
                    },
                    {
                        technicianId: req.query.id,
                        tech_seen_unseen:true
                    }
                ]
            },
            order: [["createdAt", "DESC"]]
        });
   
        res.json({
            status: true,
            total: notifications.count
        });
    } catch (e) {
        res.json({
            status: "500",
            message: "Internal server error"
        });
    }
});

router.get("/read", async (req, res) => {
    try {

        if(req.query.type==="user")
        {
               var notifications = await Booking.update(
            {
                user_seen_unseen: false
            },
            {
                where: { id: req.query.id }
            }
        );
        if (notifications) {
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }

        }else{
                var notifications = await Booking.update(
            {
                tech_seen_unseen: false
            },
            {
                where: { id: req.query.id }
            }
        );
        if (notifications) {
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }

        }

    
    } catch (e) {
        res.json({
            status: "500",
            message: "Internal server error"
        });
    }
});

module.exports = router;
