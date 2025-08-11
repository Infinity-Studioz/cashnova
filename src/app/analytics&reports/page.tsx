'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MainNavigation from '../components/MainNavigation'
import ProgressBar from '../components/ProgressBar'
import { useState } from "react";
import '../../lib/fontawesome'
import SpendingTrendsChart from '../components/SpendingTrendsChart ';
import CategoryBreakdownChart from '../components/CategoryBreakdownChart ';
import MonthlyComparisonChart from '../components/MonthlyComparisonChart ';
import { useSession } from 'next-auth/react';
import AuthButtons from "../components/AuthButtons";

const AnalyticsPage = () => {
  const [range, setRange] = useState("Last 30 days");
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['Monthly Overview', 'Category Insights', 'Saving Ratio', 'Trends & Forecasts'];

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <>
    <div>Please sign in to analyze your finances</div>
    <AuthButtons />
  </>;

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Analytics & Reports
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize spending, identify habits, and optimize your finances
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={'file-pdf'} className='mr-2' /> PDF
              </button>
              <button
                className="bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50"
              >
                <FontAwesomeIcon icon={'file-excel'} className='mr-2' /> Excel
              </button>
            </div>
          </div>

          {/* <!-- Date Range Selector --> */}
          <div
            className="bg-white rounded-lg shadow-sm p-4 mb-6 card-shadow dark:bg-gray-800"
          >
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  May 2023 Financial Report
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Compare with previous periods
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <select value={range} onChange={(e) => setRange(e.target.value)} className="bg-gray-100 text-gray-700 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  {/* <option>Custom range</option> */}
                </select>

                <button
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg shadow-sm p-4 mb-6 card-shadow dark:bg-gray-800"
          >
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Extra Fund Balance
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your withdrawable funds for your emergency/miscellaneous expenses
                </p>
              </div>
              <div className="flex items-center space-x-5">
                <h3 className="text-2xl font-bold inline mt-1 text-gray-800 dark:text-white">
                  $4,250.00
                </h3>

                <button
                  className="bg-green-700 hover:bg-primary-dark text-white px-6 py-3 pt-4 rounded-lg"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Tabs Navigation --> */}
          <div className="bg-white rounded-t-lg shadow-sm card-shadow dark:bg-gray-800">
            <nav className="flex overflow-x-auto">
              {tabs.map((label, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === index
                    ? 'tab-active dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-400'
                    }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>


          {/* <!-- Tab Content --> */}
          <div
            className="bg-white rounded-b-lg shadow-sm p-6 mb-6 card-shadow dark:bg-gray-800"
          >
            {/* <!-- AI Alerts Section --> */}
            <div className="space-y-4 mb-8">
              {/* <!-- Budget Warning --> */}
              <div className="budget-warning p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    {/* <i className="fas fa-exclamation-triangle text-yellow-500"></i> */}
                    <FontAwesomeIcon icon={'exclamation-triangle'} className='text-yellow-500' />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Budget Alert
                    </h3>
                    <div className="mt-1 text-sm text-yellow-700">
                      <p>
                        You&apos;ve spent 85% of your $500 grocery budget this month.
                      </p>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={85} color="bg-yellow-500" />
                      <div
                        className="flex justify-between text-xs text-yellow-800 mt-1"
                      >
                        <span>$425 spent</span>
                        <span>$75 remaining</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Positive Alert --> */}
              <div
                className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FontAwesomeIcon icon={'check-circle'} className='text-green-500' />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Savings Milestone
                    </h3>
                    <div className="mt-1 text-sm text-green-700">
                      <p>
                        Your savings rate this month is 22%, which is 7% higher
                        than last month!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Charts Section --> */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* <!-- Spending Trends Chart --> */}
              <div
                className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Spending Trends
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md dark:bg-white"
                    >
                      Weekly
                    </button>
                    <button
                      className="px-3 py-1 text-xs bg-primary text-white rounded-md"
                    >
                      Monthly
                    </button>
                    <button
                      className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md dark:bg-white"
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <SpendingTrendsChart />
              </div>

              {/* <!-- Category Breakdown Chart --> */}
              <div
                className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-200 dark:border-gray-500"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Category Breakdown
                  </h3>
                  <div className="relative">
                    <select
                      id="no-appearance"
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value)}
                      className="appearance-none bg-gray-100 border-0 text-gray-700 dark:bg-gray-600 dark:text-white py-1 pl-3 pr-8 rounded-md text-sm"
                    >
                      <option value="This Month">This Month</option>
                      <option value="Last Month">Last Month</option>
                      <option value="Last 3 Months">Last 3 Months</option>
                    </select>

                    <div
                      className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                    >
                      <FontAwesomeIcon icon={'chevron-down'} className='text-xs' />
                    </div>
                  </div>
                </div>
                <CategoryBreakdownChart />
              </div>
            </div>

            {/* <!-- Comparison Section --> */}
            <div className="mb-8">
              <h3
                className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-200"
              >
                Monthly Comparison
              </h3>
              <div
                className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-200"
              >
                <MonthlyComparisonChart />
              </div>
            </div>

            {/* <!-- Savings Ratio Section --> */}
            <div>
              <h3
                className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-200"
              >
                Savings Ratio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-500">
                      Current Month
                    </h4>
                    <span className="text-sm font-medium text-green-600">22%</span>
                  </div>
                  <ProgressBar value={22} color="bg-green-500" />
                  <div className="mt-2 text-xs text-gray-500">
                    $1,100 saved of $5,000 income
                  </div>
                </div>
                <div
                  className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-500">Last Month</h4>
                    <span className="text-sm font-medium text-blue-600">15%</span>
                  </div>
                  <ProgressBar value={15} color="bg-blue-500" />
                  <div className="mt-2 text-xs text-gray-500">
                    $675 saved of $4,500 income
                  </div>
                </div>
                <div
                  className="bg-white p-4 border border-gray-200 rounded-lg card-shadow dark:bg-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-500">
                      Year Average
                    </h4>
                    <span className="text-sm font-medium text-purple-600">18%</span>
                  </div>
                  <ProgressBar value={18} color="bg-purple-500" />
                  <div className="mt-2 text-xs text-gray-500">
                    $8,100 saved of $45,000 income
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Budget Progress Section --> */}
          <div
            className="bg-white rounded-lg shadow-sm p-6 mb-6 card-shadow dark:bg-gray-200"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Budget Progress
            </h3>
            <div className="space-y-4">
              {/* <!-- Budget Item 1 --> */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Groceries</h4>
                  <span className="text-xs font-medium text-gray-500"
                  >$425 of $500</span
                  >
                </div>
                <ProgressBar value={85} color="bg-yellow-500" />
              </div>

              {/* <!-- Budget Item 2 --> */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Dining Out</h4>
                  <span className="text-xs font-medium text-gray-500"
                  >$180 of $300</span
                  >
                </div>
                <ProgressBar value={60} color="bg-blue-500" />
              </div>

              {/* <!-- Budget Item 3 (Over budget) --> */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">Entertainment</h4>
                  <span className="text-xs font-medium text-red-600"
                  >$320 of $250
                  </span>
                </div>
                <ProgressBar value={128} color="bg-red-500" />
              </div>

              {/* <!-- Budget Item 4 --> */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    Transportation
                  </h4>
                  <span className="text-xs font-medium text-gray-500"
                  >$90 of $200</span
                  >
                </div>
                <ProgressBar value={45} color="bg-green-500" />
              </div>
            </div>
          </div>
        </main>
        <br /><br /><br /><br />
      </div>
    </>
  )
}

export default AnalyticsPage