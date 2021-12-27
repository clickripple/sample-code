const {Sequelize, Model, DataTypes} = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    var messages = sequelize.define("user_saved_location", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID
        },
        techId: {
            type: DataTypes.UUID
        },
        lat: {type: DataTypes.STRING},
        lng: {type: DataTypes.STRING},
        curr_address: {type: DataTypes.STRING},
        date: {
            type: DataTypes.STRING
        },
//        booking_id: { type: DataTypes.STRING }


    });

    messages.sync().then(() => {
        messages.create;
    });

    return messages;
};
