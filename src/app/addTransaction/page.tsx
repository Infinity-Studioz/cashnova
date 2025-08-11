'use client'
import { useState } from 'react'
import MainNavigation from '../components/MainNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../lib/fontawesome'
// import CheckoutButton from '../components/CheckoutButton'
import { FundWalletButton } from '../components/FundWalletButton'
import { useSession } from 'next-auth/react';
import AuthButtons from '../components/AuthButtons'

export default function AddTransactionPage() {
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(false)

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <>
    <p>You must be signed in</p>
    <AuthButtons />
  </>;

  return (
    <>
      <div className="min-h-screen flex flex-col pb-16">
        <MainNavigation />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Transaction
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Record your income or expenses
            </p>
          </div>

          {/* <!-- Transaction Type Toggle --> */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-l-lg border border-indigo-600 focus:z-10 focus:ring-2 focus:ring-indigo-500"
              >
                {/* <i className="fas fa-arrow-down mr-2"></i> Expense */}
                <FontAwesomeIcon icon={'arrow-down'} className='mr-2' /> Expense
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-r-lg border border-gray-200 hover:bg-gray-100 hover:text-indigo-700 focus:z-10 focus:ring-2 focus:ring-indigo-500"
              >
                {/* <i className="fas fa-arrow-up mr-2"></i> Income */}
                <FontAwesomeIcon icon={'arrow-up'} className='mr-2' /> Income
              </button>
            </div>
          </div>

          {/* <!-- Transaction Form --> */}
          <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
            <form>
              {/* <!-- Amount Field --> */}
              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Amount</label>
                <div className="relative">
                  <div
                    className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
                  >
                    <span className="text-gray-500 dark:text-white">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    className="bg-gray-100 border border-gray-300 text-gray-900 dark:border-gray-700 dark:text-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 p-2.5"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* <!-- Category Dropdown --> */}
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Category</label>
                <select
                  id="category"
                  className="bg-gray-50 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option selected disabled>Select a category</option>
                  <optgroup label="Expenses">
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transportation</option>
                    <option value="housing">Housing</option>
                    <option value="utilities">Utilities</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="health">Health & Fitness</option>
                  </optgroup>
                  <optgroup label="Income">
                    <option value="salary">Salary</option>
                    <option value="freelance">Freelance</option>
                    <option value="investment">Investments</option>
                    <option value="gift">Gifts</option>
                  </optgroup>
                </select>
              </div>

              {/* <!-- Payment Method --> */}
              <div className="mb-6">
                <label
                  htmlFor="payment"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Payment Method</label>
                <select
                  id="payment"
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option selected disabled>Select payment method</option>
                  <option value="cash">Cash</option>
                  <option value="debit">Debit Card</option>
                  <option value="credit">Credit Card</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Payment</option>
                </select>
              </div>

              {/* <!-- Date Picker --> */}
              <div className="mb-6">
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Date</label>
                <input
                  type="date"
                  id="date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  required
                />
              </div>

              {/* <!-- Notes Section --> */}
              <div className="mb-6">
                <label
                  htmlFor="notes"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Notes (Optional)</label>
                <textarea
                  id="notes"
                  // rows="2"
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Add any details about this transaction"
                ></textarea>
              </div>

              {/* <!-- Receipt Upload --> */}
              <div className="mb-6">
                <label
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >Receipt (Optional)</label>
                <div className="file-upload flex items-center justify-center w-full">
                  <label
                    htmlFor="receipt"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-500 dark:hover:bg-gray-600"
                  >
                    <div
                      className="flex flex-col items-center justify-center pt-5 pb-6"
                    >
                      {/* <i
                        className="fas fa-camera text-gray-400 dark:text-gray-800 text-2xl mb-2"
                      ></i> */}
                      <FontAwesomeIcon icon={'camera'} className='text-gray-400 dark:text-gray-800 text-2xl mb-2' />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-800">
                        <span className="font-semibold">Click to upload</span> or drag
                        and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-800">
                        PNG, JPG (MAX. 2MB)
                      </p>
                    </div>
                    <input
                      id="receipt"
                      type="file"
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              {/* <!-- Recurring Toggle --> */}
              <div className="flex items-center mb-6">
                <label onChange={() => setChecked(prev => !prev)} className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div
                    className="w-11 h-6 bg-gray-400 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer toggle-bg"
                  ></div>
                  <span
                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-400"
                  >Recurring Transaction</span>
                </label>
              </div>

              {/* <!-- Recurring Options (Hidden by default) --> */}
              <div id="recurringOptions" className={`${!checked && 'hidden'} mb-6`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="frequency"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                    >Frequency</label>
                    <select
                      id="frequency"
                      className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                    >End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <label onChange={() => setChecked(prev => !prev)} className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div
                    className="w-11 h-6 bg-gray-400 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer toggle-bg"
                  ></div>
                  <span
                    className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-400"
                  >Out-Of-Budget Funding</span>
                </label>
              </div>

              {/* <!-- Voice Input Button --> */}
              {/* <div className="flex justify-center mb-6">
                <button
                  type="button"
                  id="voiceBtn"
                  className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-full text-sm p-4 text-center inline-flex items-center"
                >
                  <FontAwesomeIcon icon={'microphone'} className='text-xl' />
                  <span className="sr-only">Voice Input</span>
                </button>
              </div> */}

              {/* <!-- Submit Button --> */}
              {/* <button
                type="submit"
                className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Add Transaction
              </button> */}
              {/* <CheckoutButton orderId={'12345'} totalAmount={'2000'} customerEmail={'toluwaniomotoyosi17@gmail.com'} /> */}
              <FundWalletButton />
            </form>
          </div>
        </main>
      </div>
    </>
  )
}

// const AddTransactionPage = () => {

  
// }

// export default AddTransactionPage