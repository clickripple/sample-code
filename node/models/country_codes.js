module.exports = function(sequelize, DataTypes) {
    var country_codes = sequelize.define("country_codes", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        country_name: {
            type: DataTypes.STRING
        },
        country_code: {
            type: DataTypes.STRING
        },
    });

    country_codes.sync().then(() => {
        country_codes.create;
    });

    //Populating database with country codes

    // const data = require('./../country-codes.json');
    // for(let i= 0;i<data.length; i++){
    //     country_codes.count({ where:
    //             { country_name: data[i].name}
    //     }).then(count => {
    //             if (count == 0) {
    //                 const country = new country_codes({
    //                     country_name: data[i].name,
    //                     country_code: data[i].dial_code
    //                 })
    //                 country.save();
    //             }
    //         }
    //     );
    //
    // }


    return country_codes;
};
