const express = require("express"),
    http = require("http"),
    app = express(),
    cors = require("cors"),
    parser = require("body-parser"),
    server = http.Server(app),
    path = require("path"),
    
    io = require("./socket/index"),
    http2 = require('http2'),
    fs = require('fs'),
    // mobile routes
    mobile_userRouter = require("./routes/mobile/user"),
    mobile_wizardRouter = require("./routes/mobile/wizard"),
    mobile_support = require("./routes/mobile/support"),
    mobile_chat = require("./routes/mobile/chat"),
    // web routes
    adminRouter = require("./routes/web/admin"),
    referalRouter = require("./routes/web/referal"),
    brandRouter = require("./routes/web/brand"),
    techRouter = require("./routes/web/technician"),
    modelRouter = require("./routes/web/model"),
    platformRouter = require("./routes/web/platform"),
    userRouter = require("./routes/web/user"),
    helpRouter = require("./routes/web/help"),
    supportRouter = require("./routes/web/support"),
    cmsRouter = require("./routes/web/cms"),
    issueRouter = require("./routes/web/issue"),
    booking = require("./routes/mobile/booking"),
    help_routes = require("./routes/mobile/help"),
    mobile_technician = require("./routes/mobile/technician"),
    mobile_pushRouter = require("./routes/mobile/push"),
    mobile_notification = require("./routes/mobile/notification");
    savelocation = require("./routes/mobile/user_saved_location");


// middlewares
// app.use(parser.urlencoded({ extended: true }));
// app.use(cors(), parser.json(), parser.urlencoded({ extended: true }));
app.use(cors());
app.use(parser.json({ limit: "100mb" }));
app.use(parser.urlencoded({ limit: "100mb", extended: true, parameterLimit: 1000000 }));

app.get("/", (req, res) => {
    res.json({
        message:
            "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."
    });
});
// routes work
// mobile APIs
app.use("/mobile/api/user", mobile_userRouter);
app.use("/mobile/api/technician", mobile_technician);
app.use("/mobile/api/wizard", mobile_wizardRouter);
app.use("/mobile/api/booking", booking);
app.use("/mobile/api/push", mobile_pushRouter);
app.use("/mobile/api/help", help_routes);
app.use("/mobile/api/help", help_routes);
app.use("/mobile/api/support", mobile_support);
app.use("/mobile/api/notification", mobile_notification);

app.use("/mobile/api/chat", mobile_chat);
// web APIs
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/model", modelRouter);
app.use("/api/brand", brandRouter);
app.use("/api/platform", platformRouter);
app.use("/api/cms", cmsRouter);
app.use("/api/issue", issueRouter);
app.use("/api/help", helpRouter);
app.use("/api/support", supportRouter);
app.use("/api/referal", referalRouter);
app.use("/api/technician", techRouter);
app.use("/api/location",savelocation);

// public directories
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

// server.listen(7007, "165.22.215.99", () => {
//     console.log("Server is listening on", server.address().port);
// });


app.get('/sendpush',function (req,res) {
    var admin = require("firebase-admin");

    var serviceAcc
    ount = require("");
    if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          databaseURL: ""
        });
    }


    var registrationToken = "";
 


    var payload = {
      notification: {
        title: "This is a Notification",
        body: "This is the body of the notification message."
      },
      data : {
            body : "Body of Your Notification in Data",
            title: "Title of Your Notification in Title",
            key_1 : "Value for key_1",
            key_2 : "Value for key_2"
        }
    };

    var options = {
      priority: "high",
      timeToLive: 60 * 60 *24
    };
    // admin.messaging().send()
    admin.messaging().sendToDevice(registrationToken, payload, options)
      .then(function(response) {
        // admin.messaging().send();
        console.log("Successfully sent message:", response);
        res.json(response);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });



})
app.get('/send_push',function(req,res) {
    /* 
      Use 'https://api.push.apple.com' for production build
    */

    // var host = 'https://api.sandbox.push.apple.com';
    var host = 'https://api.push.apple.com';
    var path = '';

    /*
    Using certificate converted from p12.
    The code assumes that your certificate file is in same directory.
    Replace/rename as you please
    */

    const client = http2.connect(host, {
      key: fs.readFileSync(__dirname + '/newfile.key.pem'),
      cert: fs.readFileSync(__dirname + '/newfile.crt.pem')
    });

    client.on('error', (err) => console.error(err));

    body = {
      "aps": {
        "alert": "hello",
        "content-available": 1
      }
    }

    headers = {
      ':method': 'POST',
      'apns-topic': 'TechBlackPatch.id', //you application bundle ID
      ':scheme': 'https',
      ':path': path
    }

    const request = client.request(headers);

    request.on('response', (headers, flags) => {
      for (const name in headers) {
        console.log(`${name}: ${headers[name]}`);
      }
    });

    request.setEncoding('utf8');

    let data = ''
    request.on('data', (chunk) => { data += chunk; });
    request.write(JSON.stringify(body))
    request.on('end', () => {
    console.log(`\n${data}`);
    res.json(data);
    client.close();
    });
    request.end();
})


server.listen(3010, () => {
    console.log("Server is listening on ", server.address().port);
});
