module.exports = function(sequelize, DataTypes) {
    var service = sequelize.define("service", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.ID
        },
        name: {
            type: DataTypes.STRING
        },
        days: {
            type: DataTypes.INTEGER
        },
        hours: {
            type: DataTypes.INTEGER
        },
        minutes: {
            type: DataTypes.INTEGER
        }
    });

    service.sync().then(() => {
        service.create;
    });

    service.count({ where:
            { id: 1 }
    }).then(count => {
            if (count == 0) {
                const ser = new service({
                    id:1,
                    name : "delivery",
                    days: 1,
                    hours: 0,
                    minutes: 0
                })
                ser.save();

            }
        }
    );

    return service;
};
