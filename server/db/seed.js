const {
    db,
    models: { User, LifeStats, TempStats },
} = require(".");

const users = [
    {
        username: "Serg",
        password: "1234",
        email: "serg@test.com",
    },
];

const tempStats = [
    {
        place: 1,
        didWin: true,
        didLose: false,
        currentPlace: 1,
        finishedPlace: 1,
        moneyEarned: 10000,
        powerUps: 5,
    },
];

const lifeStats = [
    {
        wins: 5,
        losses: 1,
        averageFinish: 2,
        moneyEarned: 35000,
        moneySpent: 15000,
        totalPowerUps: 12,
    },
];

const seed = async () => {
    try {
        await db.sync({ force: true });

        await Promise.all(
            users.map((user) => {
                return User.create(user);
            }),
            tempStats.map((tempStats) => {
                return TempStats.create(tempStats);
            }),
            lifeStats.map((lifeStat) => {
                return LifeStats.create(lifeStat);
            })
        );

        const seedUser = await User.findByPk(1);
        const seedLifeStats = await LifeStats.findByPk(1);
        seedLifeStats.setUser(seedUser);
    } catch (error) {
        console.error(error);
    }
};

seed()
    .then(() => {
        console.log("Seeding Successful");
    })
    .catch((err) => {
        console.log("Could not Seed Data!");
        console.err(err);
    });

/*
const artists = await Promise.all([
    Artist.create({ name: 'Dexter Britain' }),
    Artist.create({ name: 'Jets Overhead' }),
    Artist.create({ name: 'Nine Inch Nails' }),
  ]);
*/

module.exports = seed;
