'use client'
// import Image from 'next/image'
import { useState, } from 'react'
import MainNavigation from '../components/MainNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../lib/fontawesome'
import NewGoalModal from '../components/NewGoalModal';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AuthButtons from "../components/AuthButtons";

const SmartGoalsPage = () => {
  const [selectedOption, setSelectedOption] = useState("Active Goals");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <>
    <div>Please sign in to create your budget goals</div>
    <AuthButtons />
  </>;

  return (
    <>
      <div className="min-h-screen">
        <MainNavigation />
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Smart Goals
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and track personalized savings or budgeting goals
              </p>
            </div>

            <div className="flex space-x-2">
              <Link href="/budget-planner/screen-1">
                <button
                  className="text-primary bg-white hover:bg-gray-100 border border-primary dark:bg-gray-200 dark:text-primary dark:hover:bg-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FontAwesomeIcon icon={"robot"} className='text-primary' />&nbsp; AI Budget Assistant
                </button>
              </Link>
              <button
                id="newGoalBtn"
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
              >
                {/* <i className="fas fa-plus mr-2"></i> New Goal */}
                <FontAwesomeIcon icon={'plus'} className='mr-2' /> New Goal
              </button>
            </div>
          </div>

          {/* <!-- AI Suggestions Section --> */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 dark:bg-gray-800">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <div
                  className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"
                >
                  {/* <i className="fas fa-robot text-purple-600"></i> */}
                  <FontAwesomeIcon icon={'robot'} className='text-purple-600' />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  AI Goal Suggestions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Based on your spending patterns and savings rate
                </p>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* <!-- Suggestion 1 --> */}
                  <div
                    className="border border-gray-200 rounded-lg p-4 dark:border-gray-500"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-200">
                          Emergency Fund
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          3 months of expenses
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full"
                      >Recommended</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-300"
                        >Target:</span>
                        <span className="font-medium dark:text-white">₦600,000</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500 dark:text-gray-300"
                        >Timeframe:</span>
                        <span className="font-medium dark:text-white">12 months</span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        className="text-xs bg-primary text-white px-3 py-1 rounded-md"
                      >
                        Create Goal
                      </button>
                      <button
                        className="text-xs border border-gray-300 text-gray-700 dark:border-gray-500 dark:text-gray-200 px-3 py-1 rounded-md"
                      >
                        Customize
                      </button>
                    </div>
                  </div>

                  {/* <!-- Suggestion 2 --> */}
                  <div
                    className="border border-gray-200 dark:border-gray-500 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-200">
                          Vacation Fund
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Trip to Maldives
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >New</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-300"
                        >Target:</span>
                        <span className="font-medium dark:text-white">₦350,000</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500 dark:text-gray-300"
                        >Timeframe:</span>
                        <span className="font-medium dark:text-white">6 months</span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        className="text-xs bg-primary text-white px-3 py-1 rounded-md"
                      >
                        Create Goal
                      </button>
                      <button
                        className="text-xs border border-gray-300 text-gray-700 dark:border-gray-500 dark:text-gray-200 px-3 py-1 rounded-md"
                      >
                        Customize
                      </button>
                    </div>
                  </div>

                  {/* <!-- Suggestion 3 --> */}
                  <div
                    className="border border-gray-200 dark:border-gray-500 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-200">
                          Car Down Payment
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Toyota Camry 2023
                        </p>
                      </div>
                      <span
                        className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                      >Adjustment</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-300"
                        >Target:</span>
                        <span className="font-medium dark:text-white"
                        >₦1,200,000</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-gray-500 dark:text-gray-300"
                        >Timeframe:</span>
                        <span className="font-medium dark:text-white">18 months</span>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        className="text-xs bg-primary text-white px-3 py-1 rounded-md"
                      >
                        Create Goal
                      </button>
                      <button
                        className="text-xs border border-gray-300 text-gray-700 dark:border-gray-500 dark:text-gray-200 px-3 py-1 rounded-md"
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Goals Filter --> */}
          <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 mb-6">
            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  Your Goals
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Track your progress towards financial milestones
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* <select
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm"
                  >
                  <option>All Goals</option>
                  <option selected>Active Goals</option>
                  <option>Completed Goals</option>
                  <option>Behind Schedule</option>
                  </select> */}
                <select
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm"
                >
                  <option>All Goals</option>
                  <option>Active Goals</option>
                  <option>Completed Goals</option>
                  <option>Behind Schedule</option>
                </select>

                <button
                  className="border border-gray-300 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md text-sm"
                >
                  {/* <i className="fas fa-sliders-h"></i> */}
                  <FontAwesomeIcon icon={'sliders-h'} />
                </button>
              </div>
            </div>
          </div>

          {/* <!-- Goals Grid --> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* <!-- Goal 1 --> */}
            <div
              className="goal-card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"
                    >
                      {/* <i className="fas fa-home text-blue-600 text-xl"></i> */}
                      <FontAwesomeIcon icon={'home'} className='text-blue-600 text-xl' />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        House Down Payment
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        Due: Dec 2024
                      </p>
                    </div>
                  </div>
                  <div className="dropdown relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
                    >
                      {/* <i className="fas fa-ellipsis-v"></i> */}
                      <FontAwesomeIcon icon={'ellipsis-v'} />
                    </button>
                    <div
                      className="dropdown-menu absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 hidden"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Edit</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Add Funds</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >Delete</a>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-300">Saved:</span>
                    <span className="font-medium dark:text-gray-100"
                    >₦1,250,000 of ₦5,000,000</span
                    >
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-blue-500"
                      // style="width: 25%"
                      style={{
                        width: '25%'
                      }}
                    ></div>
                  </div>
                  <div
                    className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1"
                  >
                    <span>25% complete</span>
                    <span>18 months remaining</span>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {/* <i className="fas fa-check-circle text-blue-500"></i> */}
                      <FontAwesomeIcon icon={'check-circle'} className='text-blue-500' />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-blue-800">
                        Milestone: You&apos;ve saved 25% of your target!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:bg-gray-700 dark:border-gray-500"
              >
                <span className="text-xs text-gray-500 dark:text-gray-300"
                >Created: Jan 15, 2023</span>
                <button
                  className="text-xs bg-white border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white dark:bg-gray-200 dark:hover:bg-primary dark:hover:text-white"
                >
                  Add Funds
                </button>
              </div>
            </div>

            {/* <!-- Goal 2 --> */}
            <div
              className="goal-card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"
                    >
                      {/* <i className="fas fa-umbrella-beach text-green-600 text-xl"></i> */}
                      <FontAwesomeIcon icon={'umbrella-beach'} className='text-green-600 text-xl' />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        Summer Vacation
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        Due: Jun 2023
                      </p>
                    </div>
                  </div>
                  <div className="dropdown relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
                    >
                      {/* <i className="fas fa-ellipsis-v"></i> */}
                      <FontAwesomeIcon icon={'ellipsis-v'} />
                    </button>
                    <div
                      className="dropdown-menu absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 hidden"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Edit</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Add Funds</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >Delete</a>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-300">Saved:</span>
                    <span className="font-medium dark:text-gray-100"
                    >₦120,000 of ₦150,000</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-green-500"
                      // style="width: 80%"
                      style={{
                        width: '80%'
                      }}
                    ></div>
                  </div>
                  <div
                    className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1"
                  >
                    <span>80% complete</span>
                    <span>2 months remaining</span>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {/* <i className="fas fa-exclamation-circle text-yellow-500"></i> */}
                      <FontAwesomeIcon icon={'exclamation-circle'} className='text-yellow-500' />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-yellow-800">
                        AI Suggestion: Increase goal to ₦200k for better
                        experience
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:bg-gray-700 dark:border-gray-500"
              >
                <span className="text-xs text-gray-500 dark:text-gray-300"
                >Created: Nov 10, 2022</span
                >
                <button
                  className="text-xs bg-white border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white dark:bg-gray-200 dark:hover:bg-primary dark:hover:text-white"
                >
                  Add Funds
                </button>
              </div>
            </div>

            {/* <!-- Goal 3 --> */}
            <div
              className="goal-card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center"
                    >
                      {/* <i className="fas fa-car text-purple-600 text-xl"></i> */}
                      <FontAwesomeIcon icon={'car'} className='text-purple-600 text-xl' />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        New Car Fund
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        Due: Mar 2024
                      </p>
                    </div>
                  </div>
                  <div className="dropdown relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
                    >
                      {/* <i className="fas fa-ellipsis-v"></i> */}
                      <FontAwesomeIcon icon={'ellipsis-v'} />
                    </button>
                    <div
                      className="dropdown-menu absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 hidden"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Edit</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Add Funds</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >Delete</a>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-300">Saved:</span>
                    <span className="font-medium dark:text-gray-100"
                    >₦750,000 of ₦2,500,000</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-purple-500"
                      // style="width: 30%"
                      style={{
                        width: '30%'
                      }}
                    ></div>
                  </div>
                  <div
                    className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1"
                  >
                    <span>30% complete</span>
                    <span>12 months remaining</span>
                  </div>
                </div>

                <div className="mt-4 bg-green-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {/* <i className="fas fa-bolt text-green-500"></i> */}
                      <FontAwesomeIcon icon={'bolt'} className='text-green-500' />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-green-800">
                        On track! You&apos;re saving ₦62,500/month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:bg-gray-700 dark:border-gray-500"
              >
                <span className="text-xs text-gray-500 dark:text-gray-300"
                >Created: Jul 5, 2022</span>
                <button
                  className="text-xs bg-white border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white dark:bg-gray-200 dark:hover:bg-primary dark:hover:text-white"
                >
                  Add Funds
                </button>
              </div>
            </div>

            {/* <!-- Goal 4 --> */}
            <div
              className="goal-card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center"
                    >
                      {/* <i className="fas fa-heart text-red-600 text-xl"></i> */}
                      <FontAwesomeIcon icon={'heart'} className='text-red-600 text-xl' />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        Wedding Fund
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        Due: Oct 2023
                      </p>
                    </div>
                  </div>
                  <div className="dropdown relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
                    >
                      {/* <i className="fas fa-ellipsis-v"></i> */}
                      <FontAwesomeIcon icon={'ellipsis-v'} />
                    </button>
                    <div
                      className="dropdown-menu absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 hidden"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Edit</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Add Funds</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >Delete</a>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-300">Saved:</span>
                    <span className="font-medium dark:text-gray-100"
                    >₦1,800,000 of ₦2,000,000</span
                    >
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-red-500"
                      // style="width: 90%"
                      style={{
                        width: '90%'
                      }}
                    ></div>
                  </div>
                  <div
                    className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1"
                  >
                    <span>90% complete</span>
                    <span>4 months remaining</span>
                  </div>
                </div>

                <div className="mt-4 bg-purple-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {/* <i className="fas fa-gem text-purple-500"></i> */}
                      <FontAwesomeIcon icon={'gem'} className='text-purple-500' />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-purple-800">
                        Almost there! Just ₦200k left to reach your goal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:bg-gray-700 dark:border-gray-500"
              >
                <span className="text-xs text-gray-500 dark:text-gray-300"
                >Created: Feb 28, 2022</span>
                <button
                  className="text-xs bg-white border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white dark:bg-gray-200 dark:hover:bg-primary dark:hover:text-white"
                >
                  Add Funds
                </button>
              </div>
            </div>

            {/* <!-- Goal 5 --> */}
            <div
              className="goal-card bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center"
                    >
                      {/* <i
                        className="fas fa-graduation-cap text-yellow-600 text-xl"
                      ></i> */}
                      <FontAwesomeIcon icon={'graduation-cap'} className='text-yellow-600 text-xl' />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        Education Fund
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        Due: Aug 2025
                      </p>
                    </div>
                  </div>
                  <div className="dropdown relative">
                    <button
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
                    >
                      {/* <i className="fas fa-ellipsis-v"></i> */}
                      <FontAwesomeIcon icon={'ellipsis-v'} />
                    </button>
                    <div
                      className="dropdown-menu absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 hidden"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Edit</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >Add Funds</a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >Delete</a>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 dark:text-gray-300">Saved:</span>
                    <span className="font-medium dark:text-gray-100"
                    >₦300,000 of ₦1,500,000</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-yellow-500"
                      // style="width: 20%"
                      style={{
                        width: '20%'
                      }}
                    ></div>
                  </div>
                  <div
                    className="flex justify-between text-xs text-gray-500 dark:text-gray-300 mt-1"
                  >
                    <span>20% complete</span>
                    <span>28 months remaining</span>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      {/* <i className="fas fa-info-circle text-blue-500"></i> */}
                      <FontAwesomeIcon icon={'info-circle'} className='text-blue-500' />
                    </div>
                    <div className="ml-2">
                      <p className="text-xs text-blue-800">
                        AI Suggestion: Consider investing part of this fund
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:bg-gray-700 dark:border-gray-500"
              >
                <span className="text-xs text-gray-500 dark:text-gray-300"
                >Created: May 15, 2022</span
                >
                <button
                  className="text-xs bg-white border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white dark:bg-gray-200 dark:hover:bg-primary dark:hover:text-white"
                >
                  Add Funds
                </button>
              </div>
            </div>

            {/* <!-- Add New Goal Card --> */}
            <div
              className="goal-card bg-white rounded-lg shadow-sm overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary dark:hover:border-primary dark:border-gray-500 dark:bg-gray-800 flex items-center justify-center min-h-[300px] cursor-pointer"
              // id="addNewGoalBtn"
              onClick={() => setIsModalOpen(true)}
            >
              <div className="text-center p-6">
                <div
                  className="w-12 h-12 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-80 dark:bg-gray-50 flex items-center justify-center mx-auto mb-3"
                >
                  {/* <i className="fas fa-plus text-primary text-xl"></i> */}
                  <FontAwesomeIcon icon={'plus'} className='text-primary text-xl' />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-200">
                  Create New Goal
                </h3>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                  Start saving for your dreams
                </p>
              </div>
            </div>
          </div>
        </main>
        {/* <!-- New Goal Modal --> */}
        <NewGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default SmartGoalsPage