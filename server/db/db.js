const Sequelize = require('sequelize');
// const pkg = require("../../package.json");

// const databaseName = pkg.name;

// const db = new Sequelize(
//   process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`
// );
const db = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = db;
