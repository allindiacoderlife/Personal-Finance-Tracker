import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { BarChart3 } from 'lucide-react';

const MonthlyBarChart = () => {
  const { summary } = useTransactions();
  const monthlyTrends = summary?.monthlyTrends || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
          <p className="font-semibold text-slate-800 mb-1.5">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-slate-500 flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                Income:
              </span>
              <span className="font-bold text-emerald-600">
                ${Number(payload[0]?.value || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-slate-500 flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                Expense:
              </span>
              <span className="font-bold text-rose-600">
                ${Number(payload[1]?.value || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col h-[380px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Monthly Cash Flow</h2>
          <p className="text-xs text-slate-400">Income vs. Expense over past 6 months</p>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <BarChart3 className="w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val >= 1000 ? `${val / 1000}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingBottom: '12px' }}
            />
            <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBarChart;

