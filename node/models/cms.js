module.exports = function(sequelize, DataTypes) {
    var cms = sequelize.define("cms", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        en_about_us: {
            type: DataTypes.TEXT
        },
        en_tnc: {
            type: DataTypes.TEXT
        },
        en_policy: {
            type: DataTypes.TEXT
        },
        es_about_us: {
            type: DataTypes.TEXT
        },
        es_tnc: {
            type: DataTypes.TEXT
        },
        es_policy: {
            type: DataTypes.TEXT
        },
        available_area_image: {
            type: DataTypes.TEXT
        },
        available_image2: {
            type: DataTypes.TEXT
        },
        available_image3: {
            type: DataTypes.TEXT
        },
        available_image4: {
            type: DataTypes.TEXT
        },
        available_image5: {
            type: DataTypes.TEXT
        },
        video: {
            type: DataTypes.TEXT
        },
        promo_text_en: {
            type: DataTypes.TEXT
        },
        promo_text_es: {
            type: DataTypes.TEXT
        }
    });


    cms.sync().then(() => {
        cms.create;
    });

    sequelize.queryInterface.addColumn('cms', 'available_area_image', { type: DataTypes.STRING });

    return cms;
};
