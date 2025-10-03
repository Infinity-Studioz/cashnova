// src/app/transactionHistory/page.tsx

'use client'
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import MainNavigation from '../components/MainNavigation';
import AuthButtons from '../components/AuthButtons';
import '../../lib/fontawesome';

function TransactionHistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  
  // State management
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced filter states with URL persistence
  const [filters, setFilters] = useState({
    dateRange: searchParams.get('dateRange') || '30days',
    category: searchParams.get('category') || 'allCats',
    amountRange: searchParams.get('amountRange') || 'anyAmt',
    status: searchParams.get('status') || 'allTrans',
    type: searchParams.get('type') || '',
    sortBy: searchParams.get('sortBy') || 'date',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10')
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
    transactionCount: 0,
    avgTransactionAmount: 0,
    formattedAvgAmount: '₦0'
  });

  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [spendingPatterns, setSpendingPatterns] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [aiInsightsVisible, setAiInsightsVisible] = useState(false);

  // Update URL when filters change
  const updateURL = useCallback((newFilters: any) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'allCats' && value !== 'allTrans' && value !== 'anyAmt' && value !== '' && value !== 1 && value !== 10) {
        params.set(key, value.toString());
      }
    });
    const newURL = params.toString() ? `?${params.toString()}` : '/transactionHistory';
    window.history.replaceState({}, '', newURL);
  }, []);

  // Fetch transactions with current filters
  const fetchTransactions = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/transactions?${queryParams}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transactions');
      }

      const data = await response.json();
      
      setTransactions(data.transactions || []);
      setPagination(data.pagination || pagination);
      setSummary(data.summary || summary);
      setCategoryBreakdown(data.categoryBreakdown || []);
      setSpendingPatterns(data.spendingPatterns || null);
      
      // Update URL with current filters
      updateURL(filters);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters, searchQuery, updateURL]);

  // Load transactions on component mount and filter changes
  useEffect(() => {
    if (session) {
      fetchTransactions();
    }
  }, [session, fetchTransactions]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions(false);
  };

  // Handle export (placeholder)
  const handleExport = () => {
    toast.info('Export functionality will be available soon');
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
  const handleEdit = (transaction: any) => {
    setEditingId(transaction._id);
    setEditData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.effectiveCategory,
      note: transaction.note || '',
      merchant: transaction.merchant || '',
      date: transaction.date.split('T')[0],
      paymentMethod: transaction.paymentMethod || 'cash'
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

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Helper function to get category icon and color
  const getCategoryDisplay = (category: string, type: string) => {
    const iconMap = {
      'Food & Dining': { icon: 'utensils', bgClass: 'bg-orange-100 dark:bg-orange-900/20', textClass: 'text-orange-600 dark:text-orange-400' },
      'Transport': { icon: 'car', bgClass: 'bg-blue-100 dark:bg-blue-900/20', textClass: 'text-blue-600 dark:text-blue-400' },
      'Bills': { icon: 'bolt', bgClass: 'bg-yellow-100 dark:bg-yellow-900/20', textClass: 'text-yellow-600 dark:text-yellow-400' },
      'Shopping': { icon: 'shopping-bag', bgClass: 'bg-purple-100 dark:bg-purple-900/20', textClass: 'text-purple-600 dark:text-purple-400' },
      'Entertainment': { icon: 'gamepad', bgClass: 'bg-pink-100 dark:bg-pink-900/20', textClass: 'text-pink-600 dark:text-pink-400' },
      'School Fees': { icon: 'graduation-cap', bgClass: 'bg-indigo-100 dark:bg-indigo-900/20', textClass: 'text-indigo-600 dark:text-indigo-400' },
      'Church/Mosque': { icon: 'praying-hands', bgClass: 'bg-green-100 dark:bg-green-900/20', textClass: 'text-green-600 dark:text-green-400' },
      'Family Support': { icon: 'heart', bgClass: 'bg-red-100 dark:bg-red-900/20', textClass: 'text-red-600 dark:text-red-400' },
      'Health/Medical': { icon: 'medkit', bgClass: 'bg-teal-100 dark:bg-teal-900/20', textClass: 'text-teal-600 dark:text-teal-400' },
      'Rent/Housing': { icon: 'home', bgClass: 'bg-gray-100 dark:bg-gray-900/20', textClass: 'text-gray-600 dark:text-gray-400' },
      'Salary': { icon: 'money-bill-wave', bgClass: 'bg-green-100 dark:bg-green-900/20', textClass: 'text-green-600 dark:text-green-400' },
      'Freelance Work': { icon: 'laptop-code', bgClass: 'bg-blue-100 dark:bg-blue-900/20', textClass: 'text-blue-600 dark:text-blue-400' },
    };

    const defaultDisplay = type === 'income' 
      ? { icon: 'money-bill-wave', bgClass: 'bg-green-100 dark:bg-green-900/20', textClass: 'text-green-600 dark:text-green-400' }
      : { icon: 'receipt', bgClass: 'bg-gray-100 dark:bg-gray-900/20', textClass: 'text-gray-600 dark:text-gray-400' };

    return iconMap[category as keyof typeof iconMap] || defaultDisplay;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please sign in to access your transaction history</p>
          <AuthButtons />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainNavigation />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Transaction History
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Review and manage your financial activities with Nigerian AI insights
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setAiInsightsVisible(!aiInsightsVisible)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FontAwesomeIcon icon="brain" className="mr-2" /> 
              {aiInsightsVisible ? 'Hide' : 'Show'} AI Insights
            </button>
            <button
              onClick={() => router.push('/addTransaction')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FontAwesomeIcon icon="plus" className="mr-2" /> Add Transaction
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon="arrow-up" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {summary.formattedTotalIncome}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon="arrow-down" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {summary.formattedTotalExpenses}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className={`${summary.netAmount >= 0 ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'} p-2 rounded-lg mr-3`}>
                  <FontAwesomeIcon icon="balance-scale" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Net Amount</p>
                  <p className={`text-lg font-semibold ${summary.netAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {summary.formattedNetAmount}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg mr-3">
                  <FontAwesomeIcon icon="calculator" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg Transaction</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {summary.formattedAvgAmount}
                  </p>
                  <p className="text-xs text-gray-400">{summary.transactionCount} transactions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Panel */}
        {aiInsightsVisible && spendingPatterns && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-4">
              <FontAwesomeIcon icon="brain" className="mr-2" />
              AI Financial Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Spending Patterns</h4>
                <div className="space-y-2">
                  {spendingPatterns.insights?.slice(0, 3).map((insight: any, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <FontAwesomeIcon icon="lightbulb" className="text-yellow-500 mt-0.5 text-xs" />
                      <span className="text-sm text-purple-700 dark:text-purple-300">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Nigerian Context</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <FontAwesomeIcon icon="flag" className="text-green-500 mt-0.5 text-xs" />
                    <span className="text-sm text-purple-700 dark:text-purple-300">
                      Analyzing transactions with Nigerian financial patterns
                    </span>
                  </div>
                  {categoryBreakdown.slice(0, 2).map((cat, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <FontAwesomeIcon icon="chart-pie" className="text-blue-500 mt-0.5 text-xs" />
                      <span className="text-sm text-purple-700 dark:text-purple-300">
                        {cat.category}: {cat.formattedAmount} ({cat.percentage}% of spending)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <FontAwesomeIcon 
                icon="search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
              />
              <input
                type="text"
                placeholder="Search transactions by merchant, category, or notes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                Date Range
              </label>
              <select
                id="dateRange"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="currentMonth">Current month</option>
                <option value="lastMonth">Last month</option>
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
              <label htmlFor="amountRange" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                Amount Range
              </label>
              <select
                id="amountRange"
                value={filters.amountRange}
                onChange={(e) => handleFilterChange('amountRange', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="anyAmt">Any Amount</option>
                <option value="u-5k">Under ₦5,000</option>
                <option value="5k-25k">₦5,000 - ₦25,000</option>
                <option value="25k-100k">₦25,000 - ₦100,000</option>
                <option value="o-100k">Over ₦100,000</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                Type
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="allTrans">All Transactions</option>
                <option value="review">Flagged for Review</option>
                <option value="recurring">Recurring</option>
                <option value="oneTime">One-time</option>
              </select>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 disabled:opacity-50 transition-colors"
              >
                <FontAwesomeIcon 
                  icon="sync-alt" 
                  className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} 
                /> 
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button 
                onClick={handleExport}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon="download" className="mr-1" /> Export
              </button>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-500 dark:text-gray-400">Sort by:</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="category">Category</option>
                  <option value="merchant">Merchant</option>
                </select>
                <button
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  <FontAwesomeIcon icon={filters.sortOrder === 'desc' ? 'sort-amount-down' : 'sort-amount-up'} />
                </button>
              </div>
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
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon="exclamation-triangle" className="text-red-500 text-xl" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading transactions</h3>
                <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => fetchTransactions()}
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
                  >
                    Try again →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading your transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden p-8 text-center">
            <FontAwesomeIcon icon="receipt" className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? 
                `No transactions found matching "${searchQuery}". Try adjusting your search or filters.` :
                Object.values(filters).some(f => f !== 'allCats' && f !== 'allTrans' && f !== 'anyAmt' && f !== '30days' && f !== '' && f !== 1 && f !== 10 && f !== 'date' && f !== 'desc') 
                  ? 'No transactions match your current filters. Try adjusting your criteria.'
                  : 'Start by adding your first transaction to see your financial activity here.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/addTransaction')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon="plus" className="mr-2" /> Add Your First Transaction
              </button>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters(prev => ({ ...prev, page: 1 }));
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon="times" className="mr-2" /> Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Transactions List */
          <>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600 font-medium text-gray-500 dark:text-gray-400 text-sm">
                <div className="col-span-4">Transaction</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Transaction Items */}
              {transactions.map((transaction) => {
                const isEditing = editingId === transaction._id;
                const categoryDisplay = getCategoryDisplay(transaction.effectiveCategory, transaction.type);

                return (
                  <div
                    key={transaction._id}
                    className="border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {isEditing ? (
                      /* Edit Mode */
                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-4">
                          <input
                            type="text"
                            value={editData.merchant || ''}
                            onChange={(e) => setEditData({...editData, merchant: e.target.value})}
                            placeholder="Merchant/Description"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 text-sm mb-2"
                          />
                          <textarea
                            value={editData.note || ''}
                            onChange={(e) => setEditData({...editData, note: e.target.value})}
                            placeholder="Note"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 text-sm"
                            rows={2}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <select
                            value={editData.category || ''}
                            onChange={(e) => setEditData({...editData, category: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 text-sm"
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
                        <div className="md:col-span-2">
                          <input
                            type="date"
                            value={editData.date || ''}
                            onChange={(e) => setEditData({...editData, date: e.target.value})}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <input
                            type="number"
                            value={editData.amount || ''}
                            onChange={(e) => setEditData({...editData, amount: parseFloat(e.target.value)})}
                            placeholder="Amount"
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-3 py-2 text-sm"
                          />
                        </div>
                        <div className="md:col-span-2 flex items-center justify-end space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-colors"
                          >
                            <FontAwesomeIcon icon="check" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
                          >
                            <FontAwesomeIcon icon="times" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Mobile Layout */}
                        <div className="md:hidden space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${categoryDisplay.bgClass}`}>
                                <FontAwesomeIcon icon={categoryDisplay.icon as any} className={`${categoryDisplay.textClass} text-sm`} />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {transaction.merchant || transaction.effectiveCategory}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(transaction.date).toLocaleDateString('en-NG', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium ${
                                transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                              }`}>
                                {transaction.type === 'income' ? '+' : '-'}{transaction.formattedAmount}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {transaction.paymentMethod || 'Cash'}
                              </div>
                            </div>
                          </div>
                          {transaction.note && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 pl-11">
                              {transaction.note}
                            </div>
                          )}
                          <div className="flex items-center justify-between pl-11">
                            <div className="flex items-center space-x-2">
                              {transaction.status === 'flagged' && (
                                <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-0.5 rounded flex items-center">
                                  <FontAwesomeIcon icon="flag" className="mr-1" /> Review
                                </span>
                              )}
                              {transaction.recurring && (
                                <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded flex items-center">
                                  <FontAwesomeIcon icon="sync-alt" className="mr-1" /> Recurring
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(transaction)}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              >
                                <FontAwesomeIcon icon="edit" />
                              </button>
                              <button
                                onClick={() => handleFlag(transaction._id, transaction.status)}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                              >
                                <FontAwesomeIcon icon="flag" />
                              </button>
                              <button
                                onClick={() => handleDelete(transaction._id)}
                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              >
                                <FontAwesomeIcon icon="trash" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout */}
                        <div className="hidden md:contents">
                          <div className="col-span-4 flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${categoryDisplay.bgClass}`}>
                              <FontAwesomeIcon icon={categoryDisplay.icon as any} className={categoryDisplay.textClass} />
                            </div>
                            <div>
                              <div className="font-medium flex items-center text-gray-700 dark:text-gray-300">
                                {transaction.merchant || transaction.effectiveCategory}
                                {transaction.status === 'flagged' && (
                                  <span className="ml-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-0.5 rounded flex items-center">
                                    <FontAwesomeIcon icon="flag" className="mr-1" /> Review
                                  </span>
                                )}
                                {transaction.recurring && (
                                  <span className="ml-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded flex items-center">
                                    <FontAwesomeIcon icon="sync-alt" className="mr-1" /> Recurring
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {transaction.note || (transaction.paymentMethod ? `Paid via ${transaction.paymentMethod}` : 'No description')}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <span className={`text-xs px-2 py-1 rounded ${
                              transaction.type === 'income' 
                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                            }`}>
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
                              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{transaction.formattedAmount}
                            </span>
                          </div>
                          <div className="col-span-2 flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              <FontAwesomeIcon icon="edit" />
                            </button>
                            <button
                              onClick={() => handleFlag(transaction._id, transaction.status)}
                              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                            >
                              <FontAwesomeIcon icon="flag" />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction._id)}
                              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              <FontAwesomeIcon icon="trash" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalCount)} of{' '}
                  {pagination.totalCount} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FontAwesomeIcon icon="chevron-left" className="mr-1" />
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
                          className={`px-3 py-2 border rounded-md text-sm font-medium transition-colors ${
                            pageNum === pagination.currentPage
                              ? 'border-indigo-500 bg-indigo-500 text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
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
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <FontAwesomeIcon icon="chevron-right" className="ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Category Breakdown Sidebar (shown when insights visible) */}
        {aiInsightsVisible && categoryBreakdown.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <FontAwesomeIcon icon="chart-pie" className="mr-2" />
              Category Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBreakdown.slice(0, 6).map((category, index) => {
                const categoryDisplay = getCategoryDisplay(category.category, 'expense');
                return (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-2 ${categoryDisplay.bgClass}`}>
                          <FontAwesomeIcon icon={categoryDisplay.icon as any} className={`${categoryDisplay.textClass} text-sm`} />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {category.category}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {category.percentage}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.formattedAmount}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {category.count} transactions • Avg: {category.formattedAvgAmount || '₦0'}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${categoryDisplay.textClass.includes('orange') ? 'bg-orange-500' : 
                            categoryDisplay.textClass.includes('blue') ? 'bg-blue-500' :
                            categoryDisplay.textClass.includes('yellow') ? 'bg-yellow-500' :
                            categoryDisplay.textClass.includes('purple') ? 'bg-purple-500' :
                            categoryDisplay.textClass.includes('pink') ? 'bg-pink-500' :
                            categoryDisplay.textClass.includes('indigo') ? 'bg-indigo-500' :
                            categoryDisplay.textClass.includes('green') ? 'bg-green-500' :
                            categoryDisplay.textClass.includes('red') ? 'bg-red-500' :
                            categoryDisplay.textClass.includes('teal') ? 'bg-teal-500' :
                            'bg-gray-500'}`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
      
      {/* Bottom padding for mobile navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
}

export default function TransactionHistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
        </div>
      </div>
    }>
      <TransactionHistoryContent />
    </Suspense>
  );
}