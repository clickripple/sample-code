const multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, __dirname + "/uploads/");
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
    	console.log(file);
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;
