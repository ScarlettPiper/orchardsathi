const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orchardsathi';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${uri}.`);
    console.warn(`[MongoDB Warning] Error message: ${error.message}`);
    console.warn(`[MongoDB Notice] For Review 1 demonstration without MongoDB Atlas credentials, fallback mock/in-memory records will be served for unpersisted calls.`);
    isConnected = false;
    return false;
  }
};

const getDbStatus = () => ({
  connected: isConnected,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || null
});

module.exports = { connectDB, getDbStatus };
