module.exports = function(sequelize, DataTypes) {
    var helps = sequelize.define("helps", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        help_data: {
            type: DataTypes.STRING
        },
        brandId: {
            type: DataTypes.UUID
        }
    });

    helps.sync().then(() => {
        helps.create;
    });

    return helps;
};
