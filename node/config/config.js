const fs = require("fs");

module.exports = {
    development: {
        username: "",
        password: "",
       // username: "root",
       // password: "esfera",
        database: "",
        host: "127.0.0.1",
        port: 3306,
        dialect: "mysql",
        dialectOptions: {
            bigNumberStrings: true
        }
    },
    test: {
        username: "",
        password: "",
       // username: "root",
       // password: "esfera",
        database: "",
        host: "127.0.0.1",
        port: 3306,
        dialect: "mysql",
        dialectOptions: {
            bigNumberStrings: true
        }
    }
    // production: {
    //     username: process.env.PROD_DB_USERNAME,
    //     password: process.env.PROD_DB_PASSWORD,
    //     database: process.env.PROD_DB_NAME,
    //     host: process.env.PROD_DB_HOSTNAME,
    //     port: process.env.PROD_DB_PORT,
    //     dialect: "mysql",
    //     dialectOptions: {
    //         bigNumberStrings: true
    //     }
    // }
};
