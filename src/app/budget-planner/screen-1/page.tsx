// src/app/budget-planner/screen-1/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainNavigation from "@/app/components/MainNavigation"
import ProgressRing from "@/app/components/ProgressRing"
import SpendingChart from "@/app/components/SpendingChart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
import '../../../lib/fontawesome'

interface BudgetData {
  budget: {
    month: string;
    totalBudget: number;
    formattedTotalBudget: string;
  } | null;
  categoryBudgets: Array<{
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    status: 'good' | 'warning' | 'exceeded';
    formattedAllocated: string;
    formattedSpent: string;
    formattedRemaining: string;
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
  }>;
  nigerianContext: {
    salaryExpected: boolean;
    schoolFeesSeason: boolean;
    festiveSeason: boolean;
    midMonthCashFlow: boolean;
  };
}

const CATEGORY_ICONS = {
  'Groceries': 'shopping-basket',
  'Food & Dining': 'utensils',
  'Transport': 'car',
  'Entertainment': 'gamepad',
  'Health & Fitness': 'heartbeat',
  'Fitness': 'dumbbell',
  'Rent/Housing': 'home',
  'Bills': 'bolt',
  'Family Support': 'heart',
  'Emergency Fund': 'shield-alt',
  'Shopping': 'shopping-bag',
  'Personal Care': 'user',
} as const;

const CATEGORY_COLORS = {
  'Groceries': { bg: 'bg-green-100', text: 'text-green-600' },
  'Food & Dining': { bg: 'bg-green-100', text: 'text-green-600' },
  'Transport': { bg: 'bg-purple-100', text: 'text-purple-600' },
  'Entertainment': { bg: 'bg-pink-100', text: 'text-pink-600' },
  'Health & Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
  'Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
  'Rent/Housing': { bg: 'bg-blue-100', text: 'text-blue-600' },
  'Bills': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  'Family Support': { bg: 'bg-red-100', text: 'text-red-600' },
  'Emergency Fund': { bg: 'bg-gray-100', text: 'text-gray-600' },
  'Shopping': { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  'Personal Care': { bg: 'bg-purple-100', text: 'text-purple-600' },
} as const;

const BudgetPlannerScreen1 = () => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchBudgetData();
  }, []);

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

  const handleCreateBudget = async () => {
    try {
      // Navigate to AI assistant for budget creation
      window.location.href = '/budget-planner/screen-3';
    } catch (err: any) {
      toast.error('Failed to navigate to budget creation');
    }
  };

  const handleAISuggestBudget = async () => {
    try {
      const response = await fetch('/api/budgets/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMonth,
          goalType: 'optimize',
          prompt: 'Generate an optimized budget based on my spending patterns'
        })
      });

      if (!response.ok) throw new Error('Failed to get AI suggestions');

      // Navigate to AI assistant with generated data
      window.location.href = '/budget-planner/screen-3';
      toast.success('AI budget suggestions generated!');
    } catch (err: any) {
      toast.error('Failed to generate AI suggestions');
      // Still navigate to allow manual creation
      window.location.href = '/budget-planner/screen-3';
    }
  };

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Budget Planner</h2>
              <p className="text-slate-500 dark:text-slate-400">Loading your budget data...</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
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
                  <p className="text-sm text-red-700">{error}</p>
                  <button 
                    onClick={fetchBudgetData}
                    className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!budgetData?.budget) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                <FontAwesomeIcon icon={'plus-circle'} className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No Budget Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first budget to start tracking your expenses
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCreateBudget}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center"
                >
                  <FontAwesomeIcon icon={'plus'} className="mr-2" /> Create Budget
                </button>
                <button
                  onClick={handleAISuggestBudget}
                  className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition flex items-center"
                >
                  <FontAwesomeIcon icon={'robot'} className="mr-2" /> AI Suggest Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { budget, categoryBudgets, summary, insights, nigerianContext } = budgetData;
  const budgetUtilizationPercentage = Math.round(summary.budgetUtilization);
  const dailyAverage = summary.totalSpent / new Date().getDate();

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation */}
          <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
            <Link
              href="/budget-planner/screen-1"
              className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
            >Monthly Overview</Link>
            <Link
              href="/budget-planner/screen-2"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Budget Planner
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Plan and track your monthly budgets
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCreateBudget}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center"
              >
                <FontAwesomeIcon icon={'plus'} className="mr-2" /> Create Category Budget
              </button>
              <button
                onClick={handleAISuggestBudget}
                className="px-4 py-2 bg-white dark:bg-slate-100 dark:hover:bg-slate-200 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
              >
                <FontAwesomeIcon icon={'robot'} className="mr-2" /> AI Suggest Budget Plan
              </button>
            </div>
          </div>

          {/* AI Alert */}
          {insights.length > 0 && (
            <div className="ai-alert text-white rounded-xl p-4 mb-6 flex items-start">
              <div
                className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              >
                <FontAwesomeIcon 
                  icon={insights[0].type === 'warning' ? 'exclamation-circle' : 'lightbulb'} 
                />
              </div>
              <div>
                <p className="font-medium">
                  {insights[0].type === 'warning' ? 'Budget Alert' : 'Budget Insight'}
                </p>
                <p className="text-sm opacity-90">{insights[0].message}</p>
              </div>
            </div>
          )}

          {/* Budget Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Budget */}
            <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Total Monthly Budget
                  </p>
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {budget.formattedTotalBudget}
                  </h3>
                </div>
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  <FontAwesomeIcon icon={'wallet'} />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span className="text-slate-500 dark:text-slate-300">Remaining</span>
                <span className="text-slate-600 dark:text-slate-200">
                  {summary.formattedTotalRemaining}
                </span>
              </div>
              <div className="budget-meter mt-2">
                <div
                  className="budget-meter-fill bg-indigo-600"
                  style={{ width: `${Math.min(budgetUtilizationPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Spent So Far */}
            <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Spent So Far
                  </p>
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                    {summary.formattedTotalSpent}
                  </h3>
                </div>
                <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                  <FontAwesomeIcon icon={'shopping-bag'} />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span className="text-slate-500 dark:text-slate-300">Daily Average</span>
                <span className="text-slate-600 dark:text-slate-200">
                  ₦{Math.round(dailyAverage).toLocaleString()}
                </span>
              </div>
              <div className="budget-meter mt-2">
                <div
                  className="budget-meter-fill bg-red-500"
                  style={{ width: `${Math.min(budgetUtilizationPercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Budget Progress Ring */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
              <ProgressRing percentage={budgetUtilizationPercentage} />
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Monthly Budget Used
              </p>
            </div>
          </div>

          {/* Budget Categories */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Budget Categories
              </h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-200 dark:text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-100 transition">
                  <FontAwesomeIcon icon={'filter'} className="mr-1" /> Filter
                </button>
                <button className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-200 dark:text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-100 transition">
                  <FontAwesomeIcon icon={'sort'} className="mr-1" /> Sort
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBudgets.map((category, index) => {
                const icon = CATEGORY_ICONS[category.category] || 'folder';
                const colors = CATEGORY_COLORS[category.category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                
                return (
                  <div
                    key={index}
                    className="category-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition cursor-pointer"
                    onClick={() => window.location.href = '/budget-planner/screen-2'}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-slate-600 dark:text-slate-200">
                          {category.category}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {category.formattedSpent} spent
                        </p>
                      </div>
                      <div className={`${colors.bg} ${colors.text} p-2 rounded-lg`}>
                        <FontAwesomeIcon icon={icon} />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-500 dark:text-slate-300">
                        Budget: {category.formattedAllocated}
                      </span>
                      <span className="font-medium text-slate-400 dark:text-slate-200">
                        {category.formattedRemaining} left
                      </span>
                    </div>
                    <div className="budget-meter">
                      <div
                        className={`budget-meter-fill ${
                          category.status === 'exceeded' ? 'bg-red-500' :
                          category.status === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(category.percentageUsed, 100)}%` }}
                      ></div>
                    </div>
                    {category.status === 'exceeded' && (
                      <div className="mt-2 text-xs text-red-500 flex items-center">
                        <FontAwesomeIcon icon={'exclamation-triangle'} className="mr-1" />
                        Exceeded by {category.formattedSpent}
                      </div>
                    )}
                    {category.status === 'warning' && category.percentageUsed > 80 && (
                      <div className="mt-2 text-xs text-yellow-500 flex items-center">
                        <FontAwesomeIcon icon={'info-circle'} className="mr-1" />
                        Close to limit
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add New Category */}
              <div
                className="category-card bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 dark:hover:border-primary dark:border-gray-500 dark:bg-gray-800 transition"
                onClick={handleCreateBudget}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 dark:bg-opacity-80 dark:bg-gray-50 flex items-center justify-center mb-2">
                  <FontAwesomeIcon icon={'plus'} />
                </div>
                <p className="text-sm font-medium text-indigo-600">Add New Category</p>
              </div>
            </div>
          </div>

          {/* Spending Chart */}
          <div className="bg-white dark:bg-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Spending Trends</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition dark:bg-white dark:hover:bg-slate-300">
                  This Month
                </button>
                <button className="px-3 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-200 dark:hover:bg-indigo-300 rounded-lg text-xs font-medium hover:bg-indigo-200 transition">
                  Last 6 Months
                </button>
              </div>
            </div>
            <SpendingChart />
          </div>

          {/* AI Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                <FontAwesomeIcon icon={'robot'} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300">
                AI Budget Recommendations
              </h3>
            </div>

            <div className="space-y-4">
              {insights.length > 0 ? insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3 mt-1">
                    <FontAwesomeIcon icon={'lightbulb'} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {insight.type === 'warning' ? 'Budget Alert' : 'Optimization Tip'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {insight.message}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3 mt-1">
                    <FontAwesomeIcon icon={'lightbulb'} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">Great Job!</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Your budget is well-balanced. Keep tracking your expenses to maintain good financial health.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAISuggestBudget}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center mx-auto"
            >
              <FontAwesomeIcon icon={'magic'} className="mr-2" /> Optimize My Budget Automatically
            </button>
          </div>
        </div>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default BudgetPlannerScreen1;