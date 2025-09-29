// src/app/budget-planner/screen-5/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainNavigation from '@/app/components/MainNavigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DayDetailsModal from '@/app/components/DayDetailsModal'
import '../../../lib/fontawesome'

interface CalendarTransaction {
  _id: string;
  title: string;
  subtitle?: string;
  amount: number;
  formattedAmount: string;
  type: 'income' | 'expense';
  category: string;
  paymentMethod?: string;
  merchant?: string;
  date: string;
}

interface CalendarDay {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  transactions: CalendarTransaction[];
  totalSpent: number;
  totalIncome: number;
  formattedTotalSpent: string;
  formattedTotalIncome: string;
  budgetStatus: 'under' | 'near' | 'over';
  specialEvents: string[];
}

interface CalendarData {
  month: string;
  year: number;
  days: CalendarDay[];
  monthlyBudget: {
    total: number;
    spent: number;
    remaining: number;
    formattedTotal: string;
    formattedSpent: string;
    formattedRemaining: string;
  };
  upcomingBills: Array<{
    name: string;
    amount: number;
    formattedAmount: string;
    dueDate: string;
    category: string;
    icon: string;
  }>;
}

const BudgetCalendarPage = () => {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    setError(null);

    const month = currentDate.toISOString().slice(0, 7);
    
    // Calculate exact month boundaries for accurate data fetching
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    try {
      // Fetch transactions for the SPECIFIC MONTH being viewed
      const transactionsResponse = await fetch(
        `/api/transactions?dateRange=custom&startDate=${startDateStr}&endDate=${endDateStr}&limit=1000&sortBy=date&sortOrder=desc`
      );

      if (!transactionsResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const transactionsData = await transactionsResponse.json();

      // Fetch budget data for the month
      const budgetResponse = await fetch(`/api/budgets?month=${month}`);
      let budgetData = null;

      if (budgetResponse.ok) {
        budgetData = await budgetResponse.json();
      }

      // Process calendar data
      const calendarData = processCalendarData(
        budgetData,
        transactionsData
      );

      setCalendarData(calendarData);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load calendar data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const processCalendarData = (
    budgetData: any,
    transactionsData: any
  ): CalendarData => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get transactions from the correct structure
    const transactions = transactionsData.transactions || [];

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Group transactions by date
    const transactionsByDate: Record<string, CalendarTransaction[]> = {};
    transactions.forEach((transaction: any) => {
      const date = new Date(transaction.date).toISOString().slice(0, 10);
      if (!transactionsByDate[date]) {
        transactionsByDate[date] = [];
      }

      transactionsByDate[date].push({
        _id: transaction._id,
        title: transaction.note || transaction.merchant || 'Transaction',
        subtitle: transaction.merchant || transaction.effectiveCategory,
        amount: transaction.amount,
        formattedAmount: transaction.formattedAmount,
        type: transaction.type,
        category: transaction.effectiveCategory || transaction.category,
        paymentMethod: transaction.paymentMethod,
        merchant: transaction.merchant,
        date: transaction.date
      });
    });

    // Create calendar days array
    const days: CalendarDay[] = [];

    // Add previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        date: new Date(year, month - 1, day).toISOString().slice(0, 10),
        day,
        isCurrentMonth: false,
        transactions: [],
        totalSpent: 0,
        totalIncome: 0,
        formattedTotalSpent: '₦0',
        formattedTotalIncome: '₦0',
        budgetStatus: 'under',
        specialEvents: []
      });
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().slice(0, 10);
      const dayTransactions = transactionsByDate[dateStr] || [];

      const totalSpent = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalIncome = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      // Determine budget status based on daily target
      const dailyBudgetTarget = budgetData?.summary?.totalAllocated
        ? budgetData.summary.totalAllocated / daysInMonth
        : 5000;

      let budgetStatus: 'under' | 'near' | 'over' = 'under';
      if (totalSpent > dailyBudgetTarget * 1.2) budgetStatus = 'over';
      else if (totalSpent > dailyBudgetTarget * 0.8) budgetStatus = 'near';

      // Check for special events
      const specialEvents = getSpecialEvents(day, month + 1);

      days.push({
        date: dateStr,
        day,
        isCurrentMonth: true,
        transactions: dayTransactions,
        totalSpent,
        totalIncome,
        formattedTotalSpent: formatCurrency(totalSpent),
        formattedTotalIncome: formatCurrency(totalIncome),
        budgetStatus,
        specialEvents
      });
    }

    // Add next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day).toISOString().slice(0, 10),
        day,
        isCurrentMonth: false,
        transactions: [],
        totalSpent: 0,
        totalIncome: 0,
        formattedTotalSpent: '₦0',
        formattedTotalIncome: '₦0',
        budgetStatus: 'under',
        specialEvents: []
      });
    }

    // Calculate monthly totals
    const monthlySpent = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const monthlyIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const monthlyBudget = budgetData?.summary || {
      totalAllocated: monthlySpent,
      totalSpent: monthlySpent,
      totalRemaining: 0
    };

    // Generate upcoming bills from recurring transactions
    const upcomingBills = generateUpcomingBills(transactions, currentDate);

    return {
      month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
      year,
      days,
      monthlyBudget: {
        total: monthlyBudget.totalAllocated || 0,
        spent: monthlySpent,
        remaining: (monthlyBudget.totalAllocated || 0) - monthlySpent,
        formattedTotal: formatCurrency(monthlyBudget.totalAllocated || 0),
        formattedSpent: formatCurrency(monthlySpent),
        formattedRemaining: formatCurrency((monthlyBudget.totalAllocated || 0) - monthlySpent)
      },
      upcomingBills
    };
  };

  const getSpecialEvents = (day: number, month: number): string[] => {
    const events = [];

    // Salary day (typically 25th-28th in Nigeria)
    if (day >= 25 && day <= 28) {
      events.push('Salary Expected');
    }

    // School fees seasons
    if (month === 1 || month === 9) {
      if (day <= 15) events.push('School Fees Due');
    }

    // Festive seasons
    if (month === 12) {
      if (day >= 20) events.push('Festive Season');
    }

    return events;
  };

  const generateUpcomingBills = (transactions: any[], currentDate: Date) => {
    // Extract recurring transactions that look like bills
    const recurringBills = transactions
      .filter((t: any) => t.recurring && t.type === 'expense')
      .slice(0, 3) // Top 3 recurring expenses
      .map((t: any) => {
        // Calculate next due date
        const transDate = new Date(t.date);
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, transDate.getDate());
        
        return {
          name: t.merchant || t.note || t.category,
          amount: t.amount,
          formattedAmount: formatCurrency(t.amount),
          dueDate: nextMonth.toISOString().slice(0, 10),
          category: t.effectiveCategory || t.category,
          icon: getCategoryIcon(t.effectiveCategory || t.category)
        };
      });

    // If we have recurring bills, return them; otherwise, use defaults
    if (recurringBills.length > 0) {
      return recurringBills;
    }

    // Fallback to typical Nigerian bills
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    return [
      {
        name: 'Rent Payment',
        amount: 50000,
        formattedAmount: formatCurrency(50000),
        dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1).toISOString().slice(0, 10),
        category: 'Housing',
        icon: 'home'
      },
      {
        name: 'Electricity Bill',
        amount: 15000,
        formattedAmount: formatCurrency(15000),
        dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15).toISOString().slice(0, 10),
        category: 'Bills',
        icon: 'bolt'
      },
      {
        name: 'Internet',
        amount: 8500,
        formattedAmount: formatCurrency(8500),
        dueDate: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 27).toISOString().slice(0, 10),
        category: 'Bills',
        icon: 'wifi'
      }
    ];
  };

  const getCategoryIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
      'Housing': 'home',
      'Rent/Housing': 'home',
      'Bills': 'bolt',
      'Transport': 'car',
      'Food & Dining': 'utensils',
      'Entertainment': 'film',
      'Health/Medical': 'heartbeat',
      'Shopping': 'shopping-bag',
      'Education': 'graduation-cap',
      'Family Support': 'heart'
    };
    return iconMap[category] || 'file-invoice-dollar';
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦');
  };

  const handleDayClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && day.transactions.length > 0) {
      setSelectedDay(day);
      setModalOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDateForModal = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Budget Calendar</h2>
              <p className="text-slate-500 dark:text-slate-400">Loading calendar data...</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !calendarData) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error || 'Failed to load calendar data'}</p>
                  <button
                    onClick={fetchCalendarData}
                    className="mt-2 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500"
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

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation */}
          <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
            <Link
              href="/budget-planner/screen-1"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
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
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1"
            >Budget Calendar</Link>
          </nav>

          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Budget Calendar</h2>
              <p className="text-slate-500 dark:text-slate-400">Visualize your budget impact day-by-day</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => toast.info('Filtering options coming soon!')}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center"
              >
                <FontAwesomeIcon icon={'filter'} className='mr-2' /> Filter
              </button>
              <button
                onClick={() => window.location.href = '/addTransaction'}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center"
              >
                <FontAwesomeIcon icon={'calendar-plus'} className='mr-2' /> Add Transaction
              </button>
            </div>
          </div>

          {/* Calendar Controls */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm mb-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <FontAwesomeIcon icon={'chevron-left'} className='text-slate-500 dark:text-slate-400' />
              </button>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{calendarData.month} {calendarData.year}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Budget: {calendarData.monthlyBudget.formattedSpent} / {calendarData.monthlyBudget.formattedTotal}
                </p>
              </div>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <FontAwesomeIcon icon={'chevron-right'} className='text-slate-500 dark:text-slate-400' />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {calendarData.days.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`calendar-day bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 p-2 min-h-[80px] transition-all
                  ${!day.isCurrentMonth ? 'opacity-50' : ''} 
                  ${day.transactions.length > 0 ? 'cursor-pointer hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600' : ''}
                  ${day.budgetStatus === 'over' ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : ''}
                  ${day.budgetStatus === 'near' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10' : ''}
                `}
              >
                <div className="text-right">
                  <span className={`font-medium ${day.isCurrentMonth ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}`}>
                    {day.day}
                  </span>
                </div>

                {day.specialEvents.length > 0 && (
                  <div className="mt-1">
                    {day.specialEvents.map((event, eventIndex) => (
                      <div key={eventIndex} className="flex items-center text-xs mb-1 text-blue-600 dark:text-blue-400">
                        <FontAwesomeIcon icon={'star'} className="mr-1 text-xs" />
                        <span className="truncate">{event}</span>
                      </div>
                    ))}
                  </div>
                )}

                {day.transactions.length > 0 && (
                  <div className="mt-1">
                    <div className="flex items-center text-xs mb-1">
                      <span className={`entry-dot ${day.totalSpent > day.totalIncome ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      <span className="text-slate-600 dark:text-slate-400 truncate">
                        {day.totalSpent > 0 && day.formattedTotalSpent}
                        {day.totalIncome > 0 && day.totalSpent > 0 && ' / '}
                        {day.totalIncome > 0 && `+${day.formattedTotalIncome}`}
                      </span>
                    </div>
                    <div className={`spending-bar rounded-full h-1 ${day.budgetStatus === 'over' ? 'bg-red-500' :
                        day.budgetStatus === 'near' ? 'bg-yellow-500' :
                          'bg-green-500'
                      }`} style={{
                        width: `${Math.min(day.budgetStatus === 'over' ? 100 :
                          day.budgetStatus === 'near' ? 80 : 60, 100)}%`
                      }}>
                    </div>
                  </div>
                )}

                {/* Show bill indicators */}
                {calendarData.upcomingBills.some(bill =>
                  new Date(bill.dueDate).getDate() === day.day && day.isCurrentMonth
                ) && (
                    <div className="mt-1">
                      <div className="flex items-center text-xs text-orange-600 dark:text-orange-400">
                        <FontAwesomeIcon icon={'file-invoice-dollar'} className="mr-1" />
                        <span>Bill Due</span>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>

          {/* Budget Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">{calendarData.month} Budget Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Spending */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Spending</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{calendarData.monthlyBudget.formattedSpent}</p>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium">
                    <FontAwesomeIcon icon={'arrow-up'} className='mr-1' />
                    {calendarData.monthlyBudget.spent > calendarData.monthlyBudget.total ? 'Over Budget' : 'On Track'}
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${calendarData.monthlyBudget.spent > calendarData.monthlyBudget.total ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    style={{
                      width: `${Math.min((calendarData.monthlyBudget.spent / calendarData.monthlyBudget.total) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {calendarData.monthlyBudget.formattedRemaining} remaining of {calendarData.monthlyBudget.formattedTotal} budget
                </p>
              </div>

              {/* Daily Average */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Daily Average</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {formatCurrency(calendarData.monthlyBudget.spent / new Date().getDate())}
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                    <FontAwesomeIcon icon={'calendar'} className='mr-1' /> This Month
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-3xl text-blue-500 mr-3">
                    <FontAwesomeIcon icon={'chart-line'} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">Spending Rate</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Based on current month</p>
                  </div>
                </div>
              </div>

              {/* Upcoming Bills */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Upcoming Bills</p>
                  <button
                    onClick={() => toast.info('Bill management feature coming soon!')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {calendarData.upcomingBills.slice(0, 2).map((bill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-2">
                          <FontAwesomeIcon icon={bill.icon} className='text-xs' />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{bill.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Due {new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{bill.formattedAmount}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Day Details Modal */}
          {selectedDay && (
            <DayDetailsModal
              visible={isModalOpen}
              onClose={() => setModalOpen(false)}
              date={formatDateForModal(selectedDay.date)}
              totalSpent={selectedDay.totalSpent}
              percentageUsed={(selectedDay.totalSpent / (calendarData.monthlyBudget.total / 30)) * 100}
              transactions={selectedDay.transactions.map(t => ({
                title: t.title,
                subtitle: t.subtitle || t.category,
                amount: t.amount,
                icon: t.type === 'income' ? 'money-bill-wave' : 'shopping-cart',
                category: t.category,
                method: t.paymentMethod || 'Not specified',
              }))}
              onAddTransaction={() => {
                setModalOpen(false);
                window.location.href = '/addTransaction';
              }}
            />
          )}
        </div>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default BudgetCalendarPage;