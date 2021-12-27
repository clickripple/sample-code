module.exports = function(sequelize, DataTypes) {
    var login_sessions = sequelize.define("login_sessions", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID
        },
        technicianId: {
            type: DataTypes.UUID
        },
        fb_token: {
            type: DataTypes.STRING
        },
        deviceId: {
            type: DataTypes.STRING
        },
        fcm_token: {
            type: DataTypes.STRING
        },
        device_type: {
            type: DataTypes.STRING
        },
        language: {
            type: DataTypes.STRING
        },
        
        isActive: {
            type: DataTypes.BOOLEAN
        }
    });

    login_sessions.sync().then(() => {
        login_sessions.create;
    });

    return login_sessions;
};
