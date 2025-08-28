'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import MainNavigation from '../components/MainNavigation'
import ToggleSwitch from '../components/ToggleSwitch'
import AccountLinking from '../components/AccountLinking'
import SessionInfoCard from '../components/SessionInfoCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../../lib/fontawesome'
import SignOutButton from '../components/SignOutButton';
import Image from 'next/image'

export default function SettingsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            {/* Left Column - Profile & Security */}
            <div className="lg:col-span-2 space-y-6">

              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'user-circle'} className='mr-2 text-primary' />
                    Profile Settings
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FontAwesomeIcon icon={'user'} className='text-gray-500 dark:text-gray-400 text-2xl' />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {session.user?.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.user?.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 capitalize">
                        {session.user.provider === 'dual' ? 'Google + Email/Password' :
                          session.user.provider === 'google' ? 'Google OAuth' :
                            'Email/Password'} Account
                      </p>
                    </div>
                    <button className="ml-auto text-primary dark:text-primary-light text-sm font-medium">
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Display Name
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.user?.name}
                        </p>
                      </div>
                      <button className="text-primary dark:text-primary-light text-sm font-medium">
                        Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.user?.email}
                        </p>
                      </div>
                      <button className="text-primary dark:text-primary-light text-sm font-medium">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Phone Number
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +234 810 123 4567
                        </p>
                      </div>
                      <button className="text-primary dark:text-primary-light text-sm font-medium">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authentication Methods */}
              <AccountLinking />

              {/* Enhanced Security Settings */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'shield-alt'} className='mr-2 text-primary' />
                    Security Settings
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        App Lock
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require PIN or biometric to open app
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Biometric Login
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Change PIN
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update your 4-digit security PIN
                      </p>
                    </div>
                    <button className="text-primary dark:text-primary-light text-sm font-medium">
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>
                </div>
              </div>

              {/* Bank Connections */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'university'} className='mr-2 text-primary' />
                    Bank Connections
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Connected accounts (3)
                    </p>
                    <button className="text-primary dark:text-primary-light text-sm font-medium flex items-center">
                      <FontAwesomeIcon icon={'plus'} className='mr-1' /> Add Account
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <FontAwesomeIcon icon={'university'} className='text-blue-500 dark:text-blue-400' />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Guaranty Trust Bank
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ****1234 • Savings
                        </p>
                      </div>
                      <button className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <FontAwesomeIcon icon={'ellipsis-v'} />
                      </button>
                    </div>

                    <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                        <FontAwesomeIcon icon={'university'} className='text-green-500 dark:text-green-400' />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          First Bank of Nigeria
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ****5678 • Current
                        </p>
                      </div>
                      <button className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <FontAwesomeIcon icon={'ellipsis-v'} />
                      </button>
                    </div>

                    <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                        <FontAwesomeIcon icon={'university'} className='text-purple-500 dark:text-purple-400' />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Zenith Bank
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ****9012 • Savings
                        </p>
                      </div>
                      <button className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <FontAwesomeIcon icon={'ellipsis-v'} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Session Info & Notifications */}
            <div className="space-y-6">

              {/* Session Information */}
              <SessionInfoCard />

              {/* Simplified Preferences */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'cog'} className='mr-2 text-primary' />
                    Preferences
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Currency
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>₦</span>
                      <span>Nigerian Naira (NGN)</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Date Format
                    </p>
                    <select className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Dark Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>

                  <SignOutButton />
                </div>
              </div>

              {/* Finance-focused Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'bell'} className='mr-2 text-primary' />
                    Notifications
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Transaction Alerts
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Notify me for all transactions
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Budget Alerts
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Alert when approaching budget limits
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Weekly Summary
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Weekly spending summary emails
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Goal Reminders
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Progress updates on savings goals
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        AI Insights
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Smart financial recommendations
                      </p>
                    </div>
                    <ToggleSwitch />
                  </div>
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