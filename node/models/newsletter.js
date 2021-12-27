module.exports = function(sequelize, DataTypes) {
    var newsletter = sequelize.define("newsletter", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        cover_image: {
            type: DataTypes.TEXT
        }       
    });

    newsletter.sync().then(() => {
        newsletter.create;
    });

    return newsletter;
};
