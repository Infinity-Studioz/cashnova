// src/app/budget-planner/screen-4/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainNavigation from '@/app/components/MainNavigation'
import '../../../lib/fontawesome'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ToggleSwitch from '@/app/components/ToggleSwitch'

interface AlertSettings {
  categoryThreshold: {
    enabled: boolean;
    percentage: number;
    specificCategory?: string;
  };
  budgetExceeded: {
    enabled: boolean;
    percentage: number;
  };
  weeklySummary: {
    enabled: boolean;
    day: string;
    time: string;
  };
  customAlerts: Array<{
    id: string;
    enabled: boolean;
    category: string;
    condition: string;
    threshold: number;
    isPercentage: boolean;
    notificationTiming: string;
  }>;
  notificationPreferences: {
    pushNotifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    inAppNotifications: boolean;
  };
  nigerianContext: {
    salaryDayReminders: boolean;
    schoolFeeAlerts: boolean;
    festiveSeasonWarnings: boolean;
    transportPriceAlerts: boolean;
  };
}

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'dismissed' | 'acted_upon';
  data?: any;
  createdAt: string;
}

const BudgetAlertsPage = () => {
  const [alertSettings, setAlertSettings] = useState<AlertSettings | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nigerian categories for dropdowns
  const nigerianCategories = [
    'All Categories',
    'Food & Dining',
    'Transport',
    'Bills',
    'Shopping',
    'Entertainment',
    'School Fees',
    'Church/Mosque',
    'Family Support',
    'Health/Medical',
    'Rent/Housing',
    'Other Expenses'
  ];

  useEffect(() => {
    fetchAlertSettings();
    fetchNotifications();
  }, []);

  const fetchAlertSettings = async () => {
    try {
      const response = await fetch('/api/alert-settings');
      const data = await response.json();

      if (data.success) {
        setAlertSettings(data.alertSettings);
      } else {
        throw new Error(data.error || 'Failed to fetch alert settings');
      }
    } catch (err: any) {
      console.error('Error fetching alert settings:', err);
      setError(err.message);
      toast.error('Failed to load alert settings');
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10&status=unread');
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      } else {
        throw new Error(data.error || 'Failed to fetch notifications');
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      // Don't show error for notifications, just log it
    } finally {
      setLoading(false);
    }
  };

  const saveAlertSettings = async () => {
    if (!alertSettings) return;

    setSaving(true);
    try {
      const response = await fetch('/api/alert-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertSettings),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Alert settings saved successfully!');
        setAlertSettings(data.alertSettings);
      } else {
        throw new Error(data.error || 'Failed to save alert settings');
      }
    } catch (err: any) {
      console.error('Error saving alert settings:', err);
      toast.error('Failed to save alert settings');
    } finally {
      setSaving(false);
    }
  };

  const generateAlerts = async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'generate_alerts' }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Generated ${data.notifications.length} new alerts!`);
        fetchNotifications(); // Refresh notifications
      } else {
        throw new Error(data.error || 'Failed to generate alerts');
      }
    } catch (err: any) {
      console.error('Error generating alerts:', err);
      toast.error('Failed to generate alerts');
    }
  };

  const updateAlertSetting = (section: string, field: string, value: any) => {
    if (!alertSettings) return;

    setAlertSettings({
      ...alertSettings,
      [section]: {
        ...alertSettings[section as keyof AlertSettings],
        [field]: value
      }
    });
  };

  const updateNotificationPreference = (field: string, value: boolean) => {
    if (!alertSettings) return;

    setAlertSettings({
      ...alertSettings,
      notificationPreferences: {
        ...alertSettings.notificationPreferences,
        [field]: value
      }
    });
  };

  const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'category_threshold': return 'percent';
      case 'budget_exceeded': return 'exclamation-triangle';
      case 'weekly_summary': return 'envelope-open-text';
      case 'salary_reminder': return 'money-bill-wave';
      case 'school_fee_alert': return 'graduation-cap';
      case 'savings_tip': return 'lightbulb';
      default: return 'bell';
    }
  };

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
        <br /><br /><br /><br />
      </>
    )
  }

  if (error || !alertSettings) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error || 'Failed to load alert settings'}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation */}
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

          {/* Page Header */}
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
                onClick={generateAlerts}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center"
              >
                <FontAwesomeIcon icon={'sync'} className='mr-2' /> Generate Alerts
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
              >
                <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
              </button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alert Settings Column */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg dark:text-slate-300 font-semibold mb-6">Alert Settings</h3>

              {/* Category Threshold Alert */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={'percent'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Category Threshold</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get notified when a category reaches a certain percentage
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={alertSettings.categoryThreshold.enabled}
                    onChange={(checked) => updateAlertSetting('categoryThreshold', 'enabled', checked)}
                  />
                </div>

                <div className="mt-4 pl-13">
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm dark:text-slate-300">Alert me when any category hits</span>
                    <div className="relative">
                      <select
                        value={alertSettings.categoryThreshold.percentage}
                        onChange={(e) => updateAlertSetting('categoryThreshold', 'percentage', parseInt(e.target.value))}
                        className="category-selector bg-white border border-slate-200 text-slate-700 dark:bg-gray-600 dark:text-white dark:border-slate-400 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-20 px-3 py-1"
                      >
                        <option value={70}>70%</option>
                        <option value={75}>75%</option>
                        <option value={80}>80%</option>
                        <option value={85}>85%</option>
                        <option value={90}>90%</option>
                        <option value={95}>95%</option>
                      </select>
                    </div>
                    <span className="text-sm dark:text-slate-300">of budget</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm dark:text-slate-300">Or specific category:</span>
                    <div className="relative">
                      <select
                        value={alertSettings.categoryThreshold.specificCategory || 'All Categories'}
                        onChange={(e) => updateAlertSetting('categoryThreshold', 'specificCategory', e.target.value === 'All Categories' ? null : e.target.value)}
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-40 px-3 py-1"
                      >
                        {nigerianCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Exceeded Alert */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={'exclamation-triangle'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Budget Exceeded</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get notified when you exceed your overall budget
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={alertSettings.budgetExceeded.enabled}
                    onChange={(checked) => updateAlertSetting('budgetExceeded', 'enabled', checked)}
                  />
                </div>

                <div className="mt-4 pl-13">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm dark:text-slate-300">Alert me when I exceed my overall budget by</span>
                    <div className="relative">
                      <select
                        value={alertSettings.budgetExceeded.percentage}
                        onChange={(e) => updateAlertSetting('budgetExceeded', 'percentage', parseInt(e.target.value))}
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-20 px-3 py-1"
                      >
                        <option value={5}>5%</option>
                        <option value={10}>10%</option>
                        <option value={15}>15%</option>
                        <option value={20}>20%</option>
                        <option value={25}>25%</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Summary Alert */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={'calendar-week'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Weekly Summary</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Get a weekly spending summary
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={alertSettings.weeklySummary.enabled}
                    onChange={(checked) => updateAlertSetting('weeklySummary', 'enabled', checked)}
                  />
                </div>

                <div className="mt-4 pl-13">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm dark:text-slate-300">Send me a weekly summary every</span>
                    <div className="relative">
                      <select
                        value={alertSettings.weeklySummary.day}
                        onChange={(e) => updateAlertSetting('weeklySummary', 'day', e.target.value)}
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-28 px-3 py-1"
                      >
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                    </div>
                    <span className="text-sm dark:text-slate-300">at</span>
                    <div className="relative">
                      <select
                        value={alertSettings.weeklySummary.time}
                        onChange={(e) => updateAlertSetting('weeklySummary', 'time', e.target.value)}
                        className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-24 px-3 py-1"
                      >
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nigerian Context Alerts */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={'flag'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Nigerian Context Alerts</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Alerts tailored for Nigerian financial patterns
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pl-13">
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-slate-300">Salary Day Reminders (25th-28th)</span>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.salaryDayReminders}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'salaryDayReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-slate-300">School Fees Alerts (Jan & Sept)</span>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.schoolFeeAlerts}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'schoolFeeAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-slate-300">Festive Season Warnings</span>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.festiveSeasonWarnings}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'festiveSeasonWarnings', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm dark:text-slate-300">Transport Price Alerts</span>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.transportPriceAlerts}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'transportPriceAlerts', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveAlertSettings}
                  disabled={saving}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={'spinner'} className='animate-spin mr-2' />
                      Saving...
                    </>
                  ) : (
                    'Save Alert Settings'
                  )}
                </button>
              </div>
            </div>

            {/* Notification Previews Column */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg dark:text-slate-300 font-semibold">Recent Notifications</h3>
                <button
                  onClick={fetchNotifications}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Refresh
                </button>
              </div>

              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`notification-preview ${getPriorityColor(notification.priority)} text-white rounded-lg p-4 flex items-start`}
                    >
                      <div
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                        className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
                      >
                        <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm opacity-90">{notification.message}</p>

                        {notification.data?.progressData && (
                          <div className="mt-2">
                            <div
                              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                              className="w-full bg-white bg-opacity-20 rounded-full h-2"
                            >
                              <div
                                className="bg-yellow-300 h-2 rounded-full"
                                style={{ width: `${Math.min(notification.data.progressData.percentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {notification.data?.actions && (
                          <div className="mt-3 flex items-center space-x-3">
                            {notification.data.actions.slice(0, 2).map((action: any, index: number) => (
                              <button
                                key={index}
                                onClick={() => toast.info(`Action "${action.label}" clicked! (Feature coming soon)`)}
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 text-xs opacity-80 flex justify-between">
                          <span>{formatNotificationTime(notification.createdAt)}</span>
                          <span className="capitalize">{notification.priority} priority</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={'bell-slash'} className='text-4xl text-slate-300 mb-4' />
                    <p className="text-slate-500 dark:text-slate-400">No recent notifications</p>
                    <button
                      onClick={generateAlerts}
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Generate new alerts
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h4 className="text-sm dark:text-slate-300 font-medium mb-3">Notification Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.pushNotifications}
                      onChange={(checked) => updateNotificationPreference('pushNotifications', checked)}
                    />
                    <span className="text-sm dark:text-slate-300">Push Notifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.emailAlerts}
                      onChange={(checked) => updateNotificationPreference('emailAlerts', checked)}
                    />
                    <span className="text-sm dark:text-slate-300">Email Alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.smsAlerts}
                      onChange={(checked) => updateNotificationPreference('smsAlerts', checked)}
                    />
                    <span className="text-sm dark:text-slate-300">SMS Alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.inAppNotifications}
                      onChange={(checked) => updateNotificationPreference('inAppNotifications', checked)}
                    />
                    <span className="text-sm dark:text-slate-300">In-App Notifications</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={saveAlertSettings}
                    disabled={saving}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Notification Settings'}
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

export default BudgetAlertsPage;