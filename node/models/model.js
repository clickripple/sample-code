module.exports = function(sequelize, DataTypes) {
    var models = sequelize.define("models", {
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
        model_number: {
            type: DataTypes.STRING
        },
        release_date: {
            type: DataTypes.DATE
        },
        brandId: {
            type: DataTypes.UUID
        },
        colors: {
            type: DataTypes.STRING
        }
    });

    models.sync().then(() => {
        models.create;
    });

    // if(models.rawAttributes.release_date){
    //     sequelize.queryInterface.addColumn('models', 'release_date', { type: DataTypes.DATE });
    // }

    return models;
};
