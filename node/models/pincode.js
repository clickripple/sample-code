module.exports = function(sequelize, DataTypes) {
    var pincode = sequelize.define("pincode", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        code: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING
        },
        activated: {
            type: DataTypes.BOOLEAN
        },
        createdAt :{
            type: DataTypes.DATE
        },
        updatedAt: {
            type: DataTypes.DATE
        },
    });

    pincode.sync().then(() => {
        pincode.create;
    });

    // zip_code.count({ where:
    //         { id: 1 }
    // }).then(count => {
    //         if (count == 0) {
    //         }
    //     }
    // );

    return pincode;
};
