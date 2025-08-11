// 'use client'
import MainNavigation from '../components/MainNavigation'
import ToggleSwitch from '../components/ToggleSwitch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple, faDropbox, faGoogleDrive } from '@fortawesome/free-brands-svg-icons'
import { getServerSession } from 'next-auth';
import { authOptions } from "@/utils/authOptions";
import { redirect } from 'next/navigation';

import '../../lib/fontawesome'
import SignOutButton from '../components/SignOutButton';

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }
  
  return (
    <>
      <div className="min-h-screen">
        <MainNavigation />
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings & Security
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {/* {session && `Name: ${session.user?.name}`} <br /> */}
                Manage your account preferences and security 
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center"
              >
                <FontAwesomeIcon icon={'shield-alt'} className='mr-2' /> Security Center
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* <!-- Left Column - Profile Settings --> */}
            <div className="lg:col-span-2 space-y-6">
              {/* <!-- Profile Card --> */}
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3
                    className="font-medium text-gray-900 dark:text-white flex items-center"
                  >
                    <FontAwesomeIcon icon={'user-circle'} className='mr-2 text-primary' />
                    Profile Settings
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon={'user'} className='text-gray-500 dark:text-gray-400 text-2xl' />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {/* Toluwani David */}
                        {session.user?.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.user?.email}
                      </p>
                    </div>
                    <button
                      className="ml-auto text-primary dark:text-primary-light text-sm font-medium"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Display Name
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Haibeekay
                        </p>
                      </div>
                      <button
                        className="text-primary dark:text-primary-light text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email Address
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.user?.email}
                        </p>
                      </div>
                      <button
                        className="text-primary dark:text-primary-light text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Phone Number
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +234 810 123 4567
                        </p>
                      </div>
                      <button
                        className="text-primary dark:text-primary-light text-sm font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Security Card --> */}
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3
                    className="font-medium text-gray-900 dark:text-white flex items-center"
                  >
                    <FontAwesomeIcon icon={'shield-alt'} className='mr-2 text-primary' />
                    Security Settings
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        App Lock
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require PIN or biometric to open app
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Biometric Login
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Change PIN
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update your 4-digit security PIN
                      </p>
                    </div>
                    <button
                      className="text-primary dark:text-primary-light text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>
                </div>
              </div>

              {/* <!-- Bank Connections --> */}
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3
                    className="font-medium text-gray-900 dark:text-white flex items-center"
                  >
                    <FontAwesomeIcon icon={'university'} className='mr-2 text-primary' />
                    Bank Connections
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Connected accounts (3)
                    </p>
                    <button
                      className="text-primary dark:text-primary-light text-sm font-medium flex items-center"
                    >
                      <FontAwesomeIcon icon={'plus'} className='mr-1' /> Add Account
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div
                      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div
                        className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={'university'} className='text-blue-500 dark:text-blue-400' />
                      </div>
                      <div className="ml-3">
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Guaranty Trust Bank
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ****1234 • Savings
                        </p>
                      </div>
                      <button
                        className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <FontAwesomeIcon icon={'ellipsis-v'} />
                      </button>
                    </div>

                    <div
                      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div
                        className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={'university'} className='text-green-500 dark:text-green-400' />
                      </div>
                      <div className="ml-3">
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          First Bank of Nigeria
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ****5678 • Current
                        </p>
                      </div>
                      <button
                        className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <FontAwesomeIcon icon={'ellipsis-v'} />
                      </button>
                    </div>

                    <div
                      className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div
                        className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center"
                      >
                        <FontAwesomeIcon icon={'university'} className='text-purple-500 dark:text-purple-400' />
                      </div>
                      <div className="ml-3">
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Zenith Bank
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ****9012 • Savings
                        </p>
                      </div>
                      <button
                        className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <FontAwesomeIcon icon={'ellipsis-v'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Right Column - Preferences --> */}
            <div className="space-y-6">
              {/* <!-- Preferences Card --> */}
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3
                    className="font-medium text-gray-900 dark:text-white flex items-center"
                  >
                    <FontAwesomeIcon icon={'cog'} className='mr-2 text-primary' />
                    Preferences
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div>
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white mb-2"
                    >
                      Currency
                    </p>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option>Nigerian Naira (₦)</option>
                      <option>US Dollar ($)</option>
                      <option>Euro (€)</option>
                      <option>British Pound (£)</option>
                    </select>
                  </div>

                  <div>
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white mb-2"
                    >
                      Language
                    </p>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option>English</option>
                      <option>Yoruba</option>
                      <option>Igbo</option>
                      <option>Hausa</option>
                      <option>French</option>
                    </select>
                  </div>

                  <div>
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white mb-2"
                    >
                      Date Format
                    </p>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Dark Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark theme
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="dark-mode-toggle"
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>

                  <SignOutButton />
                </div>
              </div>

              {/* <!-- Notifications Card --> */}
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3
                    className="font-medium text-gray-900 dark:text-white flex items-center"
                  >
                    <FontAwesomeIcon icon={'bell'} className='mr-2 text-primary' />
                    Notifications
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        App Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        General app notifications
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive email updates
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        SMS Alerts
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get text message alerts
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Transaction Alerts
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Notify me for all transactions
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>
                </div>
              </div>

              {/* <!-- Backup & Sync Card --> */}
              <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200"
              >
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3
                    className="font-medium text-gray-900 dark:text-white flex items-center"
                  >
                    <FontAwesomeIcon icon={'cloud-upload-alt'} className='mr-2 text-primary' />
                    Backup & Sync
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Auto Backup
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically backup your data
                      </p>
                    </div>
                    {/* <label
                      className="relative inline-flex items-center cursor-pointer"
                    >
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
                      ></div>
                    </label> */}
                    <ToggleSwitch />
                  </div>

                  <div>
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white mb-2"
                    >
                      Backup Frequency
                    </p>
                    <select
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                  </div>

                  <div>
                    <p
                      className="text-sm font-medium text-gray-900 dark:text-white mb-2"
                    >
                      Backup Service
                    </p>
                    <div className="space-y-2">
                      <div
                        className="backup-option flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faGoogleDrive} className='text-blue-500 dark:text-blue-400' />
                        </div>
                        <p className="ml-3 text-sm text-gray-900 dark:text-white">
                          Google Drive
                        </p>
                        <FontAwesomeIcon icon={'check-circle'} className='text-green-500 ml-auto hidden' />
                      </div>

                      <div
                        className="backup-option flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faApple} className='text-gray-700 dark:text-gray-300' />
                        </div>
                        <p className="ml-3 text-sm text-gray-900 dark:text-white">
                          iCloud
                        </p>
                        <FontAwesomeIcon icon={'check-circle'} className='text-green-500 ml-auto' />
                      </div>

                      <div
                        className="backup-option flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                      >
                        <div
                          className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center"
                        >
                          <FontAwesomeIcon icon={faDropbox} className='text-blue-500 dark:text-blue-400' />
                        </div>
                        <p className="ml-3 text-sm text-gray-900 dark:text-white">
                          Dropbox
                        </p>
                        <FontAwesomeIcon icon={'check-circle'} className='text-green-500 ml-auto hidden' />
                      </div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg text-sm font-medium"
                  >
                    <FontAwesomeIcon icon={'cloud-upload-alt'} className='mr-2' /> Backup Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <br /><br /><br /><br />
      </div>
    </>
  )
}

export default page