const Sequelize = require('sequelize');
require('dotenv').config();
require('dotenv').load();
// const url = require('./dbUrl');

const db = new Sequelize(process.env.DATABASE_URL, {
  pool: {
    max: 3,
    min: 0,
    idle: 10000
  },
});


db.authenticate()
  .then(() => 
    console.log('Successfully connected to DB')
  )
  .catch(err => 
    console.log('Could not connect to DB', err)
  )

module.exports = db;