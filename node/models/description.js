module.exports = function(sequelize, DataTypes) {
    var descriptions = sequelize.define("descriptions", {
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
        des:{
            type: DataTypes.UUID
        },
        techRate: {
            type: DataTypes.STRING
        },
        deliveryTime: {
            type: DataTypes.DATE
        }
    });

    descriptions.sync().then(() => {
        descriptions.create;
    });

    return descriptions;
};
