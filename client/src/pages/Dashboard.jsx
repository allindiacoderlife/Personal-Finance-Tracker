import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import StatCards from '../components/dashboard/StatCards';
import MonthlyBarChart from '../components/charts/MonthlyBarChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import FilterBar from '../components/dashboard/FilterBar';
import TransactionList from '../components/dashboard/TransactionList';
import TransactionModal from '../components/dashboard/TransactionModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      {/* Top Navigation */}
      <Navbar onOpenAddModal={handleOpenAdd} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Stat Cards */}
        <StatCards />

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MonthlyBarChart />
          <CategoryPieChart />
        </div>

        {/* Filters and Search Toolbar */}
        <FilterBar />

        {/* Transaction History Table */}
        <TransactionList onEdit={handleOpenEdit} onAddNew={handleOpenAdd} />
      </main>

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default Dashboard;

