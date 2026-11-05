import { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import {
  Trash2,
  Edit3,
  Calendar,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
} from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TransactionList = ({ onEdit, onAddNew }) => {
  const { transactions, loading, deleteTransaction } = useTransactions();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setDeletingId(id);
      await deleteTransaction(id);
      setDeletingId(null);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Fetching transaction history...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-3">
          <Receipt className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No transactions found</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          No records match your active filters. Try adjusting your search or add a new transaction.
        </p>
        <button
          onClick={onAddNew}
          className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Transaction History</h2>
          <p className="text-xs text-slate-400">
            Showing {transactions.length} recorded items
          </p>
        </div>
      </div>

      {/* Responsive Transaction Items */}
      <div className="divide-y divide-slate-100">
        {transactions.map((tx) => {
          const isIncome = tx.type === 'income';
          return (
            <div
              key={tx._id}
              className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition"
            >
              {/* Left Details */}
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isIncome
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {isIncome ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-slate-800">{tx.title}</h3>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md">
                      {tx.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(tx.date)}
                    </span>
                    {tx.notes && (
                      <span className="hidden md:inline-block truncate max-w-xs text-slate-400">
                        • {tx.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Details & Actions */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 pl-13 sm:pl-0">
                <span
                  className={`text-base font-bold tracking-tight ${
                    isIncome ? 'text-emerald-600' : 'text-slate-900'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(tx)}
                    title="Edit transaction"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tx._id, tx.title)}
                    disabled={deletingId === tx._id}
                    title="Delete transaction"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === tx._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionList;

