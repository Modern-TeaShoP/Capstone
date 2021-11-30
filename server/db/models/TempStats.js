const Sequelize = require("sequelize");
const db = require("../db");

const TempStats = db.define("tempStats", {
    place: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1,
            max: 4,
        },
    },
    didWin: {
        type: Sequelize.BOOLEAN,
    },
    didLose: {
        type: Sequelize.BOOLEAN,
    },
    currentPlace: {
        type: Sequelize.INTEGER,
    },
    finishedPlace: {
        type: Sequelize.INTEGER,
    },
    moneyEarned: {
        type: Sequelize.INTEGER,
    },
    powerUps: {
        type: Sequelize.INTEGER,
    },
});

module.exports = TempStats;
