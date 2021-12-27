module.exports = function(sequelize, DataTypes) {
    var platforms = sequelize.define("platforms", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        en_name: {
            type: DataTypes.STRING
        },
        es_name:{
            type: DataTypes.STRING
        },
        icon: {
            type: DataTypes.STRING(1000)
        }
    });

    platforms.sync().then(() => {
        platforms.create;
    });

    return platforms;
};
