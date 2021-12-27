module.exports = function(sequelize, DataTypes) {
    var notifications = sequelize.define("notifications", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: { type: DataTypes.STRING },
        notification_type: { type: DataTypes.STRING },
        user_from: { type: DataTypes.STRING },
        user_to: { type: DataTypes.STRING },
        message: { type: DataTypes.STRING },
        seen: { type: DataTypes.BOOLEAN, defaultValue: false },
        data: { type: DataTypes.STRING }
    });

    notifications.sync().then(() => {
        notifications.create;
    });

    return notifications;
};
