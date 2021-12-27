module.exports = function(sequelize, DataTypes) {
    var requests = sequelize.define("requests", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        bookingId: {
            type: DataTypes.UUID
        },
        technicianId: {
            type: DataTypes.UUID
        },
        tech_description: {
            type: DataTypes.TEXT
        },
        tech_estimate: {
            type: DataTypes.UUID
        },
        tech_delevery: {
            type: DataTypes.UUID
        },
        user_Status: {
            type: DataTypes.STRING
        },
        technician_Status: {
            type: DataTypes.STRING
        }
    });

    requests.sync().then(() => {
        requests.create;
    });

    return requests;
};
