const { Sequelize, Model, DataTypes } = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    var messages = sequelize.define("messages", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        conversationId: {
            type: DataTypes.UUID
        },
        message: { type: DataTypes.TEXT },
        sender: { type: DataTypes.UUID },
        receiver:{ type: DataTypes.UUID },
        seen: { type: DataTypes.BOOLEAN, defaultValue: false },
        seen_by: { type: DataTypes.UUID },
        booking_id: { type: DataTypes.STRING },
    });

    messages.sync().then(() => {
        messages.create;
    });

    return messages;
};
