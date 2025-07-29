import MainNavigation from '@/app/components/MainNavigation'
import '../../../lib/fontawesome'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BudgetCategoryCard from '@/app/components/BudgetCategoryCard'
const page = () => {
  return (
    <>
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
            className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
          >Category Budgets</Link>
          <Link
            href="/budget-planner/screen-3"
            className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Smart Budget Assistant
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              AI-powered budget generation and optimization
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

        {/* <!-- AI Prompt Section --> */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <div
              className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4"
            >
              {/* <i className="fas fa-robot text-xl"></i> */}
              <FontAwesomeIcon icon={'robot'} className='text-xl' />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                How can I help with your budget?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try one of these prompts or type your own
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <button
              className="prompt-chip px-4 py-3 bg-indigo-50 dark:bg-indigo-100 dark:hover:bg-indigo-200 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left"
            >
              {/* <i className="fas fa-magic mr-2"></i> */}
              <FontAwesomeIcon icon={'magic'} className='mr-2' />
              Generate a new budget based on last 3 months
            </button>
            <button
              className="prompt-chip px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-100 dark:hover:bg-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left"
            >
              {/* <i className="fas fa-bullseye mr-2"></i> */}
              <FontAwesomeIcon icon={'bullseye'} className='mr-2' />
              Optimize to save 10% more this month
            </button>
            <button
              className="prompt-chip px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-100 dark:hover:bg-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left"
            >
              {/* <i className="fas fa-calculator mr-2"></i> */}
              <FontAwesomeIcon icon={'calculator'} className='mr-2' />
              Build me a zero-based budget
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Type your budget request here..."
              className="w-full px-4 py-3 pr-12 bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {/* <i className="fas fa-paper-plane"></i> */}
              <FontAwesomeIcon icon={'paper-plane'} />
            </button>
          </div>
        </div>

        {/* <!-- AI Generated Budget --> */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3"
              >
                {/* <i className="fas fa-lightbulb"></i> */}
                <FontAwesomeIcon icon={'lightbulb'} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">AI-Generated Budget</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Based on your spending patterns and goals
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition"
              >
                {/* <i className="fas fa-redo-alt mr-1"></i> Regenerate */}
                <FontAwesomeIcon icon={'redo'} className='mr-1' /> Regenerate
              </button>
              <button
                className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition"
              >
                {/* <i className="fas fa-check-circle mr-1"></i> Apply Budget */}
                <FontAwesomeIcon icon={'check-circle'} className='mr-1' /> Apply Budget
              </button>
            </div>
          </div>

          {/* <!-- Budget Notification --> */}
          <div
            className="ai-gradient-bg text-white rounded-lg p-4 mb-6 flex items-start"
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
              <p className="font-medium">Budget Adjustment Insight</p>
              <p className="text-sm opacity-90">
                Reducing Entertainment by ₦3,000 helps you meet your savings goal
                of 10% this month.
              </p>
            </div>
          </div>

          {/* <!-- Budget Sliders --> */}
          <div className="space-y-6">
            {/* <!-- Category 1 --> */}
            {/* <div
              className="category-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={'shopping-basket'} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Groceries</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monthly average: ₦30,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500 line-through dark:text-slate-300">₦28,000</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-500">₦25,000</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 dark:text-slate-300">₦15,000</span>
                <input
                  type="range"
                  min="15000"
                  max="35000"
                  value="25000"
                  className="budget-slider draggable-slider flex-1"
                />
                <span className="text-sm text-slate-500 dark:text-slate-300">₦35,000</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Min recommended</span>
                <span>Max recommended</span>
              </div>
            </div> */}
            <BudgetCategoryCard
              icon="shopping-basket"
              iconBgClass="bg-green-100"
              iconTextClass="text-green-600"
              categoryTitle="Groceries"
              categorySubtitle="Monthly average: ₦30,000"
              crossedAmount="₦28,000"
              minValue={15000}
              maxValue={35000}
              defaultValue={25000}
            // onValueChange={(val) => {
            //   console.log('Groceries updated to:', val);
            //   // Trigger summary update here
            // }}
            />


            {/* <!-- Category 2 --> */}
            {/* <div
              className="category-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={'car'} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Transport</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monthly average: ₦15,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500 line-through dark:text-slate-300">₦15,000</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-500">₦13,500</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 dark:text-slate-300">₦12,000</span>
                <input
                  type="range"
                  min="12000"
                  max="18000"
                  value="13500"
                  className="budget-slider draggable-slider flex-1"
                />
                <span className="text-sm text-slate-500 dark:text-slate-300">₦18,000</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Min recommended</span>
                <span>Max recommended</span>
              </div>
            </div> */}
            <BudgetCategoryCard
              icon="car"
              iconBgClass="bg-blue-100"
              iconTextClass="text-blue-600"
              categoryTitle="Transport"
              categorySubtitle="Monthly average: ₦15,000"
              crossedAmount="₦15,000"
              minValue={12000}
              maxValue={18000}
              defaultValue={13500}
            // onValueChange={(val) => {
            //   console.log('Transport updated to:', val);
            //   // Call your budget summary update logic here
            // }}
            />


            {/* <!-- Category 3 --> */}
            {/* <div
              className="category-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={'home'} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Rent</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Fixed monthly expense</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500 dark:text-slate-300 line-through">₦50,000</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-500">₦50,000</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 dark:text-slate-300">₦50,000</span>
                <input
                  type="range"
                  min="50000"
                  max="50000"
                  value="50000"
                  className="budget-slider flex-1"
                  disabled
                />
                <span className="text-sm text-slate-500 dark:text-slate-300">₦50,000</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Fixed expense</span>
                <span>Cannot be adjusted</span>
              </div>
            </div> */}
            <BudgetCategoryCard
              icon="home"
              iconBgClass="bg-purple-100"
              iconTextClass="text-purple-600"
              categoryTitle="Rent"
              categorySubtitle="Fixed monthly expense"
              crossedAmount="₦50,000"
              minValue={50000}
              maxValue={50000}
              defaultValue={50000}
              disabled={true}
            />

            {/* <!-- Category 4 --> */}
            {/* <div
              className="category-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-pink-100 text-pink-600 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={'film'} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Entertainment</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monthly average: ₦12,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500 dark:text-slate-300 line-through">₦12,000</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-500">₦9,000</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 dark:text-slate-300">₦7,000</span>
                <input
                  type="range"
                  min="7000"
                  max="15000"
                  value="9000"
                  className="budget-slider draggable-slider flex-1"
                />
                <span className="text-sm text-slate-500 dark:text-slate-300">₦15,000</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Min recommended</span>
                <span>Max recommended</span>
              </div>
              <div className="mt-3 text-xs text-red-500 flex items-center">
                <FontAwesomeIcon icon={'exclamation-circle'} className='mr-2' />
                <span>Reducing this by ₦3,000 helps meet your savings goal</span>
              </div>
            </div> */}
            <BudgetCategoryCard
              icon="film"
              iconBgClass="bg-pink-100"
              iconTextClass="text-pink-600"
              categoryTitle="Entertainment"
              categorySubtitle="Monthly average: ₦12,000"
              crossedAmount="₦12,000"
              minValue={7000}
              maxValue={15000}
              defaultValue={9000}
              bottomTip={{
                icon: 'exclamation-circle',
                text: 'Reducing this by ₦3,000 helps meet your savings goal',
                className: 'text-red-500',
              }}
            // onValueChange={(val) => {
            //   console.log('Entertainment updated to:', val);
            //   // Trigger budget update logic
            // }}
            />

            {/* <!-- Category 5 --> */}
            {/* <div
              className="category-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={'dumbbell'} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200">Fitness</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300">Monthly average: ₦8,000</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500 dark:text-slate-300 line-through">₦8,000</span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-500">₦7,000</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500 dark:text-slate-300">₦6,000</span>
                <input
                  type="range"
                  min="6000"
                  max="10000"
                  value="7000"
                  className="budget-slider draggable-slider flex-1"
                />
                <span className="text-sm text-slate-500 dark:text-slate-300">₦10,000</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Min recommended</span>
                <span>Max recommended</span>
              </div>
            </div> */}

            <BudgetCategoryCard
              icon="dumbbell"
              iconBgClass="bg-teal-100"
              iconTextClass="text-teal-600"
              categoryTitle="Fitness"
              categorySubtitle="Monthly average: ₦8,000"
              crossedAmount="₦8,000"
              minValue={6000}
              maxValue={10000}
              defaultValue={7000}
              // onValueChange={(val) => {
              //   console.log('Fitness updated to:', val);
              //   // Budget summary update logic
              // }}
            />

          </div>
        </div>

        {/* <!-- Budget Summary --> */}
        <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Budget Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Previous Total Budget</p>
              <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200">₦115,000</h4>
            </div>
            <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">AI-Adjusted Budget</p>
              <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-500">₦104,500</h4>
            </div>
            <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Monthly Savings</p>
              <h4 className="text-xl font-bold text-green-600 dark:text-green-500">+₦10,500</h4>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3"
              >
                {/* <i className="fas fa-info-circle"></i> */}
                <FontAwesomeIcon icon={'info-circle'} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Your savings goal of 10% is achieved with this budget
                </p>
              </div>
            </div>
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Apply This Budget
            </button>
          </div>
        </div>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default page