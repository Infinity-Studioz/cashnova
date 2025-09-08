'use client'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import FloatingAIAssistantIcon from "../components/FloatingAI";
import { toast } from 'sonner';

interface DashboardData {
  overview: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    formattedTotalBalance: string;
    formattedMonthlyIncome: string;
    formattedMonthlyExpenses: string;
    balanceChange: number;
    incomeChange: number;
    expenseChange: number;
  };
  spendingByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    formattedAmount: string;
    color: string;
    isOverBudget?: boolean;
    budgetAmount?: number;
    transactionCount: number;
  }>;
  weeklySpending: Array<{
    week: string;
    spending: number;
    budget: number;
    formattedSpending: string;
    formattedBudget: string;
  }>;
  aiInsights: Array<{
    type: 'warning' | 'suggestion' | 'achievement';
    message: string;
    action: string;
    priority: number;
    actionUrl?: string;
    actionData?: any;
  }>;
  notifications: {
    unreadCount: number;
    recent: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      priority: string;
      createdAt: string;
      actionUrl?: string;
    }>;
  };
  goals: Array<{
    id: string;
    name: string;
    current: number;
    target: number;
    deadline: string;
    progress: number;
    formattedCurrent: string;
    formattedTarget: string;
    category: string;
    isOnTrack: boolean;
  }>;
  nigerianContext: {
    currentMonth: string;
    salaryExpected: boolean;
    dayOfMonth: number;
    isSchoolFeeSeason: boolean;
    isFestiveSeason: boolean;
    economicInsights: string[];
    urgentActions: Array<{
      message: string;
      action: string;
      priority: 'high' | 'urgent';
    }>;
  };
  quickActions: Array<{
    title: string;
    description: string;
    icon: string;
    url: string;
    badge?: string;
  }>;
}

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh dashboard every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    if (dashboardData) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch dashboard data');
      }

      const result = await response.json();
      setDashboardData(result.data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load dashboard data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleInsightAction = (insight: any) => {
    if (insight.actionUrl) {
      window.location.href = insight.actionUrl;
    } else {
      // Fallback to old action handling
      switch (insight.action) {
        case 'view_budget':
          window.location.href = '/budget-planner/screen-1';
          break;
        case 'optimize_category':
          window.location.href = '/budget-planner/screen-2';
          break;
        case 'plan_budget':
          window.location.href = '/budget-planner/screen-3';
          break;
        case 'optimize_transport':
          toast.info('Consider using ride-sharing apps or public transport for better cost control');
          break;
        case 'create_emergency_fund':
          window.location.href = '/smartGoals';
          break;
        default:
          toast.info('Feature coming soon!');
      }
    }
  };

  const handleCategoryClick = (category: any) => {
    // Navigate to transaction history filtered by category
    const encodedCategory = encodeURIComponent(category.category);
    window.location.href = `/transactionHistory?category=${encodedCategory}`;
  };

  const handleQuickAction = (action: any) => {
    window.location.href = action.url;
  };

  const handleUrgentAction = (action: any) => {
    switch (action.action) {
      case 'view_school_fees_goal':
        window.location.href = '/smartGoals?category=school_fees';
        break;
      case 'create_festive_budget':
        window.location.href = '/budget-planner/screen-3';
        break;
      default:
        toast.info('Action coming soon!');
    }
  };

  if (loading) {
    return (
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Loading your financial overview...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Error loading dashboard data</p>
        </div>
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!dashboardData) {
    return (
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">No data available</p>
        </div>
      </main>
    );
  }

  const { overview, spendingByCategory, weeklySpending, aiInsights, goals, nigerianContext, quickActions, notifications } = dashboardData;

  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Header with refresh and context */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back! Here&apos;s your financial overview.
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FontAwesomeIcon 
                icon={'sync'} 
                className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>

          {/* Nigerian Context Alert Bar */}
          {nigerianContext.economicInsights.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={'info-circle'} className="text-blue-500" />
                <span className="text-sm text-blue-700">{nigerianContext.economicInsights[0]}</span>
              </div>
            </div>
          )}

          {/* Urgent Actions */}
          {nigerianContext.urgentActions.length > 0 && (
            <div className="mt-2 space-y-2">
              {nigerianContext.urgentActions.map((action, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    action.priority === 'urgent' ? 'bg-red-50 border border-red-200 hover:bg-red-100' : 
                    'bg-orange-50 border border-orange-200 hover:bg-orange-100'
                  }`}
                  onClick={() => handleUrgentAction(action)}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${
                      action.priority === 'urgent' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {action.message}
                    </span>
                    <FontAwesomeIcon 
                      icon={'chevron-right'} 
                      className={`text-xs ${
                        action.priority === 'urgent' ? 'text-red-500' : 'text-orange-500'
                      }`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Bar */}
        {quickActions && quickActions.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="relative p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:shadow-sm transition-all text-left"
                >
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon icon={action.icon} className="text-indigo-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  {action.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {action.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Balance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Balance */}
          <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm dark:text-gray-300">Total Balance</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                  {overview.formattedTotalBalance}
                </h3>
                <p className={`text-sm mt-2 ${overview.balanceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <FontAwesomeIcon 
                    icon={overview.balanceChange >= 0 ? 'arrow-up' : 'arrow-down'} 
                    className="mr-1" 
                  />
                  {Math.abs(overview.balanceChange)}% from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <FontAwesomeIcon icon={'wallet'} className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Income */}
          <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm dark:text-gray-300">Income</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                  {overview.formattedMonthlyIncome}
                </h3>
                <p className={`text-sm mt-2 ${overview.incomeChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <FontAwesomeIcon 
                    icon={overview.incomeChange >= 0 ? 'arrow-up' : 'arrow-down'} 
                    className="mr-1" 
                  />
                  {Math.abs(overview.incomeChange)}% from last month
                </p>
                {nigerianContext.salaryExpected && (
                  <p className="text-xs text-blue-600 mt-1">💰 Salary season!</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FontAwesomeIcon icon={'money-bill-wave'} className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm dark:text-gray-300">Expenses</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                  {overview.formattedMonthlyExpenses}
                </h3>
                <p className={`text-sm mt-2 ${overview.expenseChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <FontAwesomeIcon 
                    icon={overview.expenseChange >= 0 ? 'arrow-up' : 'arrow-down'} 
                    className="mr-1" 
                  />
                  {Math.abs(overview.expenseChange)}% from last month
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon icon={'shopping-bag'} className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Enhanced Spending by Category (Pie Chart) */}
          <div className="bg-white rounded-xl p-6 card-shadow lg:col-span-2 dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-300">Spending by Category</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="text-sm border rounded px-3 py-1 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-gray-900"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64">
                <PieChart data={spendingByCategory} loading={loading} />
              </div>
              <div className="space-y-2">
                {spendingByCategory.slice(0, 6).map((category, index) => (
                  <div 
                    key={index} 
                    onClick={() => handleCategoryClick(category)}
                    className="flex items-center justify-between text-sm p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="dark:text-gray-300">{category.category}</span>
                      {category.isOverBudget && (
                        <FontAwesomeIcon 
                          icon={'exclamation-triangle'} 
                          className="text-red-500 text-xs ml-2" 
                          title="Over budget"
                        />
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-medium dark:text-white">{category.formattedAmount}</span>
                      <span className="text-gray-500 ml-2">({category.percentage}%)</span>
                      <div className="text-xs text-gray-400">
                        {category.transactionCount} transactions
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => window.location.href = '/transactionHistory'}
                    className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    View all transactions →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced AI Insights Card */}
          <div className="bg-white rounded-xl p-6 card-shadow ai-card no-gradient dark:bg-gray-800">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faRobot} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-800 dark:text-white">AI Insights</h3>
              {notifications && notifications.unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.unreadCount}
                </span>
              )}
            </div>
            <div className="space-y-4">
              {aiInsights.length > 0 ? (
                aiInsights.map((insight, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      insight.type === 'warning' ? 'bg-red-50 border border-red-200 hover:bg-red-100' :
                      insight.type === 'achievement' ? 'bg-green-50 border border-green-200 hover:bg-green-100' :
                      'bg-indigo-50 border border-indigo-200 hover:bg-indigo-100'
                    }`}
                    onClick={() => handleInsightAction(insight)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <FontAwesomeIcon 
                            icon={
                              insight.type === 'warning' ? 'exclamation-triangle' :
                              insight.type === 'achievement' ? 'trophy' :
                              'lightbulb'
                            }
                            className={`mr-2 text-sm ${
                              insight.type === 'warning' ? 'text-red-600' :
                              insight.type === 'achievement' ? 'text-green-600' :
                              'text-indigo-600'
                            }`}
                          />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mb-2">
                          {insight.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${
                            insight.type === 'warning' ? 'text-red-600' :
                            insight.type === 'achievement' ? 'text-green-600' :
                            'text-indigo-600'
                          }`}>
                            Click to take action
                          </span>
                          <FontAwesomeIcon 
                            icon={'chevron-right'} 
                            className="text-xs text-gray-400" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-indigo-50 rounded-lg text-center">
                  <FontAwesomeIcon icon={'chart-line'} className="text-3xl text-indigo-300 mb-2" />
                  <p className="text-sm text-gray-600">
                    Add more transactions to get personalized insights
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Spending and Goals Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Spending (Line Chart) */}
          <div className="bg-white rounded-xl p-6 card-shadow lg:col-span-2 dark:bg-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-800">Weekly Spending</h3>
              <select className="text-sm border rounded px-3 py-1 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-600 dark:text-white text-gray-900">
                <option>Last 4 Weeks</option>
                <option>Last 8 Weeks</option>
              </select>
            </div>
            <LineChart data={weeklySpending} loading={loading} />
          </div>

          {/* Enhanced Savings Goals */}
          <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-300">Savings Goals</h3>
              <button 
                onClick={() => window.location.href = '/smartGoals'}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
              >
                {goals.length > 0 ? 'View All' : 'Add Goal'}
              </button>
            </div>
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal, index) => (
                  <div 
                    key={index}
                    onClick={() => window.location.href = `/smartGoals?goal=${goal.id}`}
                    className="cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                        {goal.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        {!goal.isOnTrack && (
                          <FontAwesomeIcon 
                            icon={'exclamation-triangle'} 
                            className="text-orange-500 text-xs" 
                            title="Behind schedule"
                          />
                        )}
                        <span className="text-xs text-gray-500">
                          {goal.progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar mb-2">
                      <div 
                        className={`progress-fill ${goal.isOnTrack ? 'bg-green-500' : 'bg-orange-500'}`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        {goal.formattedCurrent} / {goal.formattedTarget}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {goal.deadline}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={'piggy-bank'} className="text-3xl text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No savings goals yet</p>
                  <p className="text-xs text-gray-400 mb-3">Create your first goal to start tracking progress</p>
                  <button
                    onClick={() => window.location.href = '/smartGoals'}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Create Goal →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <br /><br /><br /><br />
      </main>

      <FloatingAIAssistantIcon />
    </>
  );
};

export default Dashboard;