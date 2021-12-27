const io = require("socket.io").listen(3009),
    axios = require("axios"),
    User = require("../db").models.users,
    Technician = require("../db").models.technicians,
    notify = require("../common/notify"),
    moment = require("moment"),
    Session = require("../db").models.login_sessions,
    config = require("../config"),
    Op = require("sequelize").Op;

var users = [];

io.on("connection", async socket => {
    socket.on("init", user_id => {
        console.log("init: ", user_id);
        users[user_id] = socket.id;
    });
    var noti_type;
    socket.on("message_sent", async data => {
        const data_temp = JSON.parse(data);

        // const result = await axios.post(
        //     `${config.API_URL}/mobile/api/chat/message`,
        //     data_temp
        // );
        console.log(data_temp);
        const result = await axios.post(
            `http://52.201.54.3:3010/mobile/api/chat/message`,
            data_temp
        );

        const response_obj = {
            message: result.data.message_temp.message,
            sender: result.data.message_temp.sender,
            createdAt: new Date( result.data.message_temp.createdAt).toISOString()
        };

        io.to(users[data_temp.receiver]).emit("message_received", response_obj);
        io.to(users[data_temp.sender]).emit("message_received", response_obj);
        noti_type = data_temp.type;
        // notification for chat message
        var tokens;
        console.log(data_temp);
        if (data_temp.type == "userId") {
            tokens = await Session.findAll({
                where: {
                    userId: data_temp.receiver
                },

                attributes: ["fcm_token"]
            });
        } else {
            tokens = await Session.findAll({
                where: {
                    technicianId: data_temp.receiver
                },

                attributes: ["fcm_token"]
            });
        }

        const temp_user_noti = await Technician.findOne({
            where: { id: data_temp.sender }
        });
        const user_noti = await User.findOne({
            where: { id: data_temp.sender }
        });
        console.log("token=="+tokens);
        tokens.forEach(async item => {
            console.log("token=="+item.fcm_token);
            await notify.messagenoti(item.fcm_token, {
                message: data_temp.message,
                receiver_name: temp_user_noti ? temp_user_noti.username : user_noti.username,
                sender_name: temp_user_noti ? temp_user_noti.name : user_noti.username,
                type: "chat",
                sender_id: data_temp.sender,
                booking_id:data_temp.booking_id,
                techID:data_temp.sender
            });
        });
    });
});

module.exports = io;
