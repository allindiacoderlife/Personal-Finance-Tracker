import { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { X, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Rental Income',
  'Other',
];

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Rent & Housing',
  'Utilities & Bills',
  'Shopping',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];

const TransactionModal = ({ isOpen, onClose, editingTransaction = null }) => {
  const { addTransaction, updateTransaction } = useTransactions();

  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type || 'expense');
      setTitle(editingTransaction.title || '');
      setAmount(editingTransaction.amount ? String(editingTransaction.amount) : '');
      setCategory(editingTransaction.category || EXPENSE_CATEGORIES[0]);
      setDate(
        editingTransaction.date
          ? new Date(editingTransaction.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setNotes(editingTransaction.notes || '');
    } else {
      // Reset form
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0]);
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [editingTransaction, isOpen]);

  // When type changes, update category default if not matching current category options
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      if (!INCOME_CATEGORIES.includes(category)) {
        setCategory(INCOME_CATEGORIES[0]);
      }
    } else {
      if (!EXPENSE_CATEGORIES.includes(category)) {
        setCategory(EXPENSE_CATEGORIES[0]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || Number(amount) <= 0) return;

    setIsSubmitting(true);
    const payload = {
      title,
      amount: parseFloat(amount),
      type,
      category,
      date,
      notes,
    };

    let res;
    if (editingTransaction) {
      res = await updateTransaction(editingTransaction._id, payload);
    } else {
      res = await addTransaction(payload);
    }

    setIsSubmitting(false);
    if (res.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle Buttons */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income (+)
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Title / Description
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grocery Shopping, Monthly Rent, Client Retainer"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition cursor-pointer"
                >
                  {currentCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add optional context or receipt notes..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? 'Saving...'
                : editingTransaction
                ? 'Save Changes'
                : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

