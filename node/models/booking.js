module.exports = function(sequelize, DataTypes) {
    var bookings = sequelize.define("bookings", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        issue: {
            type: DataTypes.STRING
        },
        unique_id: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        modelColor: {
            type: DataTypes.STRING
        },
        modelType: {
            type: DataTypes.STRING
        },
        video: {
            type: DataTypes.STRING
        },
        modelName: {
            type: DataTypes.STRING
        },
        repair_estimate: {
            type: DataTypes.STRING
        },
        lat: {
            type: DataTypes.STRING
        },
        lng: {
            type: DataTypes.STRING
        },
        zip: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        address: {
            type: DataTypes.STRING
        },
        dateTime: {
            type: DataTypes.STRING
        },
        userId: {
            type: DataTypes.UUID
        },
        technicianId: {
            type: DataTypes.UUID
        },

        modelId: {
            type: DataTypes.UUID
        },
        status: { type: DataTypes.STRING },

        time_request: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        extra_payment: {
            type: DataTypes.STRING
        },
        extra_payment_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        half_payment: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        full_payment: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        startrepaiar: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        EndRepair: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        startrepaiar_date: {
            type: DataTypes.STRING
        },
        EndRepair_date: {
            type: DataTypes.STRING
        },
        booking_complete: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        total_amount: {
            type: DataTypes.STRING
        },
        afterDiscount_amount: {
            type: DataTypes.STRING
        },
        discount_amount: {
            type: DataTypes.STRING
        },
         user_seen_unseen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        tech_seen_unseen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
    console.log(sequelize.queryInterface.describeTable());
        // sequelize.queryInterface.addColumn('bookings', 'zip', { type: DataTypes.STRING });

    bookings.sync().then(() => {
        bookings.create;
    });

    return bookings;
};
