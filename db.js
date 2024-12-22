require('dotenv').config(); // Load environment variables
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client;

async function connectToDB() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log("Connected to MongoDB!");
  }

  const db = client.db(dbName);
  return db;
}

async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    console.log("MongoDB connection closed.");
  }
}

module.exports = {
  connectToDB,
  closeConnection,
};
