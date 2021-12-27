module.exports = function(sequelize, DataTypes) {
	var conversations = sequelize.define("conversations", {
		id: {
			type: DataTypes.UUID,
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4
		},
		sender: { type: DataTypes.UUID },
		receiver: { type: DataTypes.UUID },
		booking_id: { type: DataTypes.STRING },
	});

	conversations.sync().then(() => {
		conversations.create;
	});

	return conversations;
};
