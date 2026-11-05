import { useTransactions } from '../../context/TransactionContext';
import { ArrowDownRight, ArrowUpRight, Wallet, Percent } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const StatCards = () => {
  const { summary } = useTransactions();
  const { totalIncome = 0, totalExpense = 0, balance = 0, savingsRate = 0, totalTransactions = 0 } =
    summary?.summary || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Balance Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Balance
          </span>
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3
            className={`text-2xl font-bold tracking-tight ${
              balance >= 0 ? 'text-slate-900' : 'text-rose-600'
            }`}
          >
            {formatCurrency(balance)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Across {totalTransactions} logged transactions
          </p>
        </div>
      </div>

      {/* Income Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Income
          </span>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight text-emerald-600">
            +{formatCurrency(totalIncome)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Total revenue accrued</p>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Expenses
          </span>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight text-rose-600">
            -{formatCurrency(totalExpense)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Total outflows recorded</p>
        </div>
      </div>

      {/* Savings Rate Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Savings Rate
          </span>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h3 className="text-2xl font-bold tracking-tight text-amber-600">
            {savingsRate}%
          </h3>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;

