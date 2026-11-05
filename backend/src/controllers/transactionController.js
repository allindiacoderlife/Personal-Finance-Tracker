import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';

// @desc    Get user transactions with filtering, search, and sorting
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      order = 'desc',
    } = req.query;

    const query = { user: req.user._id };

    // Filter by type
    if (type && ['income', 'expense'].includes(type)) {
      query.type = type;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of the day if date only
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Search query
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { notes: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const transactions = await Transaction.find(query).sort(sortOptions);

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, type, and category',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero',
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount: Number(amount),
      type,
      category,
      date: date ? new Date(date) : new Date(),
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const { title, amount, type, category, date, notes } = req.body;

    if (amount !== undefined && Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero',
      });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        title: title !== undefined ? title : transaction.title,
        amount: amount !== undefined ? Number(amount) : transaction.amount,
        type: type !== undefined ? type : transaction.type,
        category: category !== undefined ? category : transaction.category,
        date: date !== undefined ? new Date(date) : transaction.date,
        notes: notes !== undefined ? notes : transaction.notes,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction analytics, stats, and chart data
// @route   GET /api/transactions/summary
// @access  Private
export const getTransactionSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Overall Totals
    const totalsAggregation = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    let totalTransactions = 0;

    totalsAggregation.forEach((item) => {
      totalTransactions += item.count;
      if (item._id === 'income') {
        totalIncome = item.total;
      } else if (item._id === 'expense') {
        totalExpense = item.total;
      }
    });

    const balance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? Math.max(0, ((balance / totalIncome) * 100).toFixed(1)) : 0;

    // 2. Category-wise Expense Breakdown (for Pie / Donut Chart)
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense' } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      {
        $project: {
          category: '$_id',
          totalAmount: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    // 3. Monthly Trends for the last 6 months (for Bar Chart)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Format monthly data for front-end charts (e.g. { month: 'Nov 2026', income: 5000, expense: 2000 })
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthlyMap = {};

    // Initialize last 6 months in chronological order
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyMap[key] = {
        key,
        label,
        income: 0,
        expense: 0,
        net: 0,
      };
    }

    monthlyTrends.forEach((entry) => {
      const key = `${entry._id.year}-${String(entry._id.month).padStart(2, '0')}`;
      if (monthlyMap[key]) {
        if (entry._id.type === 'income') {
          monthlyMap[key].income = entry.total;
        } else if (entry._id.type === 'expense') {
          monthlyMap[key].expense = entry.total;
        }
        monthlyMap[key].net = monthlyMap[key].income - monthlyMap[key].expense;
      }
    });

    const monthlyData = Object.values(monthlyMap);

    res.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpense,
          balance,
          savingsRate: Number(savingsRate),
          totalTransactions,
        },
        categoryBreakdown,
        monthlyTrends: monthlyData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export transactions to CSV
// @route   GET /api/transactions/export
// @access  Private
export const exportTransactionsCSV = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });

    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Notes'];
    const rows = transactions.map((t) => [
      new Date(t.date).toISOString().split('T')[0],
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.type,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

