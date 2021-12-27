module.exports = function(sequelize, DataTypes) {
    var accounts = sequelize.define("accounts", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        technicianId: {
            type: DataTypes.UUID
        },
        bank_name: {
            type: DataTypes.UUID
        },
        account_number: {
            type: DataTypes.STRING
        },
        account_name: {
            type: DataTypes.STRING
        },
        client_number: {
            type: DataTypes.STRING
        },
       
    });

    accounts.sync().then(() => {
        accounts.create;
    });

    return accounts;
};
