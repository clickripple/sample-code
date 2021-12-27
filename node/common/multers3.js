const multer = require("multer");
var path = require('path')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // cb(null, __dirname + "/uploads/");
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
    	console.log(file);
        cb(null, "uploaded"+path.extname(file.originalname));
    }
});

const upload2 = multer({ storage: storage });
module.exports = upload2;
