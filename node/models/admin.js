var bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
    var admins = sequelize.define(
        "admins",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, allowNull: false },
            password: { type: DataTypes.STRING, allowNull: false },
            address: { type: DataTypes.STRING },
            phone: { type: DataTypes.STRING },
            profile_pic: { type: DataTypes.STRING(500) },
            gender: { type: DataTypes.STRING },
            isActive: { type: DataTypes.BOOLEAN },
            dob: { type: DataTypes.DATE }
        },
        {
            hooks: {
                beforeCreate: login => {
                    const salt = bcrypt.genSaltSync();
                    login.password = bcrypt.hashSync(login.password, salt);
                }
            }
        }
    );

    admins.sync().then(() => {
        admins.create;
    });

    return admins;
};
