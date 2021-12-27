const Session = require("../db").models.login_sessions,
    config = require("../common/config"),
    axios = require("axios"),
    User = require("../db").models.users,
    Booking = require("../db").models.bookings,
    Notification = require("../db").models.notifications,
    Technicians = require("../db").models.technicians;

async function notify(fcm_token, data, notification_type) {
        
        const response = await axios.post(`${config.API_URL}/mobile/api/push`, {
            fcm_token,
            data,
            notification_type
        });
    return response;
}

async function messagenoti(fcm_token, data, notification_type) {
    const response = await axios.post(
        `${config.API_URL}/mobile/api/push/message_send`,
        {
            fcm_token,
            data,
            notification_type
        }
    );
    return response;
}
// async function notify(fb_token, data, notification_type) {

//     console.log(fb_token);
//     return;
//     var obj = [];
//     var user_Data = {};
//     const sessions = await Session.findAll({
//         where: {
//             technicianId: technicianId
//         }
//     });

//     const booking = await Booking.findAll({
//         where: { id: bookingId, technicianId: technicianId },

//         include: [
//             {
//                 model: User
//             }
//         ]
//     });
//     booking.forEach(item => {
//         user_Data = {
//             id: item.id,
//             issue: JSON.parse(item.issue),
//             image: JSON.parse(item.image),
//             video: item.video,
//             repair_estimate: item.repair_estimate,
//             description: item.description,
//             dateTime: item.dateTime,
//             userId: item.userId,
//             technicianId: item.technicianId,
//             username: item.user.username,
//             email: item.user.email,
//             phone: item.user.phone,
//             address: item.user.address,
//             profile_pic: item.user.profile_pic,
//             modelName: item.modelName,
//             bookAddress: item.address
//         };
//     });

//     const body = {
//         fb_token: sessions[0].fb_token,
//         data: {
//             message: "You have new booking request",
//             type: "tech_book",
//             notify_data: user_Data
//         },
//         notification_type: 0
//     };
//     await axios.post(`${config.API_URL}/mobile/api/push`, body);
//     return new Promise(resolve => resolve({ flag: true }));
// }

module.exports = { notify, messagenoti };
