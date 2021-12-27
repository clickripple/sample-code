module.exports = function(sequelize, DataTypes) {
    var discount = sequelize.define("discount", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        code: {
            type: DataTypes.STRING
        },
        discount_percent: { type: DataTypes.STRING },
        status: { type: DataTypes.STRING }
    });

    discount.sync().then(() => {
        discount.create;
    });

    return discount;
};
