const User = require("./models/User");
const TempStats = require("./models/TempStats");
const LifeStats = require("./models/LifeStats");
const db = require("./db");

// Should we use local/session storage instead, what if player leaves?
//User.hasOne(TempStats)
User.hasOne(LifeStats);
LifeStats.belongsTo(User);

module.exports = {
    db,
    models: {
        User,
        TempStats,
        LifeStats,
    },
};
