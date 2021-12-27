module.exports = function(sequelize, DataTypes) {
    var supportmails = sequelize.define("supportmails", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        subject: {
            type: DataTypes.STRING
        },
        message: {
            type: DataTypes.TEXT
        },
        supportId: {
            type: DataTypes.UUID
        }
    });

    supportmails.sync().then(() => {
        supportmails.create;
    });

    return supportmails;
};
