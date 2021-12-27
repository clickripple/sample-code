module.exports = function(sequelize, DataTypes) {
    var coupans = sequelize.define("coupans", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID
        },
        coupan_code: {
            type: DataTypes.STRING
        },
        referal_code: { type: DataTypes.STRING },
        referalamount: { type: DataTypes.STRING },
        isUsed: { type: DataTypes.BOOLEAN, defaultValue: false }
    });

    coupans.sync().then(() => {
        coupans.create;
    });

    return coupans;
};
