require('dotenv').config();
const connect = require('./connect');
const mongoose = require('mongoose');
const seed = require('./seedData');

const seed1000 = async() => {
  await connect();
  await mongoose.connection.dropDatabase();
  await seed(1000, 20, 2000);
  await mongoose.connection.close();
};

seed1000();
