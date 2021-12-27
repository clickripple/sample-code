var bcrypt = require("bcrypt");
module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define(
        "users",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            unique_id: {
                type: DataTypes.STRING
            },
            provider: {
                type: DataTypes.STRING
            },
            username: { type: DataTypes.STRING, allowNull: false },
            first_name: { type: DataTypes.STRING },
            last_name: { type: DataTypes.STRING },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                defaultValue: ""
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            address: { type: DataTypes.STRING },
            lat: { type: DataTypes.STRING },
            lng: { type: DataTypes.STRING },
            phone: { type: DataTypes.STRING },
            country_code: { type: DataTypes.STRING },
            profile_pic: { type: DataTypes.STRING(500) },
            isActive: { type: DataTypes.BOOLEAN },
            social_id: { type: DataTypes.STRING },
            referal_code: { type: DataTypes.STRING },
            invite_code: { type: DataTypes.STRING },
            invite_status: { type: DataTypes.BOOLEAN, defaultValue: false },
            emailVerify: { type: DataTypes.BOOLEAN },
            dob: { type: DataTypes.STRING },
            zip: { type: DataTypes.STRING },
            gender: { type: DataTypes.STRING },
        },
        {
            hooks: {
                beforeCreate: login => {

                    const salt = bcrypt.genSaltSync();
                    login.password = bcrypt.hashSync(login.password, salt);

                    let ageCheck = new Date();
                    ageCheck.setFullYear(ageCheck.getFullYear() - 18);
                    let birthDate = new Date(login.dob);
                    if (ageCheck < birthDate) {
                        throw new Error("Your age is less than 18!");
                    }
                }
            }
        }
    );

    function generateHash(data) {
        if (data === null) {
            throw new Error("No found employee");
        } else if (!user.changed("password")) return data.password;
        else {
            let salt = bcrypt.genSaltSync();
            return (data.password = bcrypt.hashSync(data.password, salt));
        }
    }
    users.beforeUpdate(generateHash);


    users.sync().then(() => {
        users.create;
    });
    
    if(!users.rawAttributes.first_name){
        sequelize.queryInterface.addColumn('users', 'first_name', { type: DataTypes.STRING });
    }

    if(!users.rawAttributes.last_name){
        sequelize.queryInterface.addColumn('users', 'last_name', { type: DataTypes.STRING });
    }

    return users;
};
