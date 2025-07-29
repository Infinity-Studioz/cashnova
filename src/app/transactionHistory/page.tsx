'use client'
import MainNavigation from "../components/MainNavigation"
import '../../lib/fontawesome'
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TransactionHistoryPage = () => {
  const router = useRouter();

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Transaction History
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Review and manage all your financial activities
              </p>
            </div>
            <button
              onClick={() => router.push('/addTransaction')}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={'plus'} className="mr-2" /> Add Transaction
            </button>
          </div>

          {/* <!-- Filters and Stats --> */}
          <div
            className="bg-white rounded-lg shadow-sm p-4 mb-6 card-shadow dark:bg-gray-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400"
                >Date Range</label>
                <select
                  className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option>Last 7 days</option>
                  <option selected>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Custom range</option>
                </select>
              </div> */}
              <div>
                <label
                  htmlFor="dateRange"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400"
                  >
                  Date Range
                </label>
                <select
                  id="dateRange"
                  // onChange={()=>{}
                  defaultValue="30days"
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="3months">Last 3 months</option>
                  <option value="6months">Last 6 months</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="foodCat"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400"
                >Category</label>
                <select
                  defaultValue="allCats"
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="allCats">All Categories</option>
                  <option value="food">Food & Dining</option>
                  <option value="shopping">Shopping</option>
                  <option value="transportation">Transportation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="utilities">Utilities</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="amtRange"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400"
                >Amount Range</label>
                <select
                  defaultValue="anyAmt"
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="anyAmt">Any Amount</option>
                  <option value="u-50">Under $50</option>
                  <option value="50-200">$50 - $200</option>
                  <option value="200-500">$200 - $500</option>
                  <option value="o-500">Over $500</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="transStatus"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400"
                >Status</label>
                <select
                  defaultValue='allTrans'
                  className="bg-gray-50 w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="allTrans">All Transactions</option>
                  <option value="review">Flagged for Review</option>
                  <option value="recurring">Recurring</option>
                  <option value="oneTime">One-time</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button className="text-primary hover:text-primary-dark mr-4">
                  {/* <i className="fas fa-sync-alt mr-1"></i> Refresh */}
                  <FontAwesomeIcon icon={'sync-alt'} className="mr-1" /> Refresh
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {/* <i className="fas fa-download mr-1"></i> Export */}
                  <FontAwesomeIcon icon={'download'} className="mr-1" /> Export
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing 1-10 of 47 transactions
              </div>
            </div>
          </div>

          {/* <!-- AI Suggestions Banner --> */}
          <div
            className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {/* <i className="fas fa-robot text-blue-500 text-xl"></i> */}
                <FontAwesomeIcon icon={'robot'} className="text-blue-500 text-xl" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">AI Suggestion</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>
                    We&apos;ve detected that your dining expenses are 25% higher than
                    last month. Consider setting a budget for restaurants.
                  </p>
                </div>
                <div className="mt-2">
                  <button
                    className="text-xs font-medium text-blue-600 hover:text-blue-500"
                  >
                    Create Dining Budget <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Transactions List --> */}
          <div
            className="bg-white shadow-sm rounded-lg overflow-hidden card-shadow dark:bg-gray-800"
          >
            <div
              className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 card-shadow dark:bg-gray-800 font-medium text-gray-500 text-sm dark:text-gray-400"
            >
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Amount</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* <!-- Transaction Item 1 --> */}
            <div
              className="bg-white grid grid-cols-12 p-4 border-b border-gray-200 dark:bg-gray-800 transaction-income"
            >
              <div className="col-span-4 flex items-center">
                <div className="category-icon bg-green-100 text-green-600 mr-3">
                  {/* <i className="fas fa-money-bill-wave"></i> */}
                  <FontAwesomeIcon icon={'money-bill-wave'} />
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">Salary Deposit</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ACME Corp • Payroll
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                >Income</span>
              </div>
              <div
                className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400"
              >
                May 15, 2023
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <span className="font-medium text-green-600">+$4,200.00</span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="dropdown relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500"
                  >
                    {/* <i
                      className="fas fa-ellipsis-v text-gray-400 dark:hover:text-white"
                    ></i> */}
                    <FontAwesomeIcon icon={'ellipsis-v'} className="text-gray-400 dark:hover:text-white" />
                  </button>
                  <div
                    className="z-100 dropdown-content mt-1 py-1 card-shadow dark:bg-gray-700"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-edit mr-2"></i> Edit */}
                      <FontAwesomeIcon icon={'edit'} className="mr-2" /> Edit
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-flag mr-2"></i> Flag */}
                      <FontAwesomeIcon icon={'flag'} className="mr-2" /> Flag
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-trash mr-2"></i> Delete */}
                      <FontAwesomeIcon icon={'trash'} className="mr-2" /> Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Transaction Item 2 --> */}
            <div
              className="bg-white grid grid-cols-12 p-4 border-b border-gray-200 dark:bg-gray-800 transaction-expense"
            >
              <div className="col-span-4 flex items-center">
                <div className="category-icon bg-red-100 text-red-600 mr-3">
                  {/* <i className="fas fa-shopping-bag"></i> */}
                  <FontAwesomeIcon icon={'shopping-bag'} />
                </div>
                <div>
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    Grocery Shopping
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Whole Foods Market
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded"
                >Food & Dining</span>
              </div>
              <div
                className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400"
              >
                May 14, 2023
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <span className="font-medium text-red-600">-$128.75</span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="dropdown relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500"
                  >
                    {/* <i
                      className="fas fa-ellipsis-v text-gray-400 dark:hover:text-white"
                    ></i> */}
                    <FontAwesomeIcon icon={'ellipsis-v'} className="text-gray-400 dark:hover:text-white" />
                  </button>
                  <div
                    className="z-100 dropdown-content mt-1 py-1 card-shadow dark:bg-gray-700"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-edit mr-2"></i> Edit */}
                      <FontAwesomeIcon icon={'edit'} className="mr-2" /> Edit
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-flag mr-2"></i> Flag */}
                      <FontAwesomeIcon icon={'flag'} className="mr-2" /> Flag
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-trash mr-2"></i> Delete */}
                      <FontAwesomeIcon icon={'trash'} className="mr-2" /> Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Transaction Item 3 (Flagged) --> */}
            <div
              className="bg-white grid grid-cols-12 p-4 border-b border-gray-200 dark:bg-gray-800 transaction-expense"
            >
              <div className="col-span-4 flex items-center">
                <div className="category-icon bg-blue-100 text-blue-600 mr-3">
                  {/* <i className="fas fa-gamepad"></i> */}
                  <FontAwesomeIcon icon={'gamepad'} />
                </div>
                <div>
                  <div className="font-medium flex items-center text-gray-700 dark:text-gray-300">
                    Gaming Subscription
                    <span
                      className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded flex items-center"
                    >
                      {/* <i className="fas fa-flag mr-1"></i> Review */}
                      <FontAwesomeIcon icon={'flag'} className="mr-1" /> Review
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Steam Store
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >Entertainment</span>
              </div>
              <div
                className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400"
              >
                May 12, 2023
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <span className="font-medium text-red-600">-$59.99</span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="dropdown relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500"
                  >
                    {/* <i
                      className="fas fa-ellipsis-v text-gray-400 dark:hover:text-white"
                    ></i> */}
                    <FontAwesomeIcon icon={'ellipsis-v'} className="text-gray-400 dark:hover:text-white" />
                  </button>
                  <div
                    className="z-100 dropdown-content mt-1 py-1 card-shadow dark:bg-gray-700"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-edit mr-2"></i> Edit */}
                      <FontAwesomeIcon icon={'edit'} className="mr-2" /> Edit
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-flag mr-2"></i> Unflag */}
                      <FontAwesomeIcon icon={'flag'} className="mr-2" /> Unflag
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-trash mr-2"></i> Delete */}
                      <FontAwesomeIcon icon={'trash'} className="mr-2" /> Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Transaction Item 4 (Editing) --> */}
            <div
              className="bg-white grid grid-cols-12 p-4 border-b border-gray-200 dark:border-purple-500 dark:bg-gray-700 transaction-expense"
            >
              <div className="col-span-4 flex items-center">
                <div className="category-icon bg-purple-100 text-purple-600 mr-3">
                  {/* <i className="fas fa-tshirt"></i> */}
                  <FontAwesomeIcon icon={'tshirt'} />
                </div>
                <div className="w-full">
                  <input
                    type="text"
                    className="bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white edit-input"
                    value="New Clothes Purchase"
                  />
                  <div className="text-xs text-gray-500 mt-1 dark:text-gray-300">
                    Zara Store
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <select
                  defaultValue="clothing"
                  className="bg-gray-50 edit-input dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="shopping">Shopping</option>
                  <option value="food">Food & Dining</option>
                  <option value="transportation">Transportation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="clothing">Clothing</option>
                </select>
              </div>
              <div className="col-span-2 flex items-center">
                <input
                  type="date"
                  className="edit-input dark:border-gray-700 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white"
                  value="2023-05-10"
                />
              </div>
              <div className="col-span-2 flex items-center">
                <input
                  type="text"
                  className="edit-input text-right dark:border-gray-700 bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white"
                  value="$89.99"
                />
              </div>
              <div className="col-span-2 flex items-center justify-end space-x-2">
                <button
                  className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-600 dark:hover:text-white rounded-full"
                >
                  {/* <i className="fas fa-check"></i> */}
                  <FontAwesomeIcon icon={'check'} />
                </button>
                <button
                  className="p-2 text-gray-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-gray-700 rounded-full"
                >
                  {/* <i className="fas fa-times"></i> */}
                  <FontAwesomeIcon icon={'times'} />
                </button>
              </div>
            </div>

            {/* <!-- Transaction Item 5 --> */}
            <div
              className="grid grid-cols-12 p-4 border-b border-gray-200 transaction-expense"
            >
              <div className="col-span-4 flex items-center">
                <div className="category-icon bg-yellow-100 text-yellow-600 mr-3">
                  {/* <i className="fas fa-bolt"></i> */}
                  <FontAwesomeIcon icon={'bolt'} />
                </div>
                <div>
                  <div className="font-medium dark:text-gray-300">
                    Electricity Bill
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Utility Company
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span
                  className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                >Utilities</span>
              </div>
              <div
                className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400"
              >
                May 8, 2023
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <span className="font-medium text-red-600">-$75.30</span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="dropdown relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500"
                  >
                    {/* <i
                      className="fas fa-ellipsis-v text-gray-400 dark:hover:text-white"
                    ></i> */}
                    <FontAwesomeIcon icon={'ellipsis-v'} className="text-gray-400 dark:hover:text-white" />
                  </button>
                  <div
                    className="z-100 dropdown-content mt-1 py-1 card-shadow dark:bg-gray-700"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-edit mr-2"></i> Edit */}
                      <FontAwesomeIcon icon={'edit'} className="mr-2" /> Edit
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-flag mr-2"></i> Flag */}
                      <FontAwesomeIcon icon={'flag'} className="mr-2" /> Flag
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-trash mr-2"></i> Delete */}
                      <FontAwesomeIcon icon={'trash'} className="mr-2" /> Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Transaction Item 6 --> */}
            <div className="grid grid-cols-12 p-4 transaction-income">
              <div className="col-span-4 flex items-center">
                <div className="category-icon bg-green-100 text-green-600 mr-3">
                  {/* <i className="fas fa-piggy-bank"></i> */}
                  <FontAwesomeIcon icon={'piggy-bank'} />
                </div>
                <div>
                  <div className="font-medium dark:text-gray-300">Freelance Work</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Client: Design Studio
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <span
                  className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                >Income</span>
              </div>
              <div
                className="col-span-2 flex items-center text-sm text-gray-500 dark:text-gray-400"
              >
                May 5, 2023
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <span className="font-medium text-green-600">+$850.00</span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <div className="dropdown relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-500"
                  >
                    {/* <i
                      className="fas fa-ellipsis-v text-gray-400 dark:hover:text-white"
                    ></i> */}
                    <FontAwesomeIcon icon={'ellipsis-v'} className="text-gray-400 dark:hover:text-white" />
                  </button>
                  <div
                    className="z-100 dropdown-content mt-1 py-1 card-shadow dark:bg-gray-700"
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-edit mr-2"></i> Edit */}
                      <FontAwesomeIcon icon={'edit'} className="mr-2" /> Edit
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-flag mr-2"></i> Flag */}
                      <FontAwesomeIcon icon={'flag'} className="mr-2" /> Flag
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {/* <i className="fas fa-trash mr-2"></i> Delete */}
                      <FontAwesomeIcon icon={'trash'} className="mr-2" /> Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Pagination --> */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing 1 to 6 of 47 transactions
            </div>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border border-primary bg-primary text-white rounded-md text-sm font-medium"
              >
                1
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-800"
              >
                2
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-800"
              >
                3
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-100 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default TransactionHistoryPage