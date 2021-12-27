module.exports = function(sequelize, DataTypes) {
    var referals = sequelize.define("referals", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        amount: {
            type: DataTypes.STRING
        },
        discount: {
            type: DataTypes.STRING
        }
    });

    referals.sync().then(() => {
        referals.create;
    });

    return referals;
};
