const router = require("express").Router(),
    FCM = require("fcm-push"),
    Session = require("../../db").models.login_sessions,
    config = require("../../common/config");

router.post("", async function(req, res) {
    // console.log(req.body);
    const { fcm_token, data, notification_type } = req.body;
    var serverKey = config.web_server_key;
    var fcm = new FCM(serverKey);

    var tokens = await Session.findOne({
            where: {
                fcm_token: fcm_token,
                isActive: true
            },
            attributes: ["device_type"]
        });

    //return tokens;

    if(tokens.device_type=='ios'){

        var admin = require("firebase-admin");

        var serviceAccount = require("/var/www/html/blackpatchbackend/blackpatch-firebase.json");
        if (!admin.apps.length) {
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              databaseURL: "https://blackpatch-81d00.firebaseio.com"
            });
        }


        // var registrationToken = "eR4UZpOBmEW2m3fRleq8Pr:APA91bFvdtCTr-w3BD4_X9iYn-iuPKwDx5oKPaExjDRMZU6T_ZDIfFevaVcg_RqrUt3pzgUCuxiC6fFW3WsRThz5pf17TPC4fGkYTpMwVjNwOZ9DgPhiIepxMshF_Qwa7VsLjCCXIj5H";
        var registrationToken =fcm_token; 

        var payload = {
          notification: {
            title: "Black Patch",
            body: data.message,
            sound: "default"  
          },
          
          data : {
                body : "Body of Your Notification in Data",
                title: "Title of Your Notification in Title",
                bookingId : data.bookingId,
                type : data.type,
                technicianId: (data.technicaianId) ? data.technicaianId : ""
            } 
        };

        var options = {
          priority: "high",
          timeToLive: 60 * 60 *24
        }; 

        admin.messaging().sendToDevice(registrationToken, payload, options)
          .then(function(response) {
            // admin.messaging().send();
            console.log("Successfully sent message:", response);
            res.json({ message: "Notified!", response });
            // res.json(response);
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
        });
      }
      else{


        var message = {
            to: fcm_token,
            
            data: {
                notification_type,
                bookingId: data.bookingId,
                technicianId: data.technicaianId,
                type: data.type,
                message: data.message,
                title: "Black Patch",
                body: data.message
            }
        };
        fcm.send(message, function(err, response) {
            if (err) {
                console.log("---------------------------------------");
                console.log("Error: ", err, message);
                console.log("---------------------------------------");
                res.json({ error: err });
            } else {
                console.log("---------------------------------------");
                console.log("Notified!", response);
                console.log("---------------------------------------");
                res.json({ message: "Notified!", response });
            }
        });
      }    



    


});

async function get_device_name(token) {
    const tokens = await Session.findOne({
            where: {
                fcm_token: token,
                isActive: true
            },
            attributes: ["device_type"]
        });

    return tokens;
}


router.post("/message_send", async function(req, res) {
    const { fcm_token, data, notification_type } = req.body;
    var serverKey = config.web_server_key;
    var fcm = new FCM(serverKey);

    var tokens = await Session.findOne({
            where: {
                fcm_token: fcm_token,
                isActive: true
            },
            attributes: ["device_type","language"]
        });

    //return tokens;
    console.log(tokens.device_type);

    let new_message = ""; 

    if(tokens.language == "en"){
        new_message = "New Message Recieved";
    }else{
        new_message = "Nuevo mensaje recibido";
    }


    if(tokens.device_type=='ios'){

        var admin = require("firebase-admin");
        var serviceAccount = require("/var/www/html/blackpatchbackend/blackpatch-firebase.json");
        if (!admin.apps.length) {
            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              databaseURL: "https://blackpatch-81d00.firebaseio.com"
            });
        } 
        // var registrationToken = "eR4UZpOBmEW2m3fRleq8Pr:APA91bFvdtCTr-w3BD4_X9iYn-iuPKwDx5oKPaExjDRMZU6T_ZDIfFevaVcg_RqrUt3pzgUCuxiC6fFW3WsRThz5pf17TPC4fGkYTpMwVjNwOZ9DgPhiIepxMshF_Qwa7VsLjCCXIj5H";
        var registrationToken =fcm_token;


        var payload = {
          notification: {
            title: new_message,
            body: data.message,
            sound: "default"
          },
          data : {
                body : "Body of Your Notification in Data",
                title: "Title of Your Notification in Title",
                bookingId : data.booking_id,
                type : data.type,
                techID:data.techID,
                receiver_name:data.receiver_name
            } 
        };

        var options = {
          priority: "high",
          timeToLive: 60 * 60 *24
        }; 
        admin.messaging().sendToDevice(registrationToken, payload, options)
          .then(function(response) {
            // admin.messaging().send();
            console.log("Successfully sent message:", response);
            // res.json(response);
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
        });
    }else{

        var message = {
            to: fcm_token,
            data: {
                sender_id: data.sender_id,
                type: data.type,
                receiver_name: data.receiver_name,
                sender_name:data.sender_name,
                title: new_message,
                message: data.message,
                bookingId : data.booking_id,
                techID:data.techID

            }
        };

        
        console.log("ssdfsdf", message);
        fcm.send(message, function(err, response) {
            if (err) {
                console.log("---------------------------------------");
                console.log("Error: ", err, message);
                console.log("---------------------------------------");
                res.json({ error: err });
            } else {
                console.log("---------------------------------------");
                console.log("Notified!", response);
                console.log("---------------------------------------");
                res.json({ message: "Notified!", response });
            }
        });
    }  
});

// router.post("", function(req, res) {
//     const { fb_token, data, notification_type } = req.body;
//     var fcm = new FCM(config.web_server_key);
//     var message = {
//         to: fb_token,
//         notification: {
//             title: "Black Patch",
//             body: data.message,
//             icon: ""
//         },
//         data: {
//             notification_type,
//             type: data.type,
//             nav_param: data.notify_data
//         }
//     };

//     fcm.send(message, function(err, response) {
//         if (err) {
//      console.log("---------------------------------------");
//       console.log("Error: ", err);
//       console.log("---------------------------------------");
//             res.json({ error: err });
//         } else {
//             console.log("---------------------------------------");
//       console.log("Notified!", response);
//       console.log("---------------------------------------");

//             res.json({ message: "Notified!", response });
//         }
//     });
// });

module.exports = router;
