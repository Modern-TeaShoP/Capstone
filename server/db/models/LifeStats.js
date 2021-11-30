const Sequelize = require("sequelize");
const db = require("../db");

const LifeStats = db.define("lifeStats", {
    wins: {
        type: Sequelize.INTEGER,
    },
    losses: {
        type: Sequelize.INTEGER,
    },
    averageFinish: {
        type: Sequelize.INTEGER,
    },
    moneyEarned: {
        type: Sequelize.INTEGER,
    },
    moneySpent: {
        type: Sequelize.INTEGER,
    },
    totalPowerUps: {
        type: Sequelize.INTEGER,
    },
});

module.exports = LifeStats;
