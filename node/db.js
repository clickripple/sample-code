const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require("sequelize");
const { NODE_DB, NODE_DB_USERNAME, NODE_DB_PASSWORD, NODE_HOST } = process.env;

const sequelize = new Sequelize(
    NODE_DB, 
    NODE_DB_USERNAME, 
    NODE_DB_PASSWORD, {
        host: NODE_HOST,
        dialect: "mysql",
        dialectOptions: {
            useUTC: false,
        },
        timezone:"+05:30"
    }
);

sequelize
    .authenticate()
    .then(result => {
        console.log("Connected to database *blackpatchapp*");
    })
    .catch(e => {
        console.log("Database connectivity error: ", e);
    });

var models = [
    "./models/user",
    "./models/admin",
    "./models/platform",
    "./models/brand",
    "./models/discount",
    "./models/model",
    "./models/country_codes",
    "./models/login_session",
    "./models/cms",
    "./models/issue",
    "./models/booking",
    "./models/request",
    "./models/service",
    "./models/technician",
    "./models/coupan",
    "./models/notification",
    "./models/help",
    "./models/support",
    "./models/referal",
    "./models/payment_history",
    "./models/conversation",
    "./models/message",
    "./models/rating",
    "./models/account",
    "./models/pincode",
    "./models/paid",
    "./models/newsletter",
    "./models/tech_support",
    "./models/problems",
    "./models/user_saved_location",
   
];

models.forEach(model => {
    exports[model] = sequelize.import(__dirname + "/" + model);
});
sequelize.models.conversations.hasMany(sequelize.models.messages);
sequelize.models.messages.belongsTo(sequelize.models.conversations, {
    onDelete: "cascade",
    hooks: true
});
sequelize.models.technicians.hasMany(sequelize.models.paids);
sequelize.models.paids.belongsTo(sequelize.models.technicians, {
    onDelete: "cascade",
    hooks: true
});
// platforms and brands association
sequelize.models.platforms.hasMany(sequelize.models.brands);
sequelize.models.brands.belongsTo(sequelize.models.platforms, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.technicians.hasMany(sequelize.models.payment_histories);
sequelize.models.payment_histories.belongsTo(sequelize.models.technicians, {
    onDelete: "cascade",
    hooks: true
});


sequelize.models.technicians.hasMany(sequelize.models.accounts);
sequelize.models.accounts.belongsTo(sequelize.models.technicians, {
    onDelete: "cascade",
    hooks: true
});
// brands and models association
sequelize.models.brands.hasMany(sequelize.models.models);
sequelize.models.models.belongsTo(sequelize.models.brands, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.brands.hasMany(sequelize.models.helps);
sequelize.models.helps.belongsTo(sequelize.models.brands, {
    onDelete: "cascade",
    hooks: true
});

// login_sessions and users association
sequelize.models.users.hasMany(sequelize.models.login_sessions);
sequelize.models.login_sessions.belongsTo(sequelize.models.users, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.users.hasMany(sequelize.models.supports);
sequelize.models.supports.belongsTo(sequelize.models.users, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.technicians.hasMany(sequelize.models.login_sessions);
sequelize.models.login_sessions.belongsTo(sequelize.models.technicians, {
    onDelete: "cascade",
    hooks: true
});

// brands and issues association
sequelize.models.models.hasOne(sequelize.models.issues);
sequelize.models.issues.belongsTo(sequelize.models.models, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.users.hasMany(sequelize.models.bookings);
sequelize.models.bookings.belongsTo(sequelize.models.users, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.technicians.hasMany(sequelize.models.bookings);
sequelize.models.bookings.belongsTo(sequelize.models.technicians, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.bookings.hasMany(sequelize.models.requests);
sequelize.models.requests.belongsTo(sequelize.models.bookings, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.technicians.hasMany(sequelize.models.requests);
sequelize.models.requests.belongsTo(sequelize.models.technicians, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.users.hasMany(sequelize.models.payment_histories);
sequelize.models.payment_histories.belongsTo(sequelize.models.users, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.bookings.hasMany(sequelize.models.payment_histories);
sequelize.models.payment_histories.belongsTo(sequelize.models.bookings, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.users.hasMany(sequelize.models.coupans);
sequelize.models.coupans.belongsTo(sequelize.models.users, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.users.hasMany(sequelize.models.ratings);
sequelize.models.ratings.belongsTo(sequelize.models.users, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.technicians.hasMany(sequelize.models.ratings);
sequelize.models.ratings.belongsTo(sequelize.models.technicians, {
    onDelete: "cascade",
    hooks: true
});

sequelize.models.bookings.hasMany(sequelize.models.ratings);
sequelize.models.ratings.belongsTo(sequelize.models.bookings, {
    onDelete: "cascade",
    hooks: true
});
module.exports = sequelize;
