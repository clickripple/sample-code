const jwt = require("jsonwebtoken");
var config = require("./config");
const verifyToken = (req, res, next) => {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];
    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        // Split at the space
        const bearer = bearerHeader.split(" ");
        // Get token from array
        const bearerToken = bearer[1];
        
        // Set the token
        // req.token = bearerToken;
        // Next middleware

        const authData = jwt.verify(bearerToken, config.secretKey);

        if (authData) {
            req.user = authData;
            next();
        } else {
            res.json({ Message: "You are not authorized" });
        }
    } else {
        // Forbidden
        res.sendStatus(403).send({ Message: "You are not authorized" });
    }
};

module.exports = verifyToken;
