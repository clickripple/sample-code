module.exports = function(sequelize, DataTypes) {
    var ratings = sequelize.define("ratings", {
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
        bookingId: {
            type: DataTypes.UUID
        },
        comment: {
            type: DataTypes.STRING
        },
        rates: {
            type: DataTypes.FLOAT
        }
    });

    ratings.sync().then(() => {
        ratings.create;
    });

    return ratings;
};
