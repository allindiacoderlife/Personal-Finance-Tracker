import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {}
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedData = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/finance_tracker';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clean existing demo user
    const demoEmail = 'demo@finance.com';
    await User.deleteOne({ email: demoEmail });

    // Create Demo User
    const user = await User.create({
      name: 'Demo Alex',
      email: demoEmail,
      password: 'demo1234',
    });

    console.log(`👤 Created Demo User: ${user.email} (Password: demo1234)`);

    // Clean existing transactions for demo user
    await Transaction.deleteMany({ user: user._id });

    const now = new Date();
    const demoTransactions = [
      // Current Month
      {
        user: user._id,
        title: 'Monthly Tech Salary',
        amount: 6500,
        type: 'income',
        category: 'Salary',
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        notes: 'Monthly corporate salary deposit',
      },
      {
        user: user._id,
        title: 'Apartment Rent',
        amount: 1850,
        type: 'expense',
        category: 'Rent & Housing',
        date: new Date(now.getFullYear(), now.getMonth(), 3),
        notes: 'Downtown 2BHK rental payment',
      },
      {
        user: user._id,
        title: 'Whole Foods Market',
        amount: 320,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date(now.getFullYear(), now.getMonth(), 7),
        notes: 'Bi-weekly groceries',
      },
      {
        user: user._id,
        title: 'Freelance Web Design',
        amount: 1200,
        type: 'income',
        category: 'Freelance',
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        notes: 'Landing page client project',
      },
      {
        user: user._id,
        title: 'Electric & Internet Utilities',
        amount: 180,
        type: 'expense',
        category: 'Utilities & Bills',
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        notes: 'Fiber internet + power bill',
      },
      {
        user: user._id,
        title: 'Weekend Dining & Cinema',
        amount: 140,
        type: 'expense',
        category: 'Entertainment',
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        notes: 'Dinner and movies with friends',
      },
      {
        user: user._id,
        title: 'Gym & Fitness Membership',
        amount: 85,
        type: 'expense',
        category: 'Healthcare',
        date: new Date(now.getFullYear(), now.getMonth(), 18),
        notes: 'Monthly fitness pass',
      },
      // Previous Month
      {
        user: user._id,
        title: 'Monthly Tech Salary',
        amount: 6500,
        type: 'income',
        category: 'Salary',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        notes: 'Salary direct deposit',
      },
      {
        user: user._id,
        title: 'Apartment Rent',
        amount: 1850,
        type: 'expense',
        category: 'Rent & Housing',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 3),
        notes: 'Rental payment',
      },
      {
        user: user._id,
        title: 'Dividend Payout',
        amount: 450,
        type: 'income',
        category: 'Investments',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 14),
        notes: 'Quarterly index fund dividend',
      },
      {
        user: user._id,
        title: 'Electronics & Headphones',
        amount: 299,
        type: 'expense',
        category: 'Shopping',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 20),
        notes: 'Noise cancelling headphones for work',
      },
      // Two Months Ago
      {
        user: user._id,
        title: 'Monthly Tech Salary',
        amount: 6500,
        type: 'income',
        category: 'Salary',
        date: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        notes: 'Monthly corporate salary deposit',
      },
      {
        user: user._id,
        title: 'Apartment Rent',
        amount: 1850,
        type: 'expense',
        category: 'Rent & Housing',
        date: new Date(now.getFullYear(), now.getMonth() - 2, 3),
        notes: 'Rental payment',
      },
      {
        user: user._id,
        title: 'Supermarket Groceries',
        amount: 410,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date(now.getFullYear(), now.getMonth() - 2, 10),
        notes: 'Monthly supplies and pantry replenishment',
      },
    ];

    await Transaction.insertMany(demoTransactions);
    console.log(`📊 Seeded ${demoTransactions.length} sample transactions!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

seedData();

