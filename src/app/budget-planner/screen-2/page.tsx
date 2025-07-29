import MainNavigation from '@/app/components/MainNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'
import '../../../lib/fontawesome'

const page = () => {
  return (
    <>
      <div className="min-h-screen">
        <MainNavigation />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* <!-- Navigation --> */}
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

          {/* <!-- Page Header --> */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Category Budgets</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Set and manage spending limits per category
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
              >
                {/* <i className="fas fa-arrow-left mr-2"></i> Back */}
                <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
              </button>
            </div>
          </div>

          {/* <!-- Current Month Selector --> */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">October 2023 Budgets</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Viewing budgets for current month
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700">
                {/* <i className="fas fa-chevron-left text-slate-500"></i> */}
                <FontAwesomeIcon icon={'chevron-left'} className='text-slate-500' />
              </button>
              <button
                className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium"
              >
                {/* <i className="fas fa-calendar-alt mr-2"></i> Change Month */}
                <FontAwesomeIcon icon={'calendar-alt'} className='mr-2' /> Change Month
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700">
                {/* <i className="fas fa-chevron-right text-slate-500"></i> */}
                <FontAwesomeIcon icon={'chevron-right'} className='text-slate-500' />
              </button>
            </div>
          </div>

          {/* <!-- AI Insight Panel --> */}
          <div className="ai-insight text-white rounded-xl p-4 mb-6 flex items-start">
            <div
              className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)"
              }}
            >
              {/* <i className="fas fa-lightbulb"></i> */}
              <FontAwesomeIcon icon={'lightbulb'} />
            </div>
            <div className="flex-1">
              <p className="font-medium">AI Budget Insight</p>
              <p className="text-sm opacity-90 mb-2">
                Groceries overspent? You spent ₦6,000 more than average this month.
              </p>
              <div className="flex items-center space-x-3 mt-2">
                <button
                  className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  {/* <i className="fas fa-adjust mr-1"></i> Adjust Budget */}
                  <FontAwesomeIcon icon={'adjust'} className='mr-1' /> Adjust Budget
                </button>
                <button
                  className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  {/* <i className="fas fa-exchange-alt mr-1"></i> Move ₦6,000 from */}
                  <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Move ₦6,000 from
                  Entertainment
                </button>
                <button
                  className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)"
                  }}
                >
                  {/* <i className="fas fa-chart-line mr-1"></i> View Trends */}
                  <FontAwesomeIcon icon={'chart-line'} className='mr-1' /> View Trends
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Category Budget List --> */}
          <div className="space-y-4 mb-8">
            {/* <!-- Category 1 --> */}
            <div className="category-item bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                    {/* <i className="fas fa-shopping-basket"></i> */}
                    <FontAwesomeIcon icon={'shopping-basket'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Groceries</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Supermarket purchases, household items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="relative">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-200">₦ </span>
                    <input
                      type="number"
                      // value="30000"
                      // onChange={()=>{}}
                      defaultValue="30000"
                      className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 hover:text-slate-600"
                    >
                      {/* <i className="fas fa-pencil-alt text-xs"></i> */}
                      <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Spent: ₦25,400</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">84.7% of budget used</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">₦4,600 remaining</span>
              </div>
              <div className="budget-meter">
                <div
                  className="budget-meter-fill bg-yellow-500"
                  // style="width: 84.7%"
                  style={{
                    width: "84.7%"
                  }}
                ></div>
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  {/* <i className="fas fa-chart-pie mr-1"></i> View Breakdown */}
                  <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  {/* <i className="fas fa-bell mr-1"></i> Set Alert */}
                  <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  {/* <i className="fas fa-exchange-alt mr-1"></i> Transfer */}
                  <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
                </button>
              </div>
            </div>

            {/* <!-- Category 2 --> */}
            <div className="category-item bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    {/* <i className="fas fa-car"></i> */}
                    <FontAwesomeIcon icon={'car'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Transport</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Fuel, public transport, ride shares
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="relative">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-200">₦ </span>
                    <input
                      type="number"
                      // value="15000"
                      defaultValue="15000"
                      className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 hover:text-slate-600"
                    >
                      {/* <i className="fas fa-pencil-alt text-xs"></i> */}
                      <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Spent: ₦12,000</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">80% of budget used</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">₦3,000 remaining</span>
              </div>
              <div className="budget-meter">
                <div
                  className="budget-meter-fill bg-yellow-500"
                  // style="width: 80%"
                  style={{
                    width: "80%"
                  }}
                ></div>
              </div>
              {/* <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  <i className="fas fa-chart-pie mr-1"></i> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <i className="fas fa-bell mr-1"></i> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  <i className="fas fa-exchange-alt mr-1"></i> Transfer
                </button>
              </div> */}
              <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  {/* <i className="fas fa-chart-pie mr-1"></i> View Breakdown */}
                  <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  {/* <i className="fas fa-bell mr-1"></i> Set Alert */}
                  <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  {/* <i className="fas fa-exchange-alt mr-1"></i> Transfer */}
                  <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
                </button>
              </div>
            </div>

            {/* <!-- Category 3 --> */}
            <div className="category-item bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                    {/* <i className="fas fa-home"></i> */}
                    <FontAwesomeIcon icon={'home'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Rent</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Monthly apartment rent</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="relative">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-200">₦ </span>
                    <input
                      type="number"
                      // value="50000"
                      defaultValue="50000"
                      className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 hover:text-slate-600"
                    >
                      {/* <i className="fas fa-pencil-alt text-xs"></i> */}
                      <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Spent: ₦50,000</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">100% of budget used</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">₦0 remaining</span>
              </div>
              <div className="budget-meter">
                <div
                  className="budget-meter-fill bg-red-500"
                  // style="width: 100%"
                  style={{
                    width: "100%"
                  }}
                ></div>
              </div>
              {/* <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  <i className="fas fa-chart-pie mr-1"></i> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <i className="fas fa-bell mr-1"></i> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  <i className="fas fa-exchange-alt mr-1"></i> Transfer
                </button>
              </div> */}
              <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  {/* <i className="fas fa-chart-pie mr-1"></i> View Breakdown */}
                  <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  {/* <i className="fas fa-bell mr-1"></i> Set Alert */}
                  <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  {/* <i className="fas fa-exchange-alt mr-1"></i> Transfer */}
                  <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
                </button>
              </div>
            </div>

            {/* <!-- Category 4 --> */}
            <div className="category-item bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="bg-pink-100 text-pink-600 p-2 rounded-lg mr-3">
                    {/* <i className="fas fa-film"></i> */}
                    <FontAwesomeIcon icon={'film'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Entertainment</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Movies, concerts, streaming
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="relative">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-200">₦ </span>
                    <input
                      type="number"
                      // value="15000"
                      defaultValue="15000"
                      className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 hover:text-slate-600"
                    >
                      {/* <i className="fas fa-pencil-alt text-xs"></i> */}
                      <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Spent: ₦8,500</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">56.7% of budget used</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">₦6,500 remaining</span>
              </div>
              <div className="budget-meter">
                <div
                  className="budget-meter-fill bg-green-500"
                  // style="width: 56.7%"
                  style={{
                    width: "56.7%"
                  }}
                ></div>
              </div>
              {/* <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  <i className="fas fa-chart-pie mr-1"></i> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <i className="fas fa-bell mr-1"></i> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  <i className="fas fa-exchange-alt mr-1"></i> Transfer
                </button>
              </div> */}
              <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  {/* <i className="fas fa-chart-pie mr-1"></i> View Breakdown */}
                  <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  {/* <i className="fas fa-bell mr-1"></i> Set Alert */}
                  <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  {/* <i className="fas fa-exchange-alt mr-1"></i> Transfer */}
                  <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
                </button>
              </div>
            </div>

            {/* <!-- Category 5 --> */}
            <div className="category-item bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">
                    {/* <i className="fas fa-dumbbell"></i> */}
                    <FontAwesomeIcon icon={'dumbbell'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Fitness</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Gym membership, equipment</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="relative">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-200">₦ </span>
                    <input
                      type="number"
                      // value="8000"
                      defaultValue="8000"
                      className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 hover:text-slate-600"
                    >
                      {/* <i className="fas fa-pencil-alt text-xs"></i> */}
                      <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Spent: ₦5,200</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">65% of budget used</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">₦2,800 remaining</span>
              </div>
              <div className="budget-meter">
                <div
                  className="budget-meter-fill bg-green-500"
                  // style="width: 65%"
                  style={{
                    width: "65%"
                  }}
                ></div>
              </div>
              {/* <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  <i className="fas fa-chart-pie mr-1"></i> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <i className="fas fa-bell mr-1"></i> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  <i className="fas fa-exchange-alt mr-1"></i> Transfer
                </button>
              </div> */}
              <div className="mt-3 flex justify-between text-xs">
                <button
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
                >
                  {/* <i className="fas fa-chart-pie mr-1"></i> View Breakdown */}
                  <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
                </button>
                <button
                  className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  {/* <i className="fas fa-bell mr-1"></i> Set Alert */}
                  <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
                </button>
                <button
                  className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
                >
                  {/* <i className="fas fa-exchange-alt mr-1"></i> Transfer */}
                  <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Add New Category --> */}
          <div
            className="bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-indigo-300 dark:hover:border-primary dark:border-gray-500 dark:bg-gray-800 transition mb-8"
          >
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full bg-slate-200 text-indigo-600 dark:bg-opacity-80 flex items-center justify-center mr-3"
              >
                {/* <i className="fas fa-plus"></i> */}
                <FontAwesomeIcon icon={'plus'} />
              </div>
              <p className="text-sm font-medium text-indigo-600">
                Add New Budget Category
              </p>
            </div>
          </div>

          {/* <!-- Budget Summary --> */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg text-slate-700 dark:text-slate-300 font-semibold mb-4">Budget Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Total Budget</p>
                <h4 className="text-xl font-bold text-slate-600 dark:text-slate-200">₦109,000</h4>
              </div>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Total Spent</p>
                <h4 className="text-xl font-bold text-slate-600 dark:text-slate-200">₦101,100</h4>
              </div>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Remaining</p>
                <h4 className="text-xl font-bold text-green-700 dark:text-green-400">₦7,900</h4>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Budget Utilization</span>
                <span className="text-slate-600 dark:text-slate-300">92.8%</span>
              </div>
              <div className="budget-meter">
                <div
                  className="budget-meter-fill bg-red-500"
                  // style="width: 92.8%"
                  style={{
                    width: "92.8%"
                  }}
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

export default page