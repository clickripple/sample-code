module.exports = function(sequelize, DataTypes) {
    var supports = sequelize.define("supports", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },

        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING(500),
            allowNull: false
        },

        userId: {
            type: DataTypes.UUID
        },
         mail_message: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
         mail_subject: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },

        status: { type: DataTypes.BOOLEAN }
    });

    supports.sync().then(() => {
        supports.create;
    });

    return supports;
};
