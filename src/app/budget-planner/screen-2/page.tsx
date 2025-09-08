// src/app/budget-planner/screen-2/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainNavigation from '@/app/components/MainNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import '../../../lib/fontawesome'

interface BudgetData {
  budget: {
    month: string;
    totalBudget: number;
    formattedTotalBudget: string;
  } | null;
  categoryBudgets: Array<{
    _id: string;
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    status: 'good' | 'warning' | 'exceeded';
    formattedAllocated: string;
    formattedSpent: string;
    formattedRemaining: string;
    transactionCount: number;
  }>;
  summary: {
    month: string;
    totalAllocated: number;
    totalSpent: number;
    totalRemaining: number;
    budgetUtilization: number;
    formattedTotalAllocated: string;
    formattedTotalSpent: string;
    formattedTotalRemaining: string;
  };
  insights: Array<{
    type: 'warning' | 'suggestion' | 'alert';
    message: string;
    action: string;
    category?: string;
  }>;
}

const CATEGORY_ICONS = {
  'Groceries': 'shopping-basket',
  'Food & Dining': 'utensils',
  'Transport': 'car',
  'Entertainment': 'film',
  'Fitness': 'dumbbell',
  'Health & Fitness': 'heartbeat',
  'Rent': 'home',
  'Rent/Housing': 'home',
  'Bills': 'bolt',
  'Family Support': 'heart',
  'Emergency Fund': 'shield-alt',
} as const;

const CATEGORY_COLORS = {
  'Groceries': { bg: 'bg-green-100', text: 'text-green-600' },
  'Food & Dining': { bg: 'bg-green-100', text: 'text-green-600' },
  'Transport': { bg: 'bg-blue-100', text: 'text-blue-600' },
  'Entertainment': { bg: 'bg-pink-100', text: 'text-pink-600' },
  'Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
  'Health & Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
  'Rent': { bg: 'bg-purple-100', text: 'text-purple-600' },
  'Rent/Housing': { bg: 'bg-purple-100', text: 'text-purple-600' },
  'Bills': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  'Family Support': { bg: 'bg-red-100', text: 'text-red-600' },
  'Emergency Fund': { bg: 'bg-gray-100', text: 'text-gray-600' },
} as const;

const CategoryBudgetsPage = () => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    fetchBudgetData();
  }, [currentMonth]);

  const fetchBudgetData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch budget data');
      }

      const result = await response.json();
      setBudgetData(result);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load budget data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (category: string, newAmount: number) => {
    if (!budgetData?.categoryBudgets) return;

    try {
      const updatedCategories = budgetData.categoryBudgets.map(cat => 
        cat.category === category ? { ...cat, allocated: newAmount } : cat
      );

      const response = await fetch(`/api/budgets/${currentMonth}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: updatedCategories.map(cat => ({
            category: cat.category,
            allocated: cat.allocated
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update budget');
      }

      toast.success(`${category} budget updated successfully`);
      await fetchBudgetData();
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update budget');
    }
  };

  const handleTransferBudget = async (fromCategory: string, toCategory: string, amount: number) => {
    try {
      const response = await fetch('/api/budgets/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          fromCategory,
          toCategory,
          amount,
          reason: 'Budget reallocation via Category Budgets screen'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transfer budget');
      }

      const result = await response.json();
      toast.success(result.message);
      await fetchBudgetData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to transfer budget');
    }
  };

  const startEdit = (category: string, currentAmount: number) => {
    setEditingCategory(category);
    setEditValue(currentAmount.toString());
  };

  const saveEdit = (category: string) => {
    const newAmount = parseInt(editValue.replace(/,/g, ''));
    if (isNaN(newAmount) || newAmount < 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    handleUpdateBudget(category, newAmount);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const current = new Date(currentMonth + '-01');
    if (direction === 'prev') {
      current.setMonth(current.getMonth() - 1);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
    setCurrentMonth(current.toISOString().slice(0, 7));
  };

  const formatMonthName = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Category Budgets</h2>
              <p className="text-slate-500 dark:text-slate-400">Loading budget data...</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !budgetData?.budget) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error || 'No budget found for this month'}</p>
                  <div className="mt-2 space-x-2">
                    <button 
                      onClick={fetchBudgetData}
                      className="text-xs font-medium text-red-600 hover:text-red-500"
                    >
                      Try again
                    </button>
                    <button 
                      onClick={() => window.location.href = '/budget-planner/screen-3'}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Create Budget
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { budget, categoryBudgets, summary, insights } = budgetData;

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation */}
          <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
            <Link
              href="/budget-planner/screen-1"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
            >Monthly Overview</Link>
            <Link
              href="/budget-planner/screen-2"
              className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
            >Category Budgets</Link>
            <Link
              href="/budget-planner/screen-3"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
            >Smart Budget Assistant (AI)</Link>
            <Link
              href="/budget-planner/screen-4"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
            >Budget Alerts & Reminders</Link>
            <Link
              href="/budget-planner/screen-5"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
            >Budget Calendar</Link>
          </nav>

          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Category Budgets</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Set and manage spending limits per category
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
              >
                <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
              </button>
            </div>
          </div>

          {/* Current Month Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                {formatMonthName(currentMonth)} Budgets
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Viewing budgets for selected month
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => changeMonth('prev')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={'chevron-left'} className='text-slate-500' />
              </button>
              <button className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium">
                <FontAwesomeIcon icon={'calendar-alt'} className='mr-2' /> Change Month
              </button>
              <button 
                onClick={() => changeMonth('next')}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={'chevron-right'} className='text-slate-500' />
              </button>
            </div>
          </div>

          {/* AI Insight Panel */}
          {insights.length > 0 && (
            <div className="ai-insight text-white rounded-xl p-4 mb-6 flex items-start">
              <div
                className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <FontAwesomeIcon icon={'lightbulb'} />
              </div>
              <div className="flex-1">
                <p className="font-medium">AI Budget Insight</p>
                <p className="text-sm opacity-90 mb-2">{insights[0].message}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <button
                    onClick={() => toast.info('Budget adjustments can be made by editing category amounts below')}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <FontAwesomeIcon icon={'adjust'} className='mr-1' /> Adjust Budget
                  </button>
                  {insights[0].category && (
                    <button
                      onClick={() => {
                        const categoryData = categoryBudgets.find(c => c.category === insights[0].category);
                        if (categoryData && categoryData.remaining > 0) {
                          const needsMore = categoryBudgets.find(c => c.status === 'exceeded');
                          if (needsMore) {
                            const transferAmount = Math.min(categoryData.remaining, Math.abs(needsMore.remaining));
                            handleTransferBudget(insights[0].category!, needsMore.category, transferAmount);
                          }
                        }
                      }}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                    >
                      <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Auto Transfer
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = '/budget-planner/screen-1'}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  >
                    <FontAwesomeIcon icon={'chart-line'} className='mr-1' /> View Trends
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Category Budget List */}
          <div className="space-y-4 mb-8">
            {categoryBudgets.map((categoryBudget, index) => {
              const icon = CATEGORY_ICONS[categoryBudget.category] || 'folder';
              const colors = CATEGORY_COLORS[categoryBudget.category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
              const isEditing = editingCategory === categoryBudget.category;

              return (
                <div key={index} className="category-item bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start">
                      <div className={`${colors.bg} ${colors.text} p-2 rounded-lg mr-3`}>
                        <FontAwesomeIcon icon={icon} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                          {categoryBudget.category}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {categoryBudget.transactionCount} transactions this month
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="relative">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-200">₦ </span>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(categoryBudget.category);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(categoryBudget.category)}
                              className="text-green-600 hover:text-green-500"
                            >
                              <FontAwesomeIcon icon={'check'} className='text-xs' />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-500"
                            >
                              <FontAwesomeIcon icon={'times'} className='text-xs' />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium">
                              {categoryBudget.allocated.toLocaleString()}
                            </span>
                            <button
                              onClick={() => startEdit(categoryBudget.category, categoryBudget.allocated)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 hover:text-slate-600"
                            >
                              <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                        Spent: {categoryBudget.formattedSpent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500 dark:text-slate-400">
                      {categoryBudget.percentageUsed}% of budget used
                    </span>
                    <span className={`font-medium ${
                      categoryBudget.remaining >= 0 
                        ? 'text-slate-600 dark:text-slate-300' 
                        : 'text-red-600'
                    }`}>
                      {categoryBudget.formattedRemaining} {categoryBudget.remaining >= 0 ? 'remaining' : 'over budget'}
                    </span>
                  </div>
                  <div className="budget-meter">
                    <div
                      className={`budget-meter-fill ${
                        categoryBudget.status === 'exceeded' ? 'bg-red-500' :
                        categoryBudget.status === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(categoryBudget.percentageUsed, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs">
                    <button
                      onClick={() => window.location.href = `/transactionHistory?category=${encodeURIComponent(categoryBudget.category)}`}
                      className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                    >
                      <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
                    </button>
                    <button
                      onClick={() => toast.info('Budget alerts can be configured in the Alerts & Reminders section')}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
                    </button>
                    <button
                      onClick={() => {
                        if (categoryBudget.remaining > 0) {
                          const needsMore = categoryBudgets.find(c => c.status === 'exceeded' && c.category !== categoryBudget.category);
                          if (needsMore) {
                            const transferAmount = Math.min(categoryBudget.remaining / 2, Math.abs(needsMore.remaining));
                            if (transferAmount > 0) {
                              handleTransferBudget(categoryBudget.category, needsMore.category, transferAmount);
                            }
                          } else {
                            toast.info('No categories currently need additional budget');
                          }
                        } else {
                          toast.info('No budget available to transfer from this category');
                        }
                      }}
                      className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                    >
                      <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Category */}
          <div
            className="bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-indigo-300 dark:hover:border-primary dark:border-gray-500 dark:bg-gray-800 transition mb-8"
            onClick={() => window.location.href = '/budget-planner/screen-3'}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-indigo-600 dark:bg-opacity-80 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={'plus'} />
              </div>
              <p className="text-sm font-medium text-indigo-600">
                Add New Budget Category
              </p>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-slate-700 dark:text-slate-300 font-semibold mb-4">Budget Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Total Budget</p>
                <h4 className="text-xl font-bold text-slate-600 dark:text-slate-200">
                  {summary.formattedTotalAllocated}
                </h4>
              </div>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Total Spent</p>
                <h4 className="text-xl font-bold text-slate-600 dark:text-slate-200">
                  {summary.formattedTotalSpent}
                </h4>
              </div>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Remaining</p>
                <h4 className={`text-xl font-bold ${
                  summary.totalRemaining >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                }`}>
                  {summary.formattedTotalRemaining}
                </h4>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Budget Utilization</span>
                <span className="text-slate-600 dark:text-slate-300">{summary.budgetUtilization}%</span>
              </div>
              <div className="budget-meter">
                <div
                  className={`budget-meter-fill ${
                    summary.budgetUtilization > 100 ? 'bg-red-500' :
                    summary.budgetUtilization > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(summary.budgetUtilization, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default CategoryBudgetsPage;