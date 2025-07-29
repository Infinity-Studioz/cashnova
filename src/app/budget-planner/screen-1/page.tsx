import MainNavigation from "@/app/components/MainNavigation"
import ProgressRing from "@/app/components/ProgressRing"
import SpendingChart from "@/app/components/SpendingChart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"

const page = () => {
  return (
    <>
      <MainNavigation />
      <div className="min-h screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* <!-- Navigation --> */}
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

          {/* <!-- Page Header --> */}
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center"
              >
                {/* <i className="fas fa-plus mr-2"></i> Create Category Budget */}
                <FontAwesomeIcon icon={'plus'} className="mr-2" /> Create Category Budget
              </button>
              <button
                className="px-4 py-2 bg-white dark:bg-slate-100 dark:hover:bg-slate-200 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
              >
                {/* <i className="fas fa-robot mr-2"></i> AI Suggest Budget Plan */}
                <FontAwesomeIcon icon={'robot'} className="mr-2" /> AI Suggest Budget Plan
              </button>
            </div>
          </div>

          {/* <!-- AI Alert --> */}
          <div className="ai-alert text-white rounded-xl p-4 mb-6 flex items-start">
            <div
              className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)"
              }}
            >
              {/* <i className="fas fa-exclamation-circle"></i> */}
              <FontAwesomeIcon icon={'exclamation-circle'} />
            </div>
            <div>
              <p className="font-medium">Budget Alert</p>
              <p className="text-sm opacity-90">
                You&apos;re on track to exceed your budget by ₦20,000 this month based on
                current spending patterns.
              </p>
            </div>
          </div>

          {/* <!-- Budget Overview Cards --> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* <!-- Total Budget --> */}
            <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Total Monthly Budget
                  </p>
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">₦200,000</h3>
                </div>
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                  {/* <i className="fas fa-wallet"></i> */}
                  <FontAwesomeIcon icon={'wallet'} />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span className="text-slate-500 dark:text-slate-300">Remaining</span>
                <span className="text-slate-600 dark:text-slate-200">₦57,500</span>
              </div>
              <div className="budget-meter mt-2">
                <div
                  className="budget-meter-fill bg-indigo-600"
                  style={{
                    width: '71.25%'
                  }}
                ></div>
              </div>
            </div>

            {/* <!-- Spent So Far --> */}
            <div className="bg-white rounded-xl p-6 shadow-sm dark:bg-gray-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    Spent So Far
                  </p>
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">₦142,500</h3>
                </div>
                <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                  <i className="fas fa-shopping-bag"></i>
                  <FontAwesomeIcon icon={'shopping-bag'} />
                </div>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span className="text-slate-500 dark:text-slate-300">Daily Average</span>
                <span className="text-slate-600 dark:text-slate-200">₦4,750</span>
              </div>
              <div className="budget-meter mt-2">
                <div
                  className="budget-meter-fill bg-red-500"
                  style={{
                    width: '71.25%'
                  }}
                ></div>
              </div>
            </div>

            {/* <!-- Budget Progress Ring --> */}
            <div
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center"
            >
              <ProgressRing percentage={71} />
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Monthly Budget Used
              </p>
            </div>
          </div>

          {/* <!-- Budget Categories --> */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Budget Categories
              </h3>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-200 dark:text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-100 transition"
                >
                  {/* <i className="fas fa-filter mr-1"></i> Filter */}
                  <FontAwesomeIcon icon={'filter'} className="mr-1" /> Filter
                </button>
                <button
                  className="px-3 py-1 bg-slate-100 text-slate-600 dark:bg-slate-200 dark:text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-100 transition"
                >
                  {/* <i className="fas fa-sort mr-1"></i> Sort */}
                  <FontAwesomeIcon icon={'sort'} className="mr-1" /> Sort
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* <!-- Category 1 --> */}
              <div
                className="category-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-600 dark:text-slate-200">Housing</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Rent, Utilities, Maintenance
                    </p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    {/* <i className="fas fa-home"></i> */}
                    <FontAwesomeIcon icon={'home'} />
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-300"
                  >Budget: ₦80,000</span>
                  <span className="font-medium text-slate-400 dark:text-slate-200">₦72,000 spent</span>
                </div>
                <div className="budget-meter">
                  <div
                    className="budget-meter-fill bg-blue-500"
                    style={{
                      width: '90%'
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-red-500 flex items-center">
                  {/* <i className="fas fa-exclamation-triangle mr-1"></i> Exceeded by */}
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="mr-1" /> Exceeded by
                  ₦12,000
                </div>
              </div>

              {/* <!-- Category 2 --> */}
              <div
                className="category-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-600 dark:text-slate-200">Food & Dining</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Groceries, Restaurants
                    </p>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    {/* <i className="fas fa-utensils"></i> */}
                    <FontAwesomeIcon icon={'utensils'} />
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-300"
                  >Budget: ₦40,000</span>
                  <span className="font-medium text-slate-400 dark:text-slate-200">₦32,000 spent</span>
                </div>
                <div className="budget-meter">
                  <div
                    className="budget-meter-fill bg-green-500"
                    style={{
                      width: '80%'
                    }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-yellow-500 flex items-center">
                  {/* <i className="fas fa-info-circle mr-1"></i> Close to limit */}
                  <FontAwesomeIcon icon={'info-circle'} className="mr-1" /> Close to limit
                </div>
              </div>

              {/* <!-- Category 3 --> */}
              <div
                className="category-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-600 dark:text-slate-200">Transportation</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Fuel, Public Transport
                    </p>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                    {/* <i className="fas fa-car"></i> */}
                    <FontAwesomeIcon icon={'car'} />
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-300"
                  >Budget: ₦25,000</span>
                  <span className="font-medium text-slate-400 dark:text-slate-200">₦18,500 spent</span>
                </div>
                <div className="budget-meter">
                  <div
                    className="budget-meter-fill bg-purple-500"
                    style={{
                      width: '74%'
                    }}
                  ></div>
                </div>
              </div>

              {/* <!-- Category 4 --> */}
              <div
                className="category-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-600 dark:text-slate-200">Entertainment</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Movies, Events, Hobbies
                    </p>
                  </div>
                  <div className="bg-pink-100 text-pink-600 p-2 rounded-lg">
                    {/* <i className="fas fa-gamepad"></i> */}
                    <FontAwesomeIcon icon={'gamepad'} />
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-300"
                  >Budget: ₦20,000</span>
                  <span className="font-medium text-slate-400 dark:text-slate-200">₦8,000 spent</span>
                </div>
                <div className="budget-meter">
                  <div
                    className="budget-meter-fill bg-pink-500"
                    style={{
                      width: '40%'
                    }}
                  ></div>
                </div>
              </div>

              {/* <!-- Category 5 --> */}
              <div
                className="category-card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-slate-600 dark:text-slate-200">
                      Health & Fitness
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Gym, Medical, Supplements
                    </p>
                  </div>
                  <div className="bg-teal-100 text-teal-600 p-2 rounded-lg">
                    {/* <i className="fas fa-heartbeat"></i> */}
                    <FontAwesomeIcon icon={'heartbeat'} />
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-300"
                  >Budget: ₦15,000</span>
                  <span className="font-medium text-slate-400 dark:text-slate-200">₦5,500 spent</span>
                </div>
                <div className="budget-meter">
                  <div
                    className="budget-meter-fill bg-teal-500"
                    style={{
                      width: '36.7%'
                    }}
                  ></div>
                </div>
              </div>

              {/* <!-- Add New Category --> */}
              <div
                className="category-card bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 dark:hover:border-primary dark:border-gray-500 dark:bg-gray-800 transition"
              >
                <div
                  className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 dark:bg-opacity-80 dark:bg-gray-50 flex items-center justify-center mb-2"
                >
                  {/* <i className="fas fa-plus"></i> */}
                  <FontAwesomeIcon icon={'plus'} />
                </div>
                <p className="text-sm font-medium text-indigo-600">Add New Category</p>
              </div>
            </div>
          </div>

          {/* <!-- Spending Chart --> */}
          <div className="bg-white dark:bg-gray-200 rounded-xl p-6 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Spending Trends</h3>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition dark:bg-white dark:hover:bg-slate-300"
                >
                  This Month
                </button>
                <button
                  className="px-3 py-1 bg-indigo-100 text-indigo-600 dark:bg-indigo-200 dark:hover:bg-indigo-300 rounded-lg text-xs font-medium hover:bg-indigo-200 transition"
                >
                  Last 6 Months
                </button>
              </div>
            </div>
            {/* <div className="h-64">
              <canvas id="spendingChart"></canvas>
            </div> */}
            <SpendingChart />
          </div>

          {/* <!-- AI Recommendations --> */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                {/* <i className="fas fa-robot"></i> */}
                <FontAwesomeIcon icon={'robot'} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300">
                AI Budget Recommendations
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3 mt-1">
                  {/* <i className="fas fa-lightbulb"></i> */}
                  <FontAwesomeIcon icon={'lightbulb'} />
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Reduce Dining Out</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You&apos;ve spent ₦18,000 on restaurants this month. Consider cooking
                    at home more to save up to ₦10,000 monthly.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 mt-1">
                  {/* <i className="fas fa-lightbulb"></i> */}
                  <FontAwesomeIcon icon={'lightbulb'} />
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    Optimize Transportation
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Carpooling could save you about ₦5,000 monthly based on your
                    current fuel expenses.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 mt-1">
                  {/* <i className="fas fa-lightbulb"></i> */}
                  <FontAwesomeIcon icon={'lightbulb'} />
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">Subscription Audit</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    You have ₦7,500 in unused subscriptions. Cancel 2 services to
                    save ₦15,000 annually.
                  </p>
                </div>
              </div>
            </div>

            <button
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center mx-auto"
            >
              {/* <i className="fas fa-magic mr-2"></i> Optimize My Budget Automatically */}
              <FontAwesomeIcon icon={'magic'} className="mr-2" /> Optimize My Budget Automatically
            </button>
          </div>
        </div>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default page