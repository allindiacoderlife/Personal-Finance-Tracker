import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTransactions } from '../../context/TransactionContext';
import { PieChart as PieIcon } from 'lucide-react';

const COLORS = [
  '#6366f1', // Indigo
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#64748b', // Slate
];

const CategoryPieChart = () => {
  const { summary } = useTransactions();
  const categoryData = summary?.categoryBreakdown || [];

  const chartData = categoryData.map((item) => ({
    name: item.category,
    value: item.totalAmount,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white px-3 py-2 rounded-xl shadow-lg border border-slate-100 text-xs">
          <p className="font-semibold text-slate-800">{data.name}</p>
          <p className="text-rose-600 font-bold mt-0.5">
            ${Number(data.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col h-[380px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Expense Breakdown</h2>
          <p className="text-xs text-slate-400">By category allocation</p>
        </div>
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
          <PieIcon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center">
        {chartData.length === 0 ? (
          <div className="text-center text-slate-400">
            <p className="text-sm">No expense records found</p>
            <p className="text-xs mt-1">Add expenses to see category distribution</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CategoryPieChart;

