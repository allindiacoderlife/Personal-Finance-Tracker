import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node.js on Windows with querySrv ECONNREFUSED for MongoDB Atlas
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    // Ignore in environments where setting DNS servers is restricted
  }
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance_tracker';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.warn(`👉 Provide a valid MONGO_URI (e.g. MongoDB Atlas cluster) in backend/.env`);
  }
};

export default connectDB;
