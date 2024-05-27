// db/connection.js
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'Sistem_informasi_Akademik';

let db;

const connectToDb = async () => {
  if (!db) {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to database ${dbName}`);
  }
  return db;
};

module.exports = connectToDb;
