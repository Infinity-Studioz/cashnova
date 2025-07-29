'use client'

import MainNavigation from '@/app/components/MainNavigation'
import '../../../lib/fontawesome'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import DayDetailsModal from '@/app/components/DayDetailsModal'
import { useState } from 'react'

const BudgetCalendarPage = () => {
  const [isModalOpen, setModalOpen] = useState(false)

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
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
            >Budget Alerts & Reminders</Link>
            <Link
              href="/budget-planner/screen-5"
              className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
            >Budget Calendar</Link>
          </nav>

          {/* <!-- Page Header --> */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Budget Calendar</h2>
              <p className="text-slate-500 dark:text-slate-400">Visualize your budget impact day-by-day</p>
            </div>
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center"
              >
                {/* <i className="fas fa-filter mr-2"></i> Filter */}
                <FontAwesomeIcon icon={'filter'} className='mr-2' /> Filter
              </button>
              <button
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition flex items-center"
              >
                {/* <i className="fas fa-calendar-plus mr-2"></i> Add Event */}
                <FontAwesomeIcon icon={'calendar-plus'} className='mr-2' /> Add Event
              </button>
            </div>
          </div>

          {/* <!-- Calendar Controls --> */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-between">
              <button className="p-2 rounded-full hover:bg-slate-100 transition">
                {/* <i className="fas fa-chevron-left text-slate-500"></i> */}
                <FontAwesomeIcon icon={'chevron-left'} className='text-slate-500' />
              </button>
              <div className="text-center">
                <h3 className="font-semibold text-lg">November 2023</h3>
                <p className="text-sm text-slate-500">
                  Monthly Budget: ₦85,000 / ₦120,000
                </p>
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100 transition">
                {/* <i className="fas fa-chevron-right text-slate-500"></i> */}
                <FontAwesomeIcon icon={'chevron-right'} className='text-slate-500' />
              </button>
            </div>

            <div
              className="mt-4 grid grid-cols-7 gap-1 text-center text-sm font-medium text-slate-500"
            >
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
          </div>

          {/* <!-- Calendar Grid --> */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {/* <!-- Empty days (October) --> */}
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 opacity-50"
            >
              <div className="text-right text-slate-400">29</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 opacity-50"
            >
              <div className="text-right text-slate-400">30</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 opacity-50"
            >
              <div className="text-right text-slate-400">31</div>
            </div>

            {/* <!-- November Days --> */}
            <div
              onClick={() => setModalOpen(true)}
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">1</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-green-500"></span>
                  <span>Salary</span>
                </div>
                <div className="spending-bar bg-green-500 w-full rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2"
            >
              <div className="text-right">2</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">3</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦8,200</span>
                </div>
                <div className="spending-bar bg-red-500 w-3/4 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">4</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦5,400</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/2 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">5</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦12,750</span>
                </div>
                <div className="spending-bar bg-red-500 w-full rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2"
            >
              <div className="text-right">6</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2"
            >
              <div className="text-right">7</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">8</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦4,200</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/3 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">9</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦7,800</span>
                </div>
                <div className="spending-bar bg-red-500 w-2/3 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">10</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦3,500</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/4 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">11</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦6,200</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/2 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">12</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦9,500</span>
                </div>
                <div className="spending-bar bg-red-500 w-3/4 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2"
            >
              <div className="text-right">13</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">14</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦4,800</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/3 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries bill-due"
            >
              <div className="text-right">15</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <i className="fas fa-file-invoice-dollar mr-1"></i>
                  <span>Rent Due</span>
                </div>
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦45,000</span>
                </div>
                <div className="spending-bar bg-red-500 w-full rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">16</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦5,200</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/3 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">17</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦7,500</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/2 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">18</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦3,800</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/4 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2"
            >
              <div className="text-right">19</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">20</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦6,700</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/2 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries bill-due"
            >
              <div className="text-right">21</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  {/* <i className="fas fa-bolt mr-1"></i> */}
                  <FontAwesomeIcon icon={'bolt'} className='mr-1' />
                  <span>Electricity</span>
                </div>
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦8,500</span>
                </div>
                <div className="spending-bar bg-red-500 w-2/3 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">22</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦4,200</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/3 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">23</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦5,800</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/2 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries budget-milestone"
            >
              <div className="text-right">24</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  {/* <i className="fas fa-bullseye mr-1"></i> */}
                  <FontAwesomeIcon icon={'bullseye'} className='mr-1' />
                  <span>75% Budget</span>
                </div>
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦90,000</span>
                </div>
                <div className="spending-bar bg-red-500 w-full rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2"
            >
              <div className="text-right">25</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">26</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦7,200</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/2 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries bill-due"
            >
              <div className="text-right">27</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  {/* <i className="fas fa-wifi mr-1"></i> */}
                  <FontAwesomeIcon icon={'wifi'} className='mr-1' />
                  <span>Internet</span>
                </div>
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦15,000</span>
                </div>
                <div className="spending-bar bg-red-500 w-full rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">28</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦4,500</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/3 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">29</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦6,800</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/2 rounded-full"></div>
              </div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 has-entries"
            >
              <div className="text-right">30</div>
              <div className="mt-1">
                <div className="flex items-center text-xs mb-1">
                  <span className="entry-dot bg-red-500"></span>
                  <span>₦3,200</span>
                </div>
                <div className="spending-bar bg-red-500 w-1/4 rounded-full"></div>
              </div>
            </div>

            {/* <!-- Empty days (December) --> */}
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 opacity-50"
            >
              <div className="text-right text-slate-400">1</div>
            </div>
            <div
              className="calendar-day bg-white rounded-lg border border-slate-100 p-2 opacity-50"
            >
              <div className="text-right text-slate-400">2</div>
            </div>
          </div>

          {/* <!-- Budget Summary --> */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">November Budget Summary</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* <!-- Total Spending --> */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-slate-500">Total Spending</p>
                    <p className="text-2xl font-bold">₦85,000</p>
                  </div>
                  <div
                    className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {/* <i className="fas fa-arrow-up mr-1"></i> 12% from Oct */}
                    <FontAwesomeIcon icon={'arrow-up'} className='mr-1' /> 12% from Oct
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    // style="width: 71%"
                    style={{
                      width: '71%'
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  ₦35,000 remaining of ₦120,000 budget
                </p>
              </div>

              {/* <!-- Highest Spending Day --> */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-slate-500">Highest Spending Day</p>
                    <p className="text-2xl font-bold">Nov 15</p>
                  </div>
                  <div
                    className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {/* <i className="fas fa-home mr-1"></i> Rent */}
                    <FontAwesomeIcon icon={'home'} className='mr-1' /> Rent
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-3xl text-red-500 mr-3">
                    {/* <i className="fas fa-arrow-trend-up"></i> */}
                    <FontAwesomeIcon icon={'arrow-trend-up'} />
                  </div>
                  <div>
                    <p className="font-medium">₦45,000</p>
                    <p className="text-xs text-slate-500">37.5% of monthly budget</p>
                  </div>
                </div>
              </div>

              {/* <!-- Upcoming Bills --> */}
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm text-slate-500">Upcoming Bills</p>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2"
                      >
                        {/* <i className="fas fa-wifi text-xs"></i> */}
                        <FontAwesomeIcon icon={'wifi'} className='text-xs' />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Internet</p>
                        <p className="text-xs text-slate-500">Due Nov 27</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">₦15,000</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2"
                      >
                        {/* <i className="fas fa-mobile-alt text-xs"></i> */}
                        <FontAwesomeIcon icon={'mobile-alt'} className='text-xs' />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Mobile</p>
                        <p className="text-xs text-slate-500">Due Dec 5</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">₦8,500</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Day Details Modal (Hidden by default) --> */}
          <DayDetailsModal
            visible={isModalOpen}
            onClose={() => setModalOpen(false)}
            date="November 15"
            totalSpent={45000}
            percentageUsed={37.5}
            transactions={[
              {
                title: 'Rent Payment',
                subtitle: 'Apartment',
                amount: 45000,
                icon: 'home',
                category: 'Housing',
                method: 'Recurring monthly',
              },
              {
                title: 'Dinner Out',
                subtitle: 'Italian Restaurant',
                amount: 8500,
                icon: 'utensils',
                category: 'Dining',
                method: 'Credit Card •••• 4582',
              },
              {
                title: 'Taxi Rides',
                subtitle: 'Uber & Bolt',
                amount: 6200,
                icon: 'taxi',
                category: 'Transport',
                method: 'Mobile Payment',
              },
              // ...other entries
            ]}
            onAddTransaction={() => console.log('Open add transaction form')}
          />

          {/* <div
            id="dayModal"
            className="modal modal-hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div
              className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">November 15 Details</h3>
                  <button
                    id="closeModal"
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <FontAwesomeIcon icon={'times'} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Total Spent:</p>
                    <p className="text-xl font-bold text-red-600">₦45,000</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: '37.5%'
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">37.5% of monthly budget</p>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2"
                        >
                          <FontAwesomeIcon icon={'home'} />
                        </div>
                        <div>
                          <p className="font-medium">Rent Payment</p>
                          <p className="text-xs text-slate-500">Apartment</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">-₦45,000</p>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-2">
                      <i className="fas fa-tags mr-2"></i>
                      <span className="bg-slate-100 px-2 py-1 rounded-full mr-2"
                      >Housing</span>
                      <FontAwesomeIcon icon={'calendar'} className='mr-2' />
                      <span>Recurring monthly</span>
                    </div>
                  </div>

                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2"
                        >
                          <FontAwesomeIcon icon={'utensils'} />
                        </div>
                        <div>
                          <p className="font-medium">Dinner Out</p>
                          <p className="text-xs text-slate-500">Italian Restaurant</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">-₦8,500</p>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-2">
                      <FontAwesomeIcon icon={'tags'} className='mr-2' />
                      <span className="bg-slate-100 px-2 py-1 rounded-full mr-2"
                      >Dining</span>
                      <FontAwesomeIcon icon={'credit-card'} className='mr-2' />
                      <span>Credit Card •••• 4582</span>
                    </div>
                  </div>

                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2"
                        >
                          <FontAwesomeIcon icon={'taxi'} />
                        </div>
                        <div>
                          <p className="font-medium">Taxi Rides</p>
                          <p className="text-xs text-slate-500">Uber & Bolt</p>
                        </div>
                      </div>
                      <p className="font-medium text-red-600">-₦6,200</p>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 mt-2">
                      <FontAwesomeIcon icon={'tags'} className='mr-2' />
                      <span className="bg-slate-100 px-2 py-1 rounded-full mr-2"
                      >Transport</span>
                      <FontAwesomeIcon icon={'mobile-alt'} className='mr-2' />
                      <span>Mobile Payment</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    <FontAwesomeIcon icon={'plus'} className='mr-2' /> Add Transaction
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default BudgetCalendarPage