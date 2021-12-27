module.exports = function(sequelize, DataTypes) {
    var payment_history = sequelize.define("payment_histories", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        amount: {
            type: DataTypes.STRING
        },
        coupan_amount: {
            type: DataTypes.INTEGER
        },
        currency_code: {
            type: DataTypes.STRING
        },
        transition_id: {
            type: DataTypes.STRING
        },
        paymentId: {
            type: DataTypes.STRING
        },
        token: {
            type: DataTypes.STRING
        },
        PayerID: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING
        },
        create_time: {
            type: DataTypes.STRING
        },
        userId: {
            type: DataTypes.UUID
        },
        bookingId: {
            type: DataTypes.UUID
        }, technicianId: {
            type: DataTypes.UUID
        }
    });

    payment_history.sync().then(() => {
        payment_history.create;
    });

    return payment_history;
};
