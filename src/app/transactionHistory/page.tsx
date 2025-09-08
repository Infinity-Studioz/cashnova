'use client'
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import MainNavigation from "../components/MainNavigation";
import AuthButtons from "../components/AuthButtons";
import '../../lib/fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  formattedAmount: string;
  category: string;
  effectiveCategory: string;
  note?: string;
  merchant?: string;
  date: string;
  status: 'completed' | 'pending' | 'flagged';
  recurring: boolean;
  paymentMethod?: string;
}

interface TransactionResponse {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netAmount: number;
    formattedTotalIncome: string;
    formattedTotalExpenses: string;
    formattedNetAmount: string;
    transactionCount: number;
  };
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    count: number;
    percentage: number;
    formattedAmount: string;
  }>;
}

const TransactionHistoryPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    dateRange: '30days',
    category: 'allCats',
    amountRange: 'anyAmt',
    status: 'allTrans',
    page: 1,
    limit: 10
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netAmount: 0,
    formattedTotalIncome: '₦0',
    formattedTotalExpenses: '₦0',
    formattedNetAmount: '₦0',
    transactionCount: 0
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  // Fetch transactions with current filters
  const fetchTransactions = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      });

      const response = await fetch(`/api/transactions?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }

      const data: TransactionResponse = await response.json();
      
      setTransactions(data.transactions);
      setPagination(data.pagination);
      setSummary(data.summary);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  // Load transactions on component mount and filter changes
  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session, fetchTransactions]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(false);
  };

  // Handle delete transaction
  const handleDelete = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }

      const result = await response.json();
      toast.success('Transaction deleted successfully');
      
      if (result.warnings?.length > 0) {
        result.warnings.forEach((warning: string) => toast.warning(warning));
      }

      if (result.budgetImpact) {
        toast.info(result.budgetImpact);
      }

      // Refresh the list
      fetchTransactions();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      toast.error(errorMessage);
    }
  };

  // Handle flag/unflag transaction
  const handleFlag = async (transactionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'flagged' ? 'completed' : 'flagged';
    
    try {
      const response = await fetch(`/api/transactions/${transactionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update transaction');
      }

      toast.success(`Transaction ${newStatus === 'flagged' ? 'flagged for review' : 'unflagged'}`);
      fetchTransactions();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      toast.error(errorMessage);
    }
  };

  // Handle edit transaction
  const handleEdit = (transaction: Transaction) => {
    setEditingId(transaction._id);
    setEditData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.effectiveCategory,
      note: transaction.note,
      merchant: transaction.merchant,
      date: transaction.date.split('T')[0]
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      const response = await fetch(`/api/transactions/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update transaction');
      }

      const result = await response.json();
      toast.success('Transaction updated successfully');
      
      if (result.aiInsight) {
        toast.info(result.aiInsight);
      }

      setEditingId(null);
      setEditData({});
      fetchTransactions();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Helper function to get category icon and color
  const getCategoryDisplay = (category: string, type: 'income' | 'expense') => {
    const iconMap: { [key: string]: { icon: string; bgClass: string; textClass: string } } = {
      'Food & Dining': { icon: 'utensils', bgClass: 'bg-orange-100', textClass: 'text-orange-600' },
      'Transport': { icon: 'car', bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
      'Bills': { icon: 'bolt', bgClass: 'bg-yellow-100', textClass: 'text-yellow-600' },
      'Shopping': { icon: 'shopping-bag', bgClass: 'bg-purple-100', textClass: 'text-purple-600' },
      'Entertainment': { icon: 'gamepad', bgClass: 'bg-pink-100', textClass: 'text-pink-600' },
      'School Fees': { icon: 'graduation-cap', bgClass: 'bg-indigo-100', textClass: 'text-indigo-600' },
      'Church/Mosque': { icon: 'praying-hands', bgClass: 'bg-green-100', textClass: 'text-green-600' },
      'Family Support': { icon: 'heart', bgClass: 'bg-red-100', textClass: 'text-red-600' },
      'Health/Medical': { icon: 'medkit', bgClass: 'bg-teal-100', textClass: 'text-teal-600' },
      'Rent/Housing': { icon: 'home', bgClass: 'bg-gray-100', textClass: 'text-gray-600' },
      'Salary': { icon: 'money-bill-wave', bgClass: 'bg-green-100', textClass: 'text-green-600' },
      'Freelance Work': { icon: 'laptop-code', bgClass: 'bg-blue-100', textClass: 'text-blue-600' },
    };

    const defaultDisplay = type === 'income' 
      ? { icon: 'money-bill-wave', bgClass: 'bg-green-100', textClass: 'text-green-600' }
      : { icon: 'receipt', bgClass: 'bg-gray-100', textClass: 'text-gray-600' };

    return iconMap[category] || defaultDisplay;
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return (
    <>
      <div>Please sign in to access your financial activities</div>
      <AuthButtons />
    </>
  );

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transaction History
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Review and manage all your financial activities
              </p>
            </div>
            <button
              onClick={() => router.push('/addTransaction')}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={'plus'} className="mr-2" /> Add Transaction
            </button>
          </div>

          {/* Summary Stats */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 card-shadow">
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={'arrow-up'} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {summary.formattedTotalIncome}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 card-shadow">
                <div className="flex items-center">
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={'arrow-down'} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {summary.formattedTotalExpenses}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 card-shadow">
                <div className="flex items-center">
                  <div className={`${summary.netAmount >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} p-2 rounded-lg mr-3`}>
                    <FontAwesomeIcon icon={'balance-scale'} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Net Amount</p>
                    <p className={`text-lg font-semibold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {summary.formattedNetAmount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Stats */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 card-shadow dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Date Range
                </label>
                <select
                  id="dateRange"
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="3months">Last 3 months</option>
                  <option value="6months">Last 6 months</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Category
                </label>
                <select
                  id="category"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="allCats">All Categories</option>
                  <option value="food">Food & Dining</option>
                  <option value="shopping">Shopping</option>
                  <option value="transportation">Transport</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Bills</option>
                  <option value="salary">Salary</option>
                  <option value="schoolFees">School Fees</option>
                  <option value="church">Church/Mosque</option>
                  <option value="family">Family Support</option>
                  <option value="health">Health/Medical</option>
                  <option value="rent">Rent/Housing</option>
                </select>
              </div>

              <div>
                <label htmlFor="amountRange" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Amount Range
                </label>
                <select
                  id="amountRange"
                  value={filters.amountRange}
                  onChange={(e) => handleFilterChange('amountRange', e.target.value)}
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="anyAmt">Any Amount</option>
                  <option value="u-50">Under ₦50,000</option>
                  <option value="50-200">₦50,000 - ₦200,000</option>
                  <option value="200-500">₦200,000 - ₦500,000</option>
                  <option value="o-500">Over ₦500,000</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400">
                  Status
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="allTrans">All Transactions</option>
                  <option value="review">Flagged for Review</option>
                  <option value="recurring">Recurring</option>
                  <option value="oneTime">One-time</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="text-primary hover:text-primary-dark mr-4 disabled:opacity-50"
                >
                  <FontAwesomeIcon 
                    icon={'sync-alt'} 
                    className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} 
                  /> 
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FontAwesomeIcon icon={'download'} className="mr-1" /> Export
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.totalCount)} of{' '}
                {pagination.totalCount} transactions
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500 text-xl" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading transactions</h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => fetchTransactions()}
                      className="text-xs font-medium text-red-600 hover:text-red-500"
                    >
                      Try again <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden card-shadow dark:bg-gray-800 p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading your transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            /* Empty State */
            <div className="bg-white shadow-sm rounded-lg overflow-hidden card-shadow dark:bg-gray-800 p-8 text-center">
              <FontAwesomeIcon icon={'receipt'} className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {Object.values(filters).some(f => f !== 'allCats' && f !== 'allTrans' && f !== 'anyAmt' && f !== '30days' && f !== 1 && f !== 10) 
                  ? 'Try adjusting your filters to see more transactions.'
                  : 'Start by adding your first transaction.'}
              </p>
              <button
                onClick={() => router.push('/addTransaction')}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
              >
                <FontAwesomeIcon icon={'plus'} className="mr-2" /> Add Your First Transaction
              </button>
            </div>
          ) : (
            /* Transactions List */
            <>
              <div className="bg-white shadow-sm rounded-lg overflow-hidden card-shadow dark:bg-gray-800">
                <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 card-shadow dark:bg-gray-800 font-medium text-gray-500 text-sm dark:text-gray-400">
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {transactions.map((transaction) => {
                  const isEditing = editingId === transaction._id;
                  const categoryDisplay = getCategoryDisplay(transaction.effectiveCategory, transaction.type);

                  return (
                    <div
                      key={transaction._id}
                      className={`bg-white grid grid-cols-12 p-4 border-b border-gray-200 dark:bg-gray-800 ${
                        transaction.type === 'income' ? 'transaction-income' : 'transaction-expense'
                      }`}
                    >
                      {isEditing ? (
                        /* Edit Mode */
                        <>
                          <div className="col-span-4 flex items-center">
                            <div className={`category-icon ${categoryDisplay.bgClass} ${categoryDisplay.textClass} mr-3`}>
                              <FontAwesomeIcon icon={categoryDisplay.icon as IconProp} />
                            </div>
                            <div className="w-full">
                              <input
                                type="text"
                                value={editData.merchant || ''}
                                onChange={(e) => setEditData({...editData, merchant: e.target.value})}
                                placeholder="Merchant/Description"
                                className="bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white edit-input w-full"
                              />
                              <textarea
                                value={editData.note || ''}
                                onChange={(e) => setEditData({...editData, note: e.target.value})}
                                placeholder="Note"
                                className="bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white edit-input w-full mt-1 text-xs"
                                rows={1}
                              />
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <select
                              value={editData.category || ''}
                              onChange={(e) => setEditData({...editData, category: e.target.value})}
                              className="bg-gray-50 edit-input dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                            >
                              <option value="">Select Category</option>
                              <option value="Food & Dining">Food & Dining</option>
                              <option value="Transport">Transport</option>
                              <option value="Bills">Bills</option>
                              <option value="Shopping">Shopping</option>
                              <option value="Entertainment">Entertainment</option>
                              <option value="School Fees">School Fees</option>
                              <option value="Church/Mosque">Church/Mosque</option>
                              <option value="Family Support">Family Support</option>
                              <option value="Health/Medical">Health/Medical</option>
                              <option value="Rent/Housing">Rent/Housing</option>
                              <option value="Salary">Salary</option>
                              <option value="Freelance Work">Freelance Work</option>
                              <option value="Other Expenses">Other</option>
                            </select>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <input
                              type="date"
                              value={editData.date || ''}
                              onChange={(e) => setEditData({...editData, date: e.target.value})}
                              className="edit-input dark:border-gray-700 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full"
                            />
                          </div>
                          <div className="col-span-2 flex items-center">
                            <input
                              type="number"
                              value={editData.amount || ''}
                              onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})}
                              placeholder="Amount"
                              className="edit-input text-right dark:border-gray-700 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white w-full"
                            />
                          </div>
                          <div className="col-span-2 flex items-center justify-end space-x-2">
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-600 dark:hover:text-white rounded-full"
                            >
                              <FontAwesomeIcon icon={'check'} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-gray-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-gray-700 rounded-full"
                            >
                              <FontAwesomeIcon icon={'times'} />
                            </button>
                          </div>
                        </>
                      ) : (
                        /* View Mode */
                        <>
                          <div className="col-span-4 flex items-center">
                            <div className={`category-icon ${categoryDisplay.bgClass} ${categoryDisplay.textClass} mr-3`}>
                              <FontAwesomeIcon icon={categoryDisplay.icon as IconProp} />
                            </div>
                            <div>
                              <div className="font-medium flex items-center text-gray-700 dark:text-gray-300">
                                {transaction.merchant || transaction.effectiveCategory}
                                {transaction.status === 'flagged' && (
                                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded flex items-center">
                                    <FontAwesomeIcon icon={'flag'} className="mr-1" /> Review
                                  </span>
                                )}
                                {transaction.recurring && (
                                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded flex items-center">
                                    <FontAwesomeIcon icon={'sync-alt'} className="mr-1" /> Recurring
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {transaction.note || 'No description'}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <span className={`${
                              transaction.type === 'income' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            } text-xs px-2 py-1 rounded`}>
                              {transaction.effectiveCategory}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString('en-NG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="col-span-2 flex items-center justify-end">
                            <span className={`font-medium ${
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{transaction.formattedAmount}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center justify-end">
                            <div className="dropdown relative">
                              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500">
                                <FontAwesomeIcon 
                                  icon={'ellipsis-v'} 
                                  className="text-gray-400 dark:hover:text-white" 
                                />
                              </button>
                              <div className="z-100 dropdown-content mt-1 py-1 card-shadow dark:bg-gray-700 hidden group-hover:block">
                                <button
                                  onClick={() => handleEdit(transaction)}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                  <FontAwesomeIcon icon={'edit'} className="mr-2" /> Edit
                                </button>
                                <button
                                  onClick={() => handleFlag(transaction._id, transaction.status)}
                                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                  <FontAwesomeIcon icon={'flag'} className="mr-2" /> 
                                  {transaction.status === 'flagged' ? 'Unflag' : 'Flag'}
                                </button>
                                <button
                                  onClick={() => handleDelete(transaction._id)}
                                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                  <FontAwesomeIcon icon={'trash'} className="mr-2" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalCount)} of{' '}
                  {pagination.totalCount} transactions
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                    if (pageNum <= pagination.totalPages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            pageNum === pagination.currentPage
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-800'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default TransactionHistoryPage