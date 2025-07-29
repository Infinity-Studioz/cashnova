import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import FloatingAIAssistantIcon from "../components/FloatingAI";

const Dashboard = () => {
  return (
    <>
      <main className="flex-1 container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here&apos;s your financial overview.
        </p>
      </div>

      {/* <!-- Balance Overview Cards --> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* <!-- Total Balance --> */}
        <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-300">
                Total Balance
              </p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                $8,245.00
              </h3>
              <p className="text-green-500 text-sm mt-2">
                <FontAwesomeIcon icon={"arrow-up"} className="mr-1" /> 12% from last month
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={"wallet"} className="text-indigo-600 text-xl" />
            </div>
          </div>
        </div>

        {/* <!-- Income --> */}
        <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-300">Income</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                $4,500.00
              </h3>
              <p className="text-green-500 text-sm mt-2">
                <FontAwesomeIcon icon={"arrow-up"} className="mr-1" /> 8% from last month
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={"money-bill-wave"} className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        {/* <!-- Expenses --> */}
        <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm dark:text-gray-300">Expenses</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">
                $2,755.00
              </h3>
              <p className="text-red-500 text-sm mt-2">
                <FontAwesomeIcon icon={"arrow-up"} className="mr-1" /> 25% from last month
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"
            >
              <FontAwesomeIcon icon={"shopping-bag"} className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Charts and Insights Section --> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* <!-- Spending by Category (Pie Chart) --> */}
        <div
          className="bg-white rounded-xl p-6 card-shadow lg:col-span-2 dark:bg-gray-800"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-300">
              Spending by Category
            </h3>
            <select
              className="text-sm border rounded px-3 py-1 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-gray-900"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>Last 3 Months</option>
            </select>
          </div>
          <PieChart />
        </div>

        {/* <!-- AI Insights Card --> */}
        <div className="bg-white rounded-xl p-6 card-shadow ai-card no-gradient">
          <div className="flex items-center mb-4">
            <div
              className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3"
            >
              <FontAwesomeIcon icon={faRobot} className="text-indigo-600"/>
            </div>
            <h3 className="font-bold text-gray-800">AI Insights</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">
                &quot;You&apos;re spending 25% more on food this month&quot;
              </p>
              <button className="mt-2 text-xs text-indigo-600 font-medium">
                View details
              </button>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">
                &quot;You&apos;re spending more on transport—want to adjust budget?&quot;
              </p>
              <button className="mt-2 text-xs text-indigo-600 font-medium">
                Adjust budget
              </button>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800">
                &quot;You could save $150/month by reducing dining out&quot;
              </p>
              <button className="mt-2 text-xs text-indigo-600 font-medium">
                See plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Weekly Spending and Goals Section --> */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* <!-- Weekly Spending (Line Chart) --> */}
        <div
          className="bg-white rounded-xl p-6 card-shadow lg:col-span-2 dark:bg-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-800">
              Weekly Spending
            </h3>
            <select
              className="text-sm border rounded px-3 py-1 border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-600 dark:text-white text-gray-900"
            >
              <option>Last 4 Weeks</option>
              <option>Last 8 Weeks</option>
            </select>
          </div>
          <LineChart />
        </div>

        {/* <!-- Savings Goals --> */}
        <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-300">
              Savings Goals
            </h3>
            <button className="text-sm text-indigo-600 font-medium">
              Add Goal
            </button>
          </div>
          <div className="space-y-4">
            {/* <!-- Vacation Fund --> */}
            <div>
              <div className="flex justify-between mb-1">
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >Vacation Fund</span
                >
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >$1,200/$2,000</span
                >
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: "60%",
                }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                Target: August 2023
              </p>
            </div>

            {/* <!-- Emergency Fund --> */}
            <div>
              <div className="flex justify-between mb-1">
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >Emergency Fund</span
                >
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >$3,000/$5,000</span
                >
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                Target: December 2023
              </p>
            </div>

            {/* <!-- New Laptop --> */}
            <div>
              <div className="flex justify-between mb-1">
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-400"
                >New Laptop
                </span>
                <span
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >$800/$1,200
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '67%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                Target: October 2023
              </p>
            </div>
          </div>
        </div>
      </div>

      <br /><br /><br /><br />
      </main>
      
      <FloatingAIAssistantIcon />
    </>
  )
}

export default Dashboard;