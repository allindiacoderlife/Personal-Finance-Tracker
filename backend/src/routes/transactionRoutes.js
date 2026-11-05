import express from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  exportTransactionsCSV,
} from '../controllers/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes below
router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.get('/summary', getTransactionSummary);
router.get('/export', exportTransactionsCSV);

router.route('/:id')
  .get(getTransactionById)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;

