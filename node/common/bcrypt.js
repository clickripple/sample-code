const Admin = require("../db").models.admins,
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 14,
    User = require("../db").models.users;
Technician = require("../db").models.technicians;

const comparePassword = async (email, password, role, cb) => {
    var data;
    if (role === "user") {
        data = await User.findOne({
            where: { email, provider: "email" }
        });
    } else if (role === "admin") {
        data = await Admin.findOne({
            where: { email }
        });
    } else if (role === "technician") {
        data = await Technician.findOne({
            where: { email, provider: "email" }
        });
    }

    bcrypt.compare(password, data.password).then(isMatch => {
        if (isMatch) return cb(isMatch);
        else return cb(isMatch);
    });
};
const compareTechPassword = async (email, password, cb) => {
    data = await Technician.findOne({
        where: { email, provider: "email" }
    });

    bcrypt.compare(password, data.password).then(isMatch => {
        if (isMatch) return cb(isMatch);
        else return cb(isMatch);
    });
};

const change_Password = async (id, current_password, cb) => {
    var data;

    data = await User.findOne({
        where: { id }
    });

    bcrypt.compare(current_password, data.password).then(isMatch => {
        if (isMatch) return cb(isMatch);
        else return cb(isMatch);
    });
};

const tech_change_Password = async (id, current_password, cb) => {
    var data;

    data = await Technician.findOne({
        where: { id }
    });

    bcrypt.compare(current_password, data.password).then(isMatch => {
        if (isMatch) return cb(isMatch);
        else return cb(isMatch);
    });
};
const encryptPassword = (req, res, next) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            if (err) return next(err);
            req.body.password = hash;
            next();
        });
    });
};

module.exports = {
    encryptPassword,
    comparePassword,
    change_Password,
    compareTechPassword,
    tech_change_Password
};
