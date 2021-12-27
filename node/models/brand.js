module.exports = function(sequelize, DataTypes) {
    var brands = sequelize.define("brands", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        en_name: {
            type: DataTypes.STRING
        },
        es_name: {
            type: DataTypes.STRING
        },
        image: { type: DataTypes.STRING(1000) },
        platformId: {
            type: DataTypes.UUID
        },
        data_order: {
            type: DataTypes.STRING
        },
    });

    brands.sync().then(() => {
        brands.create;
    });

    return brands;
};
