module.exports = function(sequelize, DataTypes) {
    var problems = sequelize.define("problems", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        type: {
            type: DataTypes.STRING
        },
        title: {
            type: DataTypes.TEXT
        }
    });

    problems.sync().then(() => {
        problems.problems;
    });

    return problems;
};
