import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      savingsRate: 0,
      totalTransactions: 0,
    },
    categoryBreakdown: [],
    monthlyTrends: [],
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    order: 'desc',
  });

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.order) params.order = filters.order;

      const { data } = await api.get('/transactions', { params });
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, filters]);

  const fetchSummary = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await api.get('/transactions/summary');
      if (data.success) {
        setSummary(data.data);
      }
    } catch (error) {
      console.error('Failed to load summary:', error.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
      fetchSummary();
    } else {
      setTransactions([]);
      setSummary({
        summary: { totalIncome: 0, totalExpense: 0, balance: 0, savingsRate: 0, totalTransactions: 0 },
        categoryBreakdown: [],
        monthlyTrends: [],
      });
    }
  }, [isAuthenticated, fetchTransactions, fetchSummary]);

  const addTransaction = async (formData) => {
    try {
      const { data } = await api.post('/transactions', formData);
      if (data.success) {
        toast.success('Transaction added successfully!');
        fetchTransactions();
        fetchSummary();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add transaction';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const updateTransaction = async (id, formData) => {
    try {
      const { data } = await api.put(`/transactions/${id}`, formData);
      if (data.success) {
        toast.success('Transaction updated!');
        fetchTransactions();
        fetchSummary();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update transaction';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const { data } = await api.delete(`/transactions/${id}`);
      if (data.success) {
        toast.success('Transaction deleted');
        setTransactions((prev) => prev.filter((item) => item._id !== id));
        fetchSummary();
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete transaction';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const setFilterParam = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      category: '',
      search: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      order: 'desc',
    });
  };

  const exportCSV = async () => {
    try {
      const response = await api.get('/transactions/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Transactions exported to CSV!');
    } catch (error) {
      toast.error('Failed to export transactions');
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        summary,
        loading,
        filters,
        setFilterParam,
        resetFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refresh: () => {
          fetchTransactions();
          fetchSummary();
        },
        exportCSV,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

