import MainNavigation from '@/app/components/MainNavigation'
import '../../../lib/fontawesome'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ToggleSwitch from '@/app/components/ToggleSwitch'

const page = () => {
  return (
    <>
      <MainNavigation />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* <!-- Navigation --> */}
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
              className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
            >Budget Alerts & Reminders</Link>
            <Link
              href="/budget-planner/screen-5"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
            >Budget Calendar</Link>
          </nav>

          {/* <!-- Page Header --> */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Budget Alerts & Reminders
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Stay on track with personalized notifications
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

          {/* <!-- Two Column Layout --> */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* <!-- Alert Settings Column --> */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg dark:text-slate-300 font-semibold mb-6">Alert Settings</h3>

              {/* <!-- Alert Type 1 --> */}
              <div
                className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3"
                    >
                      {/* <i className="fas fa-percent"></i> */}
                      <FontAwesomeIcon icon={'percent'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Category Threshold</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get notified when a category reaches a certain percentage
                      </p>
                    </div>
                  </div>
                  {/* <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div
                      className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                    ></div>
                  </label> */}
                  <ToggleSwitch />
                </div>

                <div className="mt-4 pl-13">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm dark:text-slate-300">Alert me when any category hits</span>
                    <div className="relative">
                      <select
                        className="category-selector bg-white border border-slate-200 text-slate-700 dark:bg-gray-600 dark:text-white dark:border-slate-400 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-20 px-3 py-1"
                      >
                        <option>80%</option>
                        <option>85%</option>
                        <option>90%</option>
                        <option>95%</option>
                      </select>
                    </div>
                    <span className="text-sm dark:text-slate-300">of budget</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm dark:text-slate-300">Or specific category:</span>
                    <div className="relative">
                      <select
                        // onChange={()=>{}
                        // defaultValue="all"
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-32 px-3 py-1"
                        // className="category-selector border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-32 px-3 py-1"
                      >
                        <option>All Categories</option>
                        <option>Groceries</option>
                        <option>Transport</option>
                        <option>Entertainment</option>
                        <option>Rent</option>
                        <option>Utilities</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Alert Type 2 --> */}
              <div
                className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3"
                    >
                      {/* <i className="fas fa-exclamation-triangle"></i> */}
                      <FontAwesomeIcon icon={'exclamation-triangle'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Budget Exceeded</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get notified when you exceed your overall budget
                      </p>
                    </div>
                  </div>
                  {/* <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div
                      className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                    ></div>
                  </label> */}
                  <ToggleSwitch />
                </div>

                <div className="mt-4 pl-13">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm dark:text-slate-300"
                    >Alert me when I exceed my overall budget by</span
                    >
                    <div className="relative">
                      <select
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-20 px-3 py-1"
                      >
                        <option>5%</option>
                        <option>10%</option>
                        <option>15%</option>
                        <option>20%</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Alert Type 3 --> */}
              <div
                className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3"
                    >
                      {/* <i className="fas fa-calendar-week"></i> */}
                      <FontAwesomeIcon icon={'calendar-week'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Weekly Summary</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get a weekly spending summary
                      </p>
                    </div>
                  </div>
                  {/* <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div
                      className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                    ></div>
                  </label> */}
                  <ToggleSwitch />
                </div>

                <div className="mt-4 pl-13">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm dark:text-slate-300">Send me a weekly summary every</span>
                    <div className="relative">
                      <select
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-28 px-3 py-1"
                      >
                        <option>Sunday</option>
                        <option>Monday</option>
                        <option>Friday</option>
                      </select>
                    </div>
                    <span className="text-sm dark:text-slate-300">at</span>
                    <div className="relative">
                      <select
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-24 px-3 py-1"
                      >
                        <option>9:00 AM</option>
                        <option>12:00 PM</option>
                        <option>6:00 PM</option>
                        <option>8:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Alert Type 4 --> */}
              <div
                className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3"
                    >
                      {/* <i className="fas fa-bell"></i> */}
                      <FontAwesomeIcon icon={'bell'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Custom Alert</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Create your own custom spending alert
                      </p>
                    </div>
                  </div>
                  {/* <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div
                      className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                    ></div>
                  </label> */}
                  <ToggleSwitch />
                </div>

                <div className="mt-4 pl-13">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm dark:text-slate-300 mb-1">Category</label>
                      <select
                        className="category-selector w-full bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block px-3 py-2"
                      >
                        <option>Select category</option>
                        <option>Groceries</option>
                        <option>Transport</option>
                        <option>Entertainment</option>
                        <option>Rent</option>
                        <option>Utilities</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm dark:text-slate-300 mb-1">Alert when</label>
                      <select
                        className="category-selector w-full bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block px-3 py-2"
                      >
                        <option>Spending reaches</option>
                        <option>Daily spending exceeds</option>
                        <option>Weekly spending exceeds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm dark:text-slate-300 mb-1">Amount/Percentage</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-100 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block px-3 py-2"
                        placeholder="e.g. 80% or ₦50,000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm dark:text-slate-300 mb-1">Notification Time</label>
                      <select
                        className="category-selector w-full bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block px-3 py-2"
                      >
                        <option>Immediately</option>
                        <option>Daily at 8 PM</option>
                        <option>Weekly on Friday</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Save Alert Settings
                </button>
              </div>
            </div>

            {/* <!-- Notification Previews Column --> */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg dark:text-slate-300 font-semibold mb-6">Notification Previews</h3>

              <div className="space-y-4">
                {/* <!-- Preview 1 --> */}
                <div
                  className="notification-preview text-white rounded-lg p-4 flex items-start"
                >
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                    {/* <i className="fas fa-info-circle"></i> */}
                    <FontAwesomeIcon icon={'info-circle'} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Budget Alert</p>
                    <p className="text-sm opacity-90">
                      Heads-up: You&apos;re at 85% of your transport budget
                      (₦12,750/₦15,000).
                    </p>
                    <div className="mt-2">
                      <div
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }}
                        className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div
                          className="bg-yellow-300 h-2 rounded-full"
                          // style="width: 85%"
                          style={{
                            width: '85%'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div
                      className="mt-3 text-xs opacity-80 flex justify-between">
                      <span>Today at 3:42 PM</span>
                      <span>Tap to view details</span>
                    </div>
                  </div>
                </div>

                {/* <!-- Preview 2 --> */}
                <div
                  className="notification-preview text-white rounded-lg p-4 flex items-start"
                >
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                    {/* <i className="fas fa-exclamation-triangle"></i> */}
                    <FontAwesomeIcon icon={'exclamation-triangle'} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Budget Exceeded</p>
                    <p className="text-sm opacity-90">
                      Warning: You&apos;ve exceeded your overall budget by 12% this
                      month.
                    </p>
                    <div className="mt-3 flex items-center space-x-3">
                      <button
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }}
                        className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition"
                      >
                        View Breakdown
                      </button>
                      <button
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }}
                        className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition"
                      >
                        Adjust Budget
                      </button>
                    </div>
                    <div className="mt-3 text-xs opacity-80 flex justify-between">
                      <span>Yesterday at 7:15 PM</span>
                      <span>Tap to dismiss</span>
                    </div>
                  </div>
                </div>

                {/* <!-- Preview 3 --> */}
                <div
                  className="notification-preview text-white rounded-lg p-4 flex items-start"
                >
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                    {/* <i className="fas fa-envelope-open-text"></i> */}
                    <FontAwesomeIcon icon={'envelope-open-text'} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Weekly Summary</p>
                    <p className="text-sm opacity-90">
                      Want to review this week&apos;s spending? You&apos;ve used ₦28,450 of
                      your ₦35,000 weekly budget.
                    </p>
                    <div className="mt-2">
                      <div
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }}
                        className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div
                          className="bg-green-300 h-2 rounded-full"
                          // style="width: 81%"
                          style={{
                            width: '81%'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="opacity-80">Groceries:</span>
                        <span className="font-medium">₦12,000</span>
                      </div>
                      <div>
                        <span className="opacity-80">Transport:</span>
                        <span className="font-medium">₦8,200</span>
                      </div>
                      <div>
                        <span className="opacity-80">Entertainment:</span>
                        <span className="font-medium">₦4,750</span>
                      </div>
                      <div>
                        <span className="opacity-80">Other:</span>
                        <span className="font-medium">₦3,500</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs opacity-80 flex justify-between">
                      <span>Every Sunday at 9:00 AM</span>
                      <span>Tap to view full report</span>
                    </div>
                  </div>
                </div>

                {/* <!-- Preview 4 --> */}
                <div
                  className="notification-preview text-white rounded-lg p-4 flex items-start"
                >
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }}
                    className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                    {/* <i className="fas fa-lightbulb"></i> */}
                    <FontAwesomeIcon icon={'lightbulb'} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Savings Tip</p>
                    <p className="text-sm opacity-90">
                      You could save ₦5,000 this month by reducing dining out from
                      ₦15,000 to ₦10,000.
                    </p>
                    <div className="mt-3 flex items-center space-x-3">
                      <button
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }}
                        className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition"
                      >
                        Apply Suggestion
                      </button>
                      <button
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }}
                        className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition"
                      >
                        Maybe Later
                      </button>
                    </div>
                    <div className="mt-3 text-xs opacity-80 flex justify-between">
                      <span>2 days ago at 11:30 AM</span>
                      <span>Smart Assistant</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm dark:text-slate-300 font-medium mb-3">Notification Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    {/* <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div
                        className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                    <span className="text-sm dark:text-slate-300">Push Notifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div
                        className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                    <span className="text-sm dark:text-slate-300">Email Alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div
                        className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                    <span className="text-sm dark:text-slate-300">SMS Alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked />
                      <div
                        className="w-11 h-6 bg-gray-200 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                    <span className="text-sm dark:text-slate-300">In-App Notifications</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Save Notification Settings
                  </button>
                </div>
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