// // src/app/analytics%26reports/page.tsx
// 'use client'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import MainNavigation from '../components/MainNavigation'
// import ProgressBar from '../components/ProgressBar'
// import { useState } from "react";
// import '../../lib/fontawesome'
// import SpendingTrendsChart from '../components/SpendingTrendsChart ';
// import CategoryBreakdownChart from '../components/CategoryBreakdownChart ';
// import MonthlyComparisonChart from '../components/MonthlyComparisonChart ';
// import { useSession } from 'next-auth/react';
// import AuthButtons from "../components/AuthButtons";

// const AnalyticsPage = () => {
//   const [range, setRange] = useState("Last 30 days");
//   const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  
//   const { data: session, status } = useSession();

//   const [activeTab, setActiveTab] = useState(0);
//   const tabs = ['Monthly Overview', 'Category Insights', 'Saving Ratio', 'Trends & Forecasts'];

//   if (status === 'loading') return <div>Loading...</div>;
//   if (!session) return <>
//     <div>Please sign in to analyze your finances</div>
//     <AuthButtons />
//   </>;

//   return (
//     <>
//       <MainNavigation />
//       <div className="min-h-screen">
//         <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Analytics & Reports
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Visualize spending, identify habits, and optimize your finances
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 className="bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
//               >
//                 <FontAwesomeIcon icon={'file-pdf'} className='mr-2' /> PDF
//               </button>
//               <button
//                 className="bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
//               >
//                 <FontAwesomeIcon icon={'file-excel'} className='mr-2' /> Excel
//               </button>
//             </div>
//           </div>

//           {/* <!-- Date Range Selector --> */}
//           <div
//             className="bg-white rounded-lg shadow-sm p-4 mb-6 card-shadow dark:bg-gray-800"
//           >
//             <div
//               className="flex flex-col md:flex-row md:items-center md:justify-between"
//             >
//               <div className="mb-4 md:mb-0">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                   May 2023 Financial Report
//                 </h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Compare with previous periods
//                 </p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <select value={range} onChange={(e) => setRange(e.target.value)} className="bg-gray-100 text-gray-700 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm">
//                   <option>Last 7 days</option>
//                   <option>Last 30 days</option>
//                   <option>Last 3 months</option>
//                   <option>Last 6 months</option>
//                   {/* <option>Custom range</option> */}
//                 </select>

//                 <button
//                   className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* <!-- Tabs Navigation --> */}
//           <div className="bg-white rounded-t-lg shadow-sm card-shadow dark:bg-gray-800">
//             <nav className="flex overflow-x-auto">
//               {tabs.map((label, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveTab(index)}
//                   className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === index
//                     ? 'tab-active dark:text-white'
//                     : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400'
//                     }`}
//                 >
//                   {label}
//                 </button>
//               ))}
//             </nav>
//           </div>


//           {/* <!-- Tab Content --> */}
//           <div
//             className="bg-white rounded-b-lg shadow-sm p-6 mb-6 card-shadow dark:bg-gray-800"
//           >
//             {/* <!-- AI Alerts Section --> */}
//             <div className="space-y-4 mb-8">
//               {/* <!-- Budget Warning --> */}
//               <div className="budget-warning p-4 rounded-lg">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0 pt-1">
//                     {/* <i className="fas fa-exclamation-triangle text-yellow-500"></i> */}
//                     <FontAwesomeIcon icon={'exclamation-triangle'} className='text-yellow-500' />
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-yellow-800">
//                       Budget Alert
//                     </h3>
//                     <div className="mt-1 text-sm text-yellow-700">
//                       <p>
//                         You&apos;ve spent 85% of your $500 grocery budget this month.
//                       </p>
//                     </div>
//                     <div className="mt-2">
//                       <ProgressBar value={85} color="bg-yellow-500" />
//                       <div
//                         className="flex justify-between text-xs text-yellow-800 mt-1"
//                       >
//                         <span>$425 spent</span>
//                         <span>$75 remaining</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* <!-- Positive Alert --> */}
//               <div
//                 className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
//               >
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0 pt-1">
//                     <FontAwesomeIcon icon={'check-circle'} className='text-green-500' />
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-green-800">
//                       Savings Milestone
//                     </h3>
//                     <div className="mt-1 text-sm text-green-700">
//                       <p>
//                         Your savings rate this month is 22%, which is 7% higher
//                         than last month!
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* <!-- Charts Section --> */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//               {/* <!-- Spending Trends Chart --> */}
//               <div
//                 className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-200"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Spending Trends
//                   </h3>
//                   <div className="flex space-x-2">
//                     <button
//                       className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md dark:bg-white"
//                     >
//                       Weekly
//                     </button>
//                     <button
//                       className="px-3 py-1 text-xs bg-primary text-white rounded-md"
//                     >
//                       Monthly
//                     </button>
//                     <button
//                       className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md dark:bg-white"
//                     >
//                       Yearly
//                     </button>
//                   </div>
//                 </div>
//                 <SpendingTrendsChart />
//               </div>

//               {/* <!-- Category Breakdown Chart --> */}
//               <div
//                 className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-200 dark:border-gray-500"
//               >
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Category Breakdown
//                   </h3>
//                   <div className="relative">
//                     <select
//                       id="no-appearance"
//                       value={selectedPeriod}
//                       onChange={(e) => setSelectedPeriod(e.target.value)}
//                       className="appearance-none bg-gray-100 border-0 text-gray-700 dark:bg-gray-600 dark:text-white py-1 pl-3 pr-8 rounded-md text-sm"
//                     >
//                       <option value="This Month">This Month</option>
//                       <option value="Last Month">Last Month</option>
//                       <option value="Last 3 Months">Last 3 Months</option>
//                     </select>

//                     <div
//                       className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
//                     >
//                       <FontAwesomeIcon icon={'chevron-down'} className='text-xs' />
//                     </div>
//                   </div>
//                 </div>
//                 <CategoryBreakdownChart />
//               </div>
//             </div>

//             {/* <!-- Comparison Section --> */}
//             <div className="mb-8">
//               <h3
//                 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-200"
//               >
//                 Monthly Comparison
//               </h3>
//               <div
//                 className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-200"
//               >
//                 <MonthlyComparisonChart />
//               </div>
//             </div>

//             {/* <!-- Savings Ratio Section --> */}
//             <div>
//               <h3
//                 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-200"
//               >
//                 Savings Ratio
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div
//                   className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-100"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-sm font-medium text-gray-500">
//                       Current Month
//                     </h4>
//                     <span className="text-sm font-medium text-green-600">22%</span>
//                   </div>
//                   <ProgressBar value={22} color="bg-green-500" />
//                   <div className="mt-2 text-xs text-gray-500">
//                     $1,100 saved of $5,000 income
//                   </div>
//                 </div>
//                 <div
//                   className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-100"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-sm font-medium text-gray-500">Last Month</h4>
//                     <span className="text-sm font-medium text-blue-600">15%</span>
//                   </div>
//                   <ProgressBar value={15} color="bg-blue-500" />
//                   <div className="mt-2 text-xs text-gray-500">
//                     $675 saved of $4,500 income
//                   </div>
//                 </div>
//                 <div
//                   className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-100"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-sm font-medium text-gray-500">
//                       Year Average
//                     </h4>
//                     <span className="text-sm font-medium text-purple-600">18%</span>
//                   </div>
//                   <ProgressBar value={18} color="bg-purple-500" />
//                   <div className="mt-2 text-xs text-gray-500">
//                     $8,100 saved of $45,000 income
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* <!-- Budget Progress Section --> */}
//           <div
//             className="bg-white rounded-lg shadow-sm p-6 mb-6 card-shadow dark:bg-gray-200"
//           >
//             <h3 className="text-lg font-medium text-gray-900 mb-4">
//               Budget Progress
//             </h3>
//             <div className="space-y-4">
//               {/* <!-- Budget Item 1 --> */}
//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <h4 className="text-sm font-medium text-gray-900">Groceries</h4>
//                   <span className="text-xs font-medium text-gray-500"
//                   >$425 of $500</span
//                   >
//                 </div>
//                 <ProgressBar value={85} color="bg-yellow-500" />
//               </div>

//               {/* <!-- Budget Item 2 --> */}
//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <h4 className="text-sm font-medium text-gray-900">Dining Out</h4>
//                   <span className="text-xs font-medium text-gray-500"
//                   >$180 of $300</span
//                   >
//                 </div>
//                 <ProgressBar value={60} color="bg-blue-500" />
//               </div>

//               {/* <!-- Budget Item 3 (Over budget) --> */}
//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <h4 className="text-sm font-medium text-gray-900">Entertainment</h4>
//                   <span className="text-xs font-medium text-red-600"
//                   >$320 of $250
//                   </span>
//                 </div>
//                 <ProgressBar value={128} color="bg-red-500" />
//               </div>

//               {/* <!-- Budget Item 4 --> */}
//               <div>
//                 <div className="flex items-center justify-between mb-1">
//                   <h4 className="text-sm font-medium text-gray-900">
//                     Transportation
//                   </h4>
//                   <span className="text-xs font-medium text-gray-500"
//                   >$90 of $200</span
//                   >
//                 </div>
//                 <ProgressBar value={45} color="bg-green-500" />
//               </div>
//             </div>
//           </div>
//         </main>
//         <br /><br /><br /><br />
//       </div>
//     </>
//   )
// }

// export default AnalyticsPage

// src/app/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import MainNavigation from '../components/MainNavigation';
import AuthButtons from '../components/AuthButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../lib/fontawesome';

// Type definitions
interface HealthScore {
  total: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Work' | 'Critical';
  breakdown: {
    savingsRate: { score: number; value: number; target: number; status: 'good' | 'warning' | 'critical' };
    emergencyFund: { score: number; value: number; target: number; status: 'good' | 'warning' | 'critical' };
    budgetAdherence: { score: number; value: number; target: number; status: 'good' | 'warning' | 'critical' };
    spendingVolatility: { score: number; value: string; status: 'good' | 'warning' | 'critical' };
  };
  nigerianContext: {
    salaryAlignment: string;
    seasonalPrep: string;
  };
}

interface SpendingPattern {
  timeOfMonth: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
  dayOfWeek: Array<{ day: string; amount: number }>;
  topMerchants: Array<{ name: string; visits: number; avgAmount: number; total: number }>;
}

interface Anomaly {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'positive';
  category: string;
  title: string;
  description: string;
  impact?: string;
  recommendation?: string;
  actions: Array<{ label: string; action: string }>;
}

const AnalyticsPage = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'health' | 'patterns' | 'anomalies' | 'reports'>('health');
  const [dateRange, setDateRange] = useState('Last 30 days');
  
  // Data states
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [spendingPatterns, setSpendingPatterns] = useState<SpendingPattern | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAnalyticsData();
    }
  }, [status, dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // These endpoints will be implemented in Phase 1
      const [healthRes, patternsRes, anomaliesRes] = await Promise.all([
        fetch('/api/analytics/health-score'),
        fetch('/api/analytics/patterns'),
        fetch('/api/analytics/anomalies'),
      ]);

      if (healthRes.ok) {
        const data = await healthRes.json();
        setHealthScore(data.healthScore);
      }

      if (patternsRes.ok) {
        const data = await patternsRes.json();
        setSpendingPatterns(data.patterns);
      }

      if (anomaliesRes.ok) {
        const data = await anomaliesRes.json();
        setAnomalies(data.anomalies);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sign in to view your analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Access financial intelligence and insights about your spending patterns
            </p>
            <AuthButtons />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Analytics & Intelligence
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Deep insights into your financial behavior and patterns
              </p>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last 6 months</option>
                <option>This year</option>
              </select>
              <button
                onClick={() => toast.info('Report export coming soon!')}
                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-700"
              >
                <FontAwesomeIcon icon="file-pdf" className="mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-slate-700">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('health')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === 'health'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FontAwesomeIcon icon="heartbeat" className="mr-2" />
                Financial Health
              </button>
              <button
                onClick={() => setActiveTab('patterns')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === 'patterns'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FontAwesomeIcon icon="chart-line" className="mr-2" />
                Spending Patterns
              </button>
              <button
                onClick={() => setActiveTab('anomalies')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === 'anomalies'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
                Anomalies ({anomalies.length})
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === 'reports'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <FontAwesomeIcon icon="file-alt" className="mr-2" />
                Custom Reports
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'health' && <HealthScoreTab healthScore={healthScore} />}
              {activeTab === 'patterns' && <SpendingPatternsTab patterns={spendingPatterns} />}
              {activeTab === 'anomalies' && <AnomaliesTab anomalies={anomalies} />}
              {activeTab === 'reports' && <CustomReportsTab />}
            </>
          )}
        </main>
        <br /><br /><br /><br />
      </div>
    </>
  );
};

// ==================== HEALTH SCORE TAB ====================
const HealthScoreTab = ({ healthScore }: { healthScore: HealthScore | null }) => {
  if (!healthScore) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <p className="text-gray-600 dark:text-gray-400">Loading health score...</p>
      </div>
    );
  }

  const getRatingColor = (rating: string) => {
    const colors = {
      'Excellent': 'text-green-600 bg-green-50 dark:bg-green-900/20',
      'Good': 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      'Fair': 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
      'Needs Work': 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
      'Critical': 'text-red-600 bg-red-50 dark:bg-red-900/20'
    };
    return colors[rating as keyof typeof colors] || colors['Fair'];
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Financial Health Score</h2>
            <p className="text-indigo-100">
              A comprehensive view of your financial wellness
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full ${getRatingColor(healthScore.rating)} font-semibold`}>
            {healthScore.rating}
          </div>
        </div>

        <div className="flex items-end space-x-4">
          <div className="text-6xl font-bold">{healthScore.total}</div>
          <div className="text-3xl text-indigo-200 mb-2">/100</div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-white/20 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${healthScore.total}%` }}
          ></div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Score Breakdown</h3>
        
        <div className="space-y-6">
          {/* Savings Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={healthScore.breakdown.savingsRate.status === 'good' ? 'check-circle' : 'exclamation-circle'}
                  className={healthScore.breakdown.savingsRate.status === 'good' ? 'text-green-500' : 'text-yellow-500'}
                />
                <span className="font-medium text-gray-900 dark:text-white">Savings Rate</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white">{healthScore.breakdown.savingsRate.value}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  (Target: {healthScore.breakdown.savingsRate.target}%)
                </span>
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(healthScore.breakdown.savingsRate.score)}`}
                style={{ width: `${(healthScore.breakdown.savingsRate.score / 25) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {healthScore.breakdown.savingsRate.score}/25 points
            </p>
          </div>

          {/* Emergency Fund */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={healthScore.breakdown.emergencyFund.status === 'good' ? 'check-circle' : 'exclamation-circle'}
                  className={healthScore.breakdown.emergencyFund.status === 'good' ? 'text-green-500' : 'text-yellow-500'}
                />
                <span className="font-medium text-gray-900 dark:text-white">Emergency Fund</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white">{healthScore.breakdown.emergencyFund.value} months</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  (Target: {healthScore.breakdown.emergencyFund.target} months)
                </span>
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(healthScore.breakdown.emergencyFund.score)}`}
                style={{ width: `${(healthScore.breakdown.emergencyFund.score / 20) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {healthScore.breakdown.emergencyFund.score}/20 points
            </p>
          </div>

          {/* Budget Adherence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={healthScore.breakdown.budgetAdherence.status === 'good' ? 'check-circle' : 'exclamation-circle'}
                  className={healthScore.breakdown.budgetAdherence.status === 'good' ? 'text-green-500' : 'text-yellow-500'}
                />
                <span className="font-medium text-gray-900 dark:text-white">Budget Adherence</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white">{healthScore.breakdown.budgetAdherence.value}%</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  (Target: {healthScore.breakdown.budgetAdherence.target}%)
                </span>
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(healthScore.breakdown.budgetAdherence.score)}`}
                style={{ width: `${(healthScore.breakdown.budgetAdherence.score / 20) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {healthScore.breakdown.budgetAdherence.score}/20 points
            </p>
          </div>

          {/* Spending Volatility */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={healthScore.breakdown.spendingVolatility.status === 'good' ? 'check-circle' : 'exclamation-circle'}
                  className={healthScore.breakdown.spendingVolatility.status === 'good' ? 'text-green-500' : 'text-yellow-500'}
                />
                <span className="font-medium text-gray-900 dark:text-white">Spending Stability</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gray-900 dark:text-white">{healthScore.breakdown.spendingVolatility.value}</span>
              </div>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(healthScore.breakdown.spendingVolatility.score)}`}
                style={{ width: `${(healthScore.breakdown.spendingVolatility.score / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {healthScore.breakdown.spendingVolatility.score}/10 points
            </p>
          </div>
        </div>
      </div>

      {/* Nigerian Context */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">🇳🇬</span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nigerian Market Context</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon="calendar-check" className="text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Salary Cycle Alignment</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{healthScore.nigerianContext.salaryAlignment}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon="graduation-cap" className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Seasonal Preparation</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{healthScore.nigerianContext.seasonalPrep}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FontAwesomeIcon icon="lightbulb" className="text-blue-600 mt-1" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Increase emergency fund to 4-6 months for better protection against Nigerian economic volatility
            </p>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <FontAwesomeIcon icon="lightbulb" className="text-green-600 mt-1" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Excellent budget adherence! Keep up the good work tracking your spending
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== SPENDING PATTERNS TAB ====================
const SpendingPatternsTab = ({ patterns }: { patterns: SpendingPattern | null }) => {
  if (!patterns) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <p className="text-gray-600 dark:text-gray-400">Loading spending patterns...</p>
      </div>
    );
  }

  const maxWeekly = Math.max(patterns.timeOfMonth.week1, patterns.timeOfMonth.week2, patterns.timeOfMonth.week3, patterns.timeOfMonth.week4);

  return (
    <div className="space-y-6">
      {/* Time of Month Pattern */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">When Do You Spend Most?</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Days 1-7 (Post-salary)</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ₦{patterns.timeOfMonth.week1.toLocaleString()} (30%)
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-indigo-600 rounded-full h-3"
                style={{ width: `${(patterns.timeOfMonth.week1 / maxWeekly) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Days 8-14</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ₦{patterns.timeOfMonth.week2.toLocaleString()} (25%)
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-blue-600 rounded-full h-3"
                style={{ width: `${(patterns.timeOfMonth.week2 / maxWeekly) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Days 15-21 (Mid-month dip)</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ₦{patterns.timeOfMonth.week3.toLocaleString()} (20%)
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-yellow-600 rounded-full h-3"
                style={{ width: `${(patterns.timeOfMonth.week3 / maxWeekly) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Days 22-30 (Pre-salary squeeze)</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ₦{patterns.timeOfMonth.week4.toLocaleString()} (25%)
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div
                className="bg-orange-600 rounded-full h-3"
                style={{ width: `${(patterns.timeOfMonth.week4 / maxWeekly) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon="exclamation-triangle" className="text-yellow-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Insight</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You spend 55% of your budget in the first 2 weeks. This is common in Nigerian salary cycles but risky.
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                💡 Recommendation: Set aside bills money immediately after salary
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Merchants */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Most Frequent Merchants</h3>
        
        <div className="space-y-4">
          {patterns.topMerchants.map((merchant, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{merchant.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {merchant.visits} visits • Avg: ₦{merchant.avgAmount.toLocaleString()}/visit
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-white">₦{merchant.total.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total spent</p>
              </div>
            </div>
          ))}
        </div>

        {patterns.topMerchants.length > 0 && patterns.topMerchants[0].name === 'Uber' && (
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon="exclamation-circle" className="text-orange-600 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">High Transport Spending Detected</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Your Uber spending exceeds transport budget by 40%. Consider BRT for routine trips.
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  💡 Potential savings: ₦60,000/month
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Day of Week Pattern */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Which Days Do You Spend Most?</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {patterns.dayOfWeek.map((day, index) => {
            const maxDay = Math.max(...patterns.dayOfWeek.map(d => d.amount));
            const percentage = (day.amount / maxDay) * 100;
            
            return (
              <div key={index} className="text-center">
                <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-3 h-32 flex flex-col justify-end relative">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-b-lg transition-all"
                    style={{ height: `${percentage}%` }}
                  ></div>
                  <div className="relative z-10">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">{day.day}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">₦{(day.amount / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {patterns.dayOfWeek[4]?.amount > patterns.dayOfWeek[0]?.amount * 1.5 && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon="info-circle" className="text-yellow-600 mt-1" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">&quot;Thank God It&apos;s Friday&quot; Pattern</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Friday spending is significantly higher than other days. Weekend accounts for 43% of weekly spending.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== ANOMALIES TAB ====================
const AnomaliesTab = ({ anomalies }: { anomalies: Anomaly[] }) => {
  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case 'critical': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      case 'positive': return 'check-circle';
      default: return 'info-circle';
    }
  };

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'positive': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'positive': return 'text-green-600';
      default: return 'text-blue-600';
    }
  };

  if (anomalies.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-12 border border-gray-200 dark:border-slate-700 text-center">
        <FontAwesomeIcon icon="check-circle" className="text-6xl text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All Clear!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          No unusual patterns detected in your spending. Your financial behavior looks healthy and consistent.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {anomalies.map((anomaly) => (
        <div key={anomaly.id} className={`border rounded-lg p-6 ${getAnomalyColor(anomaly.type)}`}>
          <div className="flex items-start space-x-4">
            <FontAwesomeIcon icon={getAnomalyIcon(anomaly.type)} className={`text-2xl ${getIconColor(anomaly.type)} mt-1`} />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{anomaly.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{anomaly.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  anomaly.type === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                  anomaly.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  anomaly.type === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {anomaly.type}
                </span>
              </div>

              <p className="text-gray-800 dark:text-gray-200 mb-3">{anomaly.description}</p>

              {anomaly.impact && (
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Impact:</span> {anomaly.impact}
                  </p>
                </div>
              )}

              {anomaly.recommendation && (
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Recommendation:</span> {anomaly.recommendation}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {anomaly.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => toast.info(`${action.label} action coming soon!`)}
                    className="px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==================== CUSTOM REPORTS TAB ====================
const CustomReportsTab = () => {
  const [reportName, setReportName] = useState('Q3 2025 Financial Review');
  const [dateRange, setDateRange] = useState('Last 6 months');
  const [sections, setSections] = useState({
    summary: true,
    trends: true,
    categories: true,
    merchants: false,
    budgetPerformance: true,
    savingsProgress: true,
    goals: false,
    economicContext: true,
    peerComparison: false,
    recommendations: true,
  });

  const toggleSection = (key: string) => {
    setSections(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleGenerateReport = () => {
    toast.success('Report generation will be implemented in Phase 2!');
  };

  return (
    <div className="space-y-6">
      {/* Report Builder Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          <FontAwesomeIcon icon="file-alt" className="mr-2" />
          Custom Report Builder
        </h3>

        {/* Report Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Report Name
          </label>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Q3 2025 Financial Review"
          />
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white"
          >
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
            <option>This year</option>
            <option>Last year</option>
            <option>Custom range...</option>
          </select>
        </div>

        {/* Sections to Include */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Include Sections
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(sections).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleSection(key)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Group By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Group By
          </label>
          <select className="w-full px-4 py-2 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white">
            <option>Month</option>
            <option>Week</option>
            <option>Quarter</option>
            <option>Year</option>
          </select>
        </div>

        {/* Export Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Export Options
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="flex items-center justify-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition">
              <FontAwesomeIcon icon="file-pdf" className="text-red-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">PDF Report</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition">
              <FontAwesomeIcon icon="file-excel" className="text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Excel Data</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
              <FontAwesomeIcon icon="envelope" className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Report</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleGenerateReport}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <FontAwesomeIcon icon="file-download" className="mr-2" />
            Generate Report
          </button>
          <button className="px-6 py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition">
            <FontAwesomeIcon icon="save" className="mr-2" />
            Save Template
          </button>
        </div>
      </div>

      {/* Pre-built Templates */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pre-built Templates</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Quick start with our professionally designed report templates</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Monthly Financial Review', icon: 'calendar', desc: 'Income, expenses, and budget performance' },
            { name: 'Tax Preparation', icon: 'file-invoice', desc: 'All income and deductible expenses' },
            { name: 'Loan Application Package', icon: 'university', desc: '6-month income and expense history' },
            { name: 'Savings Progress Report', icon: 'piggy-bank', desc: 'Goal tracking and savings rate' },
            { name: 'Budget Audit Report', icon: 'chart-pie', desc: 'Variance analysis and optimization' },
            { name: 'Nigerian Economic Impact', icon: 'globe-africa', desc: 'Inflation and economic context' },
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => toast.info(`${template.name} template coming soon!`)}
              className="p-4 bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-slate-700 transition group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition">
                  <FontAwesomeIcon icon={template.icon} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{template.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start space-x-4">
          <FontAwesomeIcon icon="info-circle" className="text-2xl text-indigo-600 dark:text-indigo-400 mt-1" />
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Phase 2 Feature</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Custom report generation will be implemented in December 2025 as part of our Phase 2 rollout. 
              You&apos;ll be able to create, customize, and export detailed financial reports in PDF and Excel formats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;