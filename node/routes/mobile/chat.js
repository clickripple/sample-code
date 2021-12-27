const router = require("express").Router(),
    db = require("../../db"),
    Op = require("sequelize").Op,
    moment = require("moment"),
    Cryptr = require("cryptr"),
    config = require("../../config"),
    Conversation = require("../../db").models.conversations,
    cryptr = new Cryptr(config.cryptoKey),
    Message = require("../../db").models.messages;
var verifyToken = require("../../common/auth");

function encryptMessage(req, res, next) {
    req.body.message = cryptr.encrypt(req.body.message);
    next();
}
router.post("/message", encryptMessage, async (req, res) => {
    const { sender, receiver, message,booking_id } = req.body;
    const temp_conv = await Conversation.findOne({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [{ sender }, { receiver }]
                },
                {
                    [Op.and]: [{ sender: receiver }, { receiver: sender }]
                }
            ]
        }
    });

    if (!temp_conv) {
        const t = new Conversation({
            sender,
            receiver,
            booking_id
        });
        console.log(t);
        const temp_data = await t.save();
        const temp_message = new Message({
            conversationId: temp_data.id,
            message,
            sender,
            receiver,
            booking_id
        });
        const messagetemp = await temp_message.save();

        const message_temp = {
            message: cryptr.decrypt(messagetemp.message),
            createdAt: moment(
                new Date(messagetemp.createdAt).toISOString(config.lang, {
                    timeZone: config.timezone
                })
            ),
            sender: messagetemp.sender,
            seen: messagetemp.seen,
            id: messagetemp.id,
            conversationId: messagetemp.conversationId
        };

        res.json({ status: true, message_temp });
    } else {
        const temp_message = new Message({
            conversationId: temp_conv.id,
            message,
            sender,
            receiver,
            booking_id
        });
        const message_tempp = await temp_message.save();
        const message_temp = {
            message: cryptr.decrypt(message_tempp.message),
            createdAt: moment(
                new Date(message_tempp.createdAt).toISOString(config.lang, {
                    timeZone: config.timezone
                })
            ),
            sender: message_tempp.sender,
            seen: message_tempp.seen,
            id: message_tempp.id,
            conversationId: message_tempp.conversationId
        };
        res.json({ status: true, message_temp });
    }
});

router.get("/conversation/id", async (req, res) => {
    const { sender, receiver } = req.query;
    const temp = await Conversation.findOne({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        {
                            sender
                        },
                        {
                            receiver
                        }
                    ]
                },
                {
                    [Op.and]: [
                        {
                            sender: receiver
                        },
                        {
                            receiver: sender
                        }
                    ]
                }
            ]
        },
        attributes: ["id"]
    });

    if (temp == null) {
        res.json({
            status: false,
            messsage: "no data found"
        });
    } else {
        res.json({
            status: true,
            conversationId: temp.id
        });
    }
});

router.get("/message",  async (req, res) => {
    const { conversationId,booking_id,userID } = req.query;
    // console.log(req); return;
    const data = await Message.findAndCountAll({
        where: {
            conversationId
        }
    });

    const room = await Conversation.findOne({
        where: {
            id:conversationId
        }
    });

    // if(room.sender==userID){
        
    //     var unread=room.receiver;

    // }else if(room.receiver==userID){

    //     var unread=room.sender;
    // }

    await Message.update(
                    {
                        seen: 1
                    },

                    {
                        where: {
                            receiver: userID
                        }
                    }
                );
    // res.json(unread); return;
    //conversationId=8915bcc5-2cde-4a3f-9e4c-5ebf3b9c5218&booking_id=f8814931-6cff-4b2a-9414-a617da87b882
    // console.log(data);
    var p_items = 0;

    if (data.rows.length > 0) {
        data.rows.forEach(async item => {
            // if (item.sender !== logged_user) {
            // await Message.update({ seen: true }, { where: { id: item.id } });
            // }
            p_items += 1;
            if (p_items === data.rows.length) {
                const messages = await Message.findAndCountAll({
                    where: {
                        conversationId,booking_id
                    },
                    order: [["createdAt", "DESC"]]
                });

                if (messages.rows.length > 0) {
                    var processedItems = 0;
                    res_array = [];
                    for (let i = messages.rows.length - 1; i >= 0; i--) {
                        const item = messages.rows[i];
                        const obj = {
                            id: item.id,
                            conversationId: item.conversationId,
                            message: cryptr.decrypt(item.message),
                            createdAt: moment(
                                new Date(item.createdAt).toISOString(
                                    config.lang,
                                    {
                                        timeZone: config.timezone
                                    }
                                )
                            ),
                            sender: item.sender
                        };
                        res_array.push(obj);
                        processedItems += 1;
                        if (processedItems === messages.rows.length) {
                            res.json({
                                status: true,
                                messages: res_array
                            });
                        }
                    }
                } else {
                    res.json({
                        status: true,
                        messages: messages.rows
                    });
                }
            }
        });
    } else {
        res.json({
            status: true,
            messages: []
        });
    }
});

router.get("/message_count", async (req, res) => {
    try {
        const { conversationId } = req.query;
        const temp = await Message.findAndCountAll({
            where: {
                conversationId,
                seen: false
            },
            attributes: ["conversationId", "seen"]
        });
        res.json({
            status: true,
            message: temp.rows,
            total: temp.count
        });
    } catch (e) {
        res.json({
            status: "500",
            message: "Internal server error"
        });
    }
});

router.put("/message_read", async (req, res) => {
    try {
        const { conversationId } = req.query;
        var notifications = await Message.update(
            {
                seen: true
            },
            {
                where: { conversationId }
            }
        );
        if (notifications) {
            res.json({ status: true });
        } else {
            res.json({ status: false });
        }
    } catch (e) {
        res.json({
            status: "500",
            message: "Internal server error"
        });
    }
});
module.exports = router;
