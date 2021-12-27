const sendmail = require("sendmail")(),
        nodemailer = require('nodemailer');

// function send_Email(from, to, subject, text) {
//     sendmail(
//         {
//             from,
//             to,
//             subject,
//             html: text
//         },
//         (err, reply) => {
//             if (err) return new Promise(reject => reject({ flag: false }));
//             return new Promise(resolve => resolve({ flag: true }));
//         }
//     );
// }
async function send_Email(from, to, subject, text) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtpout.secureserver.net",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
        user: "soporte@blackpatch.app",
        pass: "Miblackpatch@2203!!",
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: text, // html body
    });
    console.log("Message sent: %s", info);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = { send_Email };
