import { useTransactions } from '../../context/TransactionContext';
import { Search, Download, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Salary',
  'Freelance',
  'Investments',
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

const FilterBar = () => {
  const { filters, setFilterParam, resetFilters, exportCSV } = useTransactions();

  const handleDatePreset = (preset) => {
    const today = new Date();
    if (preset === 'all') {
      setFilterParam('startDate', '');
      setFilterParam('endDate', '');
    } else if (preset === 'thisMonth') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
        .toISOString()
        .split('T')[0];
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
      setFilterParam('startDate', start);
      setFilterParam('endDate', end);
    } else if (preset === 'last30') {
      const start = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const end = today.toISOString().split('T')[0];
      setFilterParam('startDate', start);
      setFilterParam('endDate', end);
    }
  };

  const isFiltered =
    filters.type ||
    filters.category ||
    filters.search ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilterParam('search', e.target.value)}
            placeholder="Search transactions by title or notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {isFiltered && (
            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={exportCSV}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Type Pills & Category Select & Date presets */}
      <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100">
        {/* Type Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterParam('type', '')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filters.type === ''
                ? 'bg-white text-slate-800 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setFilterParam('type', 'income')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filters.type === 'income'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilterParam('type', 'expense')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              filters.type === 'expense'
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Expense
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          value={filters.category || 'All'}
          onChange={(e) => setFilterParam('category', e.target.value === 'All' ? '' : e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        {/* Date presets */}
        <div className="flex items-center space-x-1.5 ml-auto">
          <button
            onClick={() => handleDatePreset('all')}
            className={`text-xs px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
              !filters.startDate && !filters.endDate
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => handleDatePreset('thisMonth')}
            className="text-xs px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            This Month
          </button>
          <button
            onClick={() => handleDatePreset('last30')}
            className="text-xs px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-700 transition cursor-pointer"
          >
            Last 30 Days
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

