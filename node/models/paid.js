module.exports = function(sequelize, DataTypes) {
    var paids = sequelize.define("paids", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        technicianId: {
            type: DataTypes.UUID
        },
        payment_mode: {
            type: DataTypes.STRING
        },
        total_amount: {
            type: DataTypes.STRING
        },
        after_discount: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.STRING
        },
        pay_amount:{
            type: DataTypes.STRING
        }
       
    });

    paids.sync().then(() => {
        paids.create;
    });

    return paids;
};
