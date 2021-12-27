module.exports = function(sequelize, DataTypes) {
    var tech_supports = sequelize.define("tech_supports", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        issueType: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        issueTitle: {
            type: DataTypes.TEXT
        },
        message: {
            type: DataTypes.TEXT
        },
        bookingId: {
            type: DataTypes.STRING
        }
    });

    tech_supports.sync().then(() => {
        tech_supports.create;
    });

    return tech_supports;
};
