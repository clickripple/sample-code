module.exports = function(sequelize, DataTypes) {
    var issues = sequelize.define("issues", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        en_issue_list: {
            type: DataTypes.STRING(2000)
        },
        es_issue_list: {
            type: DataTypes.STRING(2000)
        },
        
        en_image: {
            type: DataTypes.STRING(1000)
        },es_image: {
            type: DataTypes.STRING(1000)
        },
        modelId: {
            type: DataTypes.UUID
        }
    });

    issues.sync().then(() => {
        issues.create;
    });

    return issues;
};
