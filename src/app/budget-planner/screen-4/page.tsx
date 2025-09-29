// // src/app/budget-planner/screen-4/page.tsx
// 'use client'

// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import MainNavigation from '@/app/components/MainNavigation'
// import '../../../lib/fontawesome'
// import Link from 'next/link'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import ToggleSwitch from '@/app/components/ToggleSwitch'

// interface AlertSettings {
//   categoryThreshold: {
//     enabled: boolean;
//     percentage: number;
//     specificCategory?: string;
//   };
//   budgetExceeded: {
//     enabled: boolean;
//     percentage: number;
//   };
//   weeklySummary: {
//     enabled: boolean;
//     day: string;
//     time: string;
//   };
//   customAlerts: Array<{
//     id: string;
//     enabled: boolean;
//     category: string;
//     condition: string;
//     threshold: number;
//     isPercentage: boolean;
//     notificationTiming: string;
//   }>;
//   notificationPreferences: {
//     pushNotifications: boolean;
//     emailAlerts: boolean;
//     smsAlerts: boolean;
//     inAppNotifications: boolean;
//   };
//   nigerianContext: {
//     salaryDayReminders: boolean;
//     schoolFeeAlerts: boolean;
//     festiveSeasonWarnings: boolean;
//     transportPriceAlerts: boolean;
//   };
// }

// interface Notification {
//   _id: string;
//   type: string;
//   title: string;
//   message: string;
//   priority: 'low' | 'medium' | 'high' | 'urgent';
//   status: 'unread' | 'read' | 'dismissed' | 'acted_upon';
//   data?: any;
//   createdAt: string;
// }

// const BudgetAlertsPage = () => {
//   const [alertSettings, setAlertSettings] = useState<AlertSettings | null>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Nigerian categories for dropdowns
//   const nigerianCategories = [
//     'All Categories',
//     'Food & Dining',
//     'Transport',
//     'Bills',
//     'Shopping',
//     'Entertainment',
//     'School Fees',
//     'Church/Mosque',
//     'Family Support',
//     'Health/Medical',
//     'Rent/Housing',
//     'Other Expenses'
//   ];

//   useEffect(() => {
//     fetchAlertSettings();
//     fetchNotifications();
//   }, []);

//   const fetchAlertSettings = async () => {
//     try {
//       const response = await fetch('/api/alert-settings');
//       const data = await response.json();

//       if (data.success) {
//         setAlertSettings(data.alertSettings);
//       } else {
//         throw new Error(data.error || 'Failed to fetch alert settings');
//       }
//     } catch (err: any) {
//       console.error('Error fetching alert settings:', err);
//       setError(err.message);
//       toast.error('Failed to load alert settings');
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const response = await fetch('/api/notifications?limit=10&status=unread');
//       const data = await response.json();

//       if (data.success) {
//         setNotifications(data.notifications);
//       } else {
//         throw new Error(data.error || 'Failed to fetch notifications');
//       }
//     } catch (err: any) {
//       console.error('Error fetching notifications:', err);
//       // Don't show error for notifications, just log it
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveAlertSettings = async () => {
//     if (!alertSettings) return;

//     setSaving(true);
//     try {
//       const response = await fetch('/api/alert-settings', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(alertSettings),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success('Alert settings saved successfully!');
//         setAlertSettings(data.alertSettings);
//       } else {
//         throw new Error(data.error || 'Failed to save alert settings');
//       }
//     } catch (err: any) {
//       console.error('Error saving alert settings:', err);
//       toast.error('Failed to save alert settings');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const generateAlerts = async () => {
//     try {
//       const response = await fetch('/api/notifications', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ action: 'generate_alerts' }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success(`Generated ${data.notifications.length} new alerts!`);
//         fetchNotifications(); // Refresh notifications
//       } else {
//         throw new Error(data.error || 'Failed to generate alerts');
//       }
//     } catch (err: any) {
//       console.error('Error generating alerts:', err);
//       toast.error('Failed to generate alerts');
//     }
//   };

//   const updateAlertSetting = (section: string, field: string, value: any) => {
//     if (!alertSettings) return;

//     setAlertSettings({
//       ...alertSettings,
//       [section]: {
//         ...alertSettings[section as keyof AlertSettings],
//         [field]: value
//       }
//     });
//   };

//   const updateNotificationPreference = (field: string, value: boolean) => {
//     if (!alertSettings) return;

//     setAlertSettings({
//       ...alertSettings,
//       notificationPreferences: {
//         ...alertSettings.notificationPreferences,
//         [field]: value
//       }
//     });
//   };

//   const formatNotificationTime = (dateString: string): string => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

//     if (diffInHours < 1) return 'Just now';
//     if (diffInHours < 24) return `${diffInHours}h ago`;
//     if (diffInHours < 48) return 'Yesterday';
//     return date.toLocaleDateString();
//   };

//   const getPriorityColor = (priority: string): string => {
//     switch (priority) {
//       case 'urgent': return 'bg-red-500';
//       case 'high': return 'bg-orange-500';
//       case 'medium': return 'bg-blue-500';
//       case 'low': return 'bg-green-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getNotificationIcon = (type: string): string => {
//     switch (type) {
//       case 'category_threshold': return 'percent';
//       case 'budget_exceeded': return 'exclamation-triangle';
//       case 'weekly_summary': return 'envelope-open-text';
//       case 'salary_reminder': return 'money-bill-wave';
//       case 'school_fee_alert': return 'graduation-cap';
//       case 'savings_tip': return 'lightbulb';
//       default: return 'bell';
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <MainNavigation />
//         <div className="min-h-screen">
//           <div className="container mx-auto px-4 py-8 max-w-6xl">
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//           </div>
//         </div>
//         <br /><br /><br /><br />
//       </>
//     )
//   }

//   if (error || !alertSettings) {
//     return (
//       <>
//         <MainNavigation />
//         <div className="min-h-screen">
//           <div className="container mx-auto px-4 py-8 max-w-6xl">
//             <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error || 'Failed to load alert settings'}</p>
//                   <button
//                     onClick={() => window.location.reload()}
//                     className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
//                   >
//                     Try again
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <MainNavigation />
//       <div className="min-h-screen">
//         <div className="container mx-auto px-4 py-8 max-w-6xl">
//           {/* Navigation */}
//           <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
//             <Link
//               href="/budget-planner/screen-1"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Monthly Overview</Link>
//             <Link
//               href="/budget-planner/screen-2"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Category Budgets</Link>
//             <Link
//               href="/budget-planner/screen-3"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Smart Budget Assistant (AI)</Link>
//             <Link
//               href="/budget-planner/screen-4"
//               className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
//             >Budget Alerts & Reminders</Link>
//             <Link
//               href="/budget-planner/screen-5"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Budget Calendar</Link>
//           </nav>

//           {/* Page Header */}
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
//                 Budget Alerts & Reminders
//               </h2>
//               <p className="text-slate-500 dark:text-slate-400">
//                 Stay on track with personalized notifications
//               </p>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={generateAlerts}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center"
//               >
//                 <FontAwesomeIcon icon={'sync'} className='mr-2' /> Generate Alerts
//               </button>
//               <button
//                 onClick={() => window.history.back()}
//                 className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
//               >
//                 <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
//               </button>
//             </div>
//           </div>

//           {/* Two Column Layout */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Alert Settings Column */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
//               <h3 className="text-lg dark:text-slate-300 font-semibold mb-6">Alert Settings</h3>

//               {/* Category Threshold Alert */}
//               <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
//                       <FontAwesomeIcon icon={'percent'} />
//                     </div>
//                     <div>
//                       <h4 className="font-medium dark:text-slate-300">Category Threshold</h4>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         Get notified when a category reaches a certain percentage
//                       </p>
//                     </div>
//                   </div>
//                   <ToggleSwitch
//                     checked={alertSettings.categoryThreshold.enabled}
//                     onChange={(checked) => updateAlertSetting('categoryThreshold', 'enabled', checked)}
//                   />
//                 </div>

//                 <div className="mt-4 pl-13">
//                   <div className="flex items-center space-x-4 mb-3">
//                     <span className="text-sm dark:text-slate-300">Alert me when any category hits</span>
//                     <div className="relative">
//                       <select
//                         value={alertSettings.categoryThreshold.percentage}
//                         onChange={(e) => updateAlertSetting('categoryThreshold', 'percentage', parseInt(e.target.value))}
//                         className="category-selector bg-white border border-slate-200 text-slate-700 dark:bg-gray-600 dark:text-white dark:border-slate-400 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-20 px-3 py-1"
//                       >
//                         <option value={70}>70%</option>
//                         <option value={75}>75%</option>
//                         <option value={80}>80%</option>
//                         <option value={85}>85%</option>
//                         <option value={90}>90%</option>
//                         <option value={95}>95%</option>
//                       </select>
//                     </div>
//                     <span className="text-sm dark:text-slate-300">of budget</span>
//                   </div>

//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm dark:text-slate-300">Or specific category:</span>
//                     <div className="relative">
//                       <select
//                         value={alertSettings.categoryThreshold.specificCategory || 'All Categories'}
//                         onChange={(e) => updateAlertSetting('categoryThreshold', 'specificCategory', e.target.value === 'All Categories' ? null : e.target.value)}
//                         className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-40 px-3 py-1"
//                       >
//                         {nigerianCategories.map(category => (
//                           <option key={category} value={category}>{category}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Budget Exceeded Alert */}
//               <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
//                       <FontAwesomeIcon icon={'exclamation-triangle'} />
//                     </div>
//                     <div>
//                       <h4 className="font-medium dark:text-slate-300">Budget Exceeded</h4>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         Get notified when you exceed your overall budget
//                       </p>
//                     </div>
//                   </div>
//                   <ToggleSwitch
//                     checked={alertSettings.budgetExceeded.enabled}
//                     onChange={(checked) => updateAlertSetting('budgetExceeded', 'enabled', checked)}
//                   />
//                 </div>

//                 <div className="mt-4 pl-13">
//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm dark:text-slate-300">Alert me when I exceed my overall budget by</span>
//                     <div className="relative">
//                       <select
//                         value={alertSettings.budgetExceeded.percentage}
//                         onChange={(e) => updateAlertSetting('budgetExceeded', 'percentage', parseInt(e.target.value))}
//                         className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-20 px-3 py-1"
//                       >
//                         <option value={5}>5%</option>
//                         <option value={10}>10%</option>
//                         <option value={15}>15%</option>
//                         <option value={20}>20%</option>
//                         <option value={25}>25%</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Weekly Summary Alert */}
//               <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
//                       <FontAwesomeIcon icon={'calendar-week'} />
//                     </div>
//                     <div>
//                       <h4 className="font-medium dark:text-slate-300">Weekly Summary</h4>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         Get a weekly spending summary
//                       </p>
//                     </div>
//                   </div>
//                   <ToggleSwitch
//                     checked={alertSettings.weeklySummary.enabled}
//                     onChange={(checked) => updateAlertSetting('weeklySummary', 'enabled', checked)}
//                   />
//                 </div>

//                 <div className="mt-4 pl-13">
//                   <div className="flex items-center space-x-4">
//                     <span className="text-sm dark:text-slate-300">Send me a weekly summary every</span>
//                     <div className="relative">
//                       <select
//                         value={alertSettings.weeklySummary.day}
//                         onChange={(e) => updateAlertSetting('weeklySummary', 'day', e.target.value)}
//                         className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-28 px-3 py-1"
//                       >
//                         <option value="Sunday">Sunday</option>
//                         <option value="Monday">Monday</option>
//                         <option value="Friday">Friday</option>
//                         <option value="Saturday">Saturday</option>
//                       </select>
//                     </div>
//                     <span className="text-sm dark:text-slate-300">at</span>
//                     <div className="relative">
//                       <select
//                         value={alertSettings.weeklySummary.time}
//                         onChange={(e) => updateAlertSetting('weeklySummary', 'time', e.target.value)}
//                         className="category-selector bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 block w-24 px-3 py-1"
//                       >
//                         <option value="8:00 AM">8:00 AM</option>
//                         <option value="9:00 AM">9:00 AM</option>
//                         <option value="12:00 PM">12:00 PM</option>
//                         <option value="6:00 PM">6:00 PM</option>
//                         <option value="8:00 PM">8:00 PM</option>
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Nigerian Context Alerts */}
//               <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition mb-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
//                       <FontAwesomeIcon icon={'flag'} />
//                     </div>
//                     <div>
//                       <h4 className="font-medium dark:text-slate-300">Nigerian Context Alerts</h4>
//                       <p className="text-xs text-slate-500 dark:text-slate-400">
//                         Alerts tailored for Nigerian financial patterns
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3 pl-13">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm dark:text-slate-300">Salary Day Reminders (25th-28th)</span>
//                     <ToggleSwitch
//                       checked={alertSettings.nigerianContext.salaryDayReminders}
//                       onChange={(checked) => updateAlertSetting('nigerianContext', 'salaryDayReminders', checked)}
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm dark:text-slate-300">School Fees Alerts (Jan & Sept)</span>
//                     <ToggleSwitch
//                       checked={alertSettings.nigerianContext.schoolFeeAlerts}
//                       onChange={(checked) => updateAlertSetting('nigerianContext', 'schoolFeeAlerts', checked)}
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm dark:text-slate-300">Festive Season Warnings</span>
//                     <ToggleSwitch
//                       checked={alertSettings.nigerianContext.festiveSeasonWarnings}
//                       onChange={(checked) => updateAlertSetting('nigerianContext', 'festiveSeasonWarnings', checked)}
//                     />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm dark:text-slate-300">Transport Price Alerts</span>
//                     <ToggleSwitch
//                       checked={alertSettings.nigerianContext.transportPriceAlerts}
//                       onChange={(checked) => updateAlertSetting('nigerianContext', 'transportPriceAlerts', checked)}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6 flex justify-end">
//                 <button
//                   onClick={saveAlertSettings}
//                   disabled={saving}
//                   className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {saving ? (
//                     <>
//                       <FontAwesomeIcon icon={'spinner'} className='animate-spin mr-2' />
//                       Saving...
//                     </>
//                   ) : (
//                     'Save Alert Settings'
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Notification Previews Column */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg dark:text-slate-300 font-semibold">Recent Notifications</h3>
//                 <button
//                   onClick={fetchNotifications}
//                   className="text-xs text-indigo-600 hover:text-indigo-800"
//                 >
//                   Refresh
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {notifications.length > 0 ? (
//                   notifications.map((notification) => (
//                     <div
//                       key={notification._id}
//                       className={`notification-preview ${getPriorityColor(notification.priority)} text-white rounded-lg p-4 flex items-start`}
//                     >
//                       <div
//                         style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                         className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
//                       >
//                         <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium">{notification.title}</p>
//                         <p className="text-sm opacity-90">{notification.message}</p>

//                         {notification.data?.progressData && (
//                           <div className="mt-2">
//                             <div
//                               style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                               className="w-full bg-white bg-opacity-20 rounded-full h-2"
//                             >
//                               <div
//                                 className="bg-yellow-300 h-2 rounded-full"
//                                 style={{ width: `${Math.min(notification.data.progressData.percentage, 100)}%` }}
//                               ></div>
//                             </div>
//                           </div>
//                         )}

//                         {notification.data?.actions && (
//                           <div className="mt-3 flex items-center space-x-3">
//                             {notification.data.actions.slice(0, 2).map((action: any, index: number) => (
//                               <button
//                                 key={index}
//                                 onClick={() => toast.info(`Action "${action.label}" clicked! (Feature coming soon)`)}
//                                 style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                                 className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition"
//                               >
//                                 {action.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}

//                         <div className="mt-3 text-xs opacity-80 flex justify-between">
//                           <span>{formatNotificationTime(notification.createdAt)}</span>
//                           <span className="capitalize">{notification.priority} priority</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8">
//                     <FontAwesomeIcon icon={'bell-slash'} className='text-4xl text-slate-300 mb-4' />
//                     <p className="text-slate-500 dark:text-slate-400">No recent notifications</p>
//                     <button
//                       onClick={generateAlerts}
//                       className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
//                     >
//                       Generate new alerts
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-6">
//                 <h4 className="text-sm dark:text-slate-300 font-medium mb-3">Notification Preferences</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-center space-x-3">
//                     <ToggleSwitch
//                       checked={alertSettings.notificationPreferences.pushNotifications}
//                       onChange={(checked) => updateNotificationPreference('pushNotifications', checked)}
//                     />
//                     <span className="text-sm dark:text-slate-300">Push Notifications</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <ToggleSwitch
//                       checked={alertSettings.notificationPreferences.emailAlerts}
//                       onChange={(checked) => updateNotificationPreference('emailAlerts', checked)}
//                     />
//                     <span className="text-sm dark:text-slate-300">Email Alerts</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <ToggleSwitch
//                       checked={alertSettings.notificationPreferences.smsAlerts}
//                       onChange={(checked) => updateNotificationPreference('smsAlerts', checked)}
//                     />
//                     <span className="text-sm dark:text-slate-300">SMS Alerts</span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <ToggleSwitch
//                       checked={alertSettings.notificationPreferences.inAppNotifications}
//                       onChange={(checked) => updateNotificationPreference('inAppNotifications', checked)}
//                     />
//                     <span className="text-sm dark:text-slate-300">In-App Notifications</span>
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end">
//                   <button
//                     onClick={saveAlertSettings}
//                     disabled={saving}
//                     className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {saving ? 'Saving...' : 'Save Notification Settings'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <br /><br /><br /><br />
//     </>
//   )
// }

// export default BudgetAlertsPage;

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
  const [showCustomAlertModal, setShowCustomAlertModal] = useState(false);
  const [newCustomAlert, setNewCustomAlert] = useState({
    category: 'Food & Dining',
    condition: 'spending_reaches',
    threshold: 50000,
    isPercentage: false,
    notificationTiming: 'immediate'
  });

  // Nigerian categories - matches your API categories
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

  // Alert conditions matching your API
  const alertConditions = [
    { value: 'spending_reaches', label: 'Spending reaches' },
    { value: 'daily_exceeds', label: 'Daily spending exceeds' },
    { value: 'weekly_exceeds', label: 'Weekly spending exceeds' }
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
      if (err.name === 'ValidationError') {
        toast.error('Invalid settings. Please check your input.');
      } else {
        toast.error('Failed to save alert settings');
      }
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

  // Properly integrate with your existing API structure
  const addCustomAlert = async () => {
    if (!alertSettings) return;

    // Create new alert ID as your API expects
    const newAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      enabled: true,
      ...newCustomAlert
    };

    const updatedSettings = {
      ...alertSettings,
      customAlerts: [...alertSettings.customAlerts, newAlert]
    };

    // Use PUT method to match your existing API
    try {
      const response = await fetch('/api/alert-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Custom alert created successfully!');
        setAlertSettings(data.alertSettings);
        setShowCustomAlertModal(false);
        setNewCustomAlert({
          category: 'Food & Dining',
          condition: 'spending_reaches',
          threshold: 50000,
          isPercentage: false,
          notificationTiming: 'immediate'
        });
      } else {
        throw new Error(data.error || 'Failed to create custom alert');
      }
    } catch (err: any) {
      console.error('Error creating custom alert:', err);
      toast.error('Failed to create custom alert');
    }
  };

  const deleteCustomAlert = (alertId: string) => {
    if (!alertSettings) return;

    setAlertSettings({
      ...alertSettings,
      customAlerts: alertSettings.customAlerts.filter(alert => alert.id !== alertId)
    });
    toast.success('Custom alert removed');
  };

  // Match your API notification handling
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'mark_read',
          notificationId 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId 
            ? { ...notif, status: 'read' as const }
            : notif
        ));
      }
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
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

  const updateCustomAlert = (alertId: string, field: string, value: any) => {
    if (!alertSettings) return;

    setAlertSettings({
      ...alertSettings,
      customAlerts: alertSettings.customAlerts.map(alert =>
        alert.id === alertId ? { ...alert, [field]: value } : alert
      )
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

  const formatNaira = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦');
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
      case 'transport_price_alert': return 'bus';
      // case 'festive_season_warning': return 'calendar-star';
      case 'festive_season_warning': return 'calendar-check';
      default: return 'bell';
    }
  };

  // Get current Nigerian context matching your business logic
  const getCurrentNigerianInsights = () => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const month = currentDate.getMonth();
    const insights = [];

    if (dayOfMonth >= 25 && dayOfMonth <= 28) {
      insights.push('Salary season approaching - consider setting up salary-day budget alerts');
    }

    if ([0, 8].includes(month)) {
      insights.push('School fees season - enable education expense alerts');
    }

    if ([11, 0].includes(month)) {
      insights.push('Festive season - extra monitoring recommended for celebration expenses');
    }

    return insights;
  };

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error || 'Failed to load alert settings'}</p>
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation matching your existing pattern */}
          <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
            <Link
              href="/budget-planner/screen-1"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-400 hover:text-indigo-600 whitespace-nowrap"
            >Monthly Overview</Link>
            <Link
              href="/budget-planner/screen-2"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-400 hover:text-indigo-600 whitespace-nowrap"
            >Category Budgets</Link>
            <Link
              href="/budget-planner/screen-3"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-400 hover:text-indigo-600 whitespace-nowrap"
            >Smart Budget Assistant (AI)</Link>
            <Link
              href="/budget-planner/screen-4"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1 whitespace-nowrap"
            >Budget Alerts & Reminders</Link>
            <Link
              href="/budget-planner/screen-5"
              className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-400 hover:text-indigo-600 whitespace-nowrap"
            >Budget Calendar</Link>
          </nav>

          {/* Page Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Budget Alerts & Reminders
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Stay on track with personalized notifications
              </p>
              
              {/* Nigerian Context Insights */}
              {getCurrentNigerianInsights().length > 0 && (
                <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-start">
                    <FontAwesomeIcon icon={'lightbulb'} className="text-indigo-500 mt-0.5 mr-2" />
                    <div className="text-sm text-indigo-700 dark:text-indigo-300">
                      <p className="font-medium mb-1">Nigerian Market Insights:</p>
                      <ul className="space-y-1">
                        {getCurrentNigerianInsights().map((insight, index) => (
                          <li key={index} className="text-xs">• {insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={generateAlerts}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center justify-center"
              >
                <FontAwesomeIcon icon={'sync'} className='mr-2' /> Generate Alerts
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition flex items-center justify-center"
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
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 dark:border-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500 transition mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
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

                {alertSettings.categoryThreshold.enabled && (
                  <div className="mt-4 pl-13">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-sm dark:text-slate-300">Alert me when any category hits</span>
                      <select
                        value={alertSettings.categoryThreshold.percentage}
                        onChange={(e) => updateAlertSetting('categoryThreshold', 'percentage', parseInt(e.target.value))}
                        className="bg-white border border-slate-200 text-slate-700 dark:bg-gray-600 dark:text-white dark:border-slate-400 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-1"
                      >
                        <option value={70}>70%</option>
                        <option value={75}>75%</option>
                        <option value={80}>80%</option>
                        <option value={85}>85%</option>
                        <option value={90}>90%</option>
                        <option value={95}>95%</option>
                      </select>
                      <span className="text-sm dark:text-slate-300">of budget</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm dark:text-slate-300">Or specific category:</span>
                      <select
                        value={alertSettings.categoryThreshold.specificCategory || 'All Categories'}
                        onChange={(e) => updateAlertSetting('categoryThreshold', 'specificCategory', e.target.value === 'All Categories' ? null : e.target.value)}
                        className="bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-1"
                      >
                        {nigerianCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Budget Exceeded Alert */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 dark:border-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500 transition mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mr-3">
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

                {alertSettings.budgetExceeded.enabled && (
                  <div className="mt-4 pl-13">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm dark:text-slate-300">Alert me when I exceed my overall budget by</span>
                      <select
                        value={alertSettings.budgetExceeded.percentage}
                        onChange={(e) => updateAlertSetting('budgetExceeded', 'percentage', parseInt(e.target.value))}
                        className="bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-1"
                      >
                        <option value={5}>5%</option>
                        <option value={10}>10%</option>
                        <option value={15}>15%</option>
                        <option value={20}>20%</option>
                        <option value={25}>25%</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Weekly Summary Alert */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 dark:border-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500 transition mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3">
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

                {alertSettings.weeklySummary.enabled && (
                  <div className="mt-4 pl-13">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm dark:text-slate-300">Send me a weekly summary every</span>
                      <select
                        value={alertSettings.weeklySummary.day}
                        onChange={(e) => updateAlertSetting('weeklySummary', 'day', e.target.value)}
                        className="bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-1"
                      >
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                      </select>
                      <span className="text-sm dark:text-slate-300">at</span>
                      <select
                        value={alertSettings.weeklySummary.time}
                        onChange={(e) => updateAlertSetting('weeklySummary', 'time', e.target.value)}
                        className="bg-white dark:bg-gray-600 dark:text-white dark:border-slate-400 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-1"
                      >
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Nigerian Context Alerts */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 dark:border-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500 transition mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center mr-3">
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
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'money-bill-wave'} className="text-green-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">Salary Day Reminders (25th-28th)</span>
                    </div>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.salaryDayReminders}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'salaryDayReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'graduation-cap'} className="text-blue-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">School Fees Alerts (Jan & Sept)</span>
                    </div>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.schoolFeeAlerts}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'schoolFeeAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'calendar-check'} className="text-purple-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">Festive Season Warnings</span>
                    </div>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.festiveSeasonWarnings}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'festiveSeasonWarnings', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'bus'} className="text-orange-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">Transport Price Alerts</span>
                    </div>
                    <ToggleSwitch
                      checked={alertSettings.nigerianContext.transportPriceAlerts}
                      onChange={(checked) => updateAlertSetting('nigerianContext', 'transportPriceAlerts', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Alerts Section */}
              <div className="alert-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 dark:border-slate-600 hover:border-indigo-100 dark:hover:border-indigo-500 transition mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400 flex items-center justify-center mr-3">
                      <FontAwesomeIcon icon={'cog'} />
                    </div>
                    <div>
                      <h4 className="font-medium dark:text-slate-300">Custom Alerts</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Create personalized spending alerts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCustomAlertModal(true)}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900 transition flex items-center"
                  >
                    <FontAwesomeIcon icon={'plus'} className='mr-1' /> Add Alert
                  </button>
                </div>

                <div className="space-y-3">
                  {alertSettings.customAlerts.length > 0 ? (
                    alertSettings.customAlerts.map((alert) => (
                      <div key={alert.id} className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <ToggleSwitch
                                checked={alert.enabled}
                                onChange={(checked) => updateCustomAlert(alert.id, 'enabled', checked)}
                              />
                              <span className="text-sm font-medium dark:text-slate-300">{alert.category}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {alert.condition.replace('_', ' ')} {alert.isPercentage ? `${alert.threshold}%` : formatNaira(alert.threshold)} 
                              ({alert.notificationTiming.replace('_', ' ')})
                            </p>
                          </div>
                          <button
                            onClick={() => deleteCustomAlert(alert.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FontAwesomeIcon icon={'trash'} className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
                      No custom alerts configured. Click "Add Alert" to create one.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveAlertSettings}
                  disabled={saving}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={'spinner'} className='animate-spin mr-2' />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={'save'} className='mr-2' />
                      Save Alert Settings
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Notifications Column */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg dark:text-slate-300 font-semibold">Recent Notifications</h3>
                <button
                  onClick={fetchNotifications}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                >
                  <FontAwesomeIcon icon={'refresh'} className="mr-1" /> Refresh
                </button>
              </div>

              <div className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`notification-preview ${getPriorityColor(notification.priority)} text-white rounded-lg p-4 flex items-start cursor-pointer hover:opacity-90 transition`}
                      onClick={() => markNotificationAsRead(notification._id)}
                    >
                      <div
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                        className="bg-white bg-opacity-20 rounded-full p-2 mr-3 flex-shrink-0"
                      >
                        <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm opacity-90 mt-1">{notification.message}</p>

                        {notification.data?.progressData && (
                          <div className="mt-2">
                            <div
                              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                              className="w-full bg-white bg-opacity-20 rounded-full h-2"
                            >
                              <div
                                className="bg-yellow-300 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(notification.data.progressData.percentage, 100)}%` }}
                              ></div>
                            </div>
                            <p className="text-xs opacity-80 mt-1">
                              {notification.data.formattedAmount || formatNaira(notification.data.amount)} of {formatNaira(notification.data.budgetLimit)}
                            </p>
                          </div>
                        )}

                        {notification.data?.actions && (
                          <div className="mt-3 flex items-center space-x-3">
                            {notification.data.actions.slice(0, 2).map((action: any, index: number) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Route to proper action based on your API structure
                                  const actionRoute = getActionRoute(action);
                                  if (actionRoute) {
                                    window.location.href = actionRoute;
                                  } else {
                                    toast.info(`Action "${action.label}" clicked!`);
                                  }
                                }}
                                style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                                className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs hover:bg-opacity-30 transition"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 text-xs opacity-80 flex justify-between items-center">
                          <span>{formatNotificationTime(notification.createdAt)}</span>
                          <div className="flex items-center space-x-2">
                            <span className="capitalize">{notification.priority} priority</span>
                            {notification.status === 'unread' && (
                              <span className="w-2 h-2 bg-yellow-300 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={'bell-slash'} className='text-4xl text-slate-300 dark:text-slate-600 mb-4' />
                    <p className="text-slate-500 dark:text-slate-400">No recent notifications</p>
                    <button
                      onClick={generateAlerts}
                      className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                    >
                      Generate new alerts
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Preferences */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                <h4 className="text-sm dark:text-slate-300 font-medium mb-3">Notification Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.pushNotifications}
                      onChange={(checked) => updateNotificationPreference('pushNotifications', checked)}
                    />
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'mobile-alt'} className="text-slate-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">Push Notifications</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.emailAlerts}
                      onChange={(checked) => updateNotificationPreference('emailAlerts', checked)}
                    />
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'envelope'} className="text-slate-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">Email Alerts</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.smsAlerts}
                      onChange={(checked) => updateNotificationPreference('smsAlerts', checked)}
                    />
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'sms'} className="text-slate-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">SMS Alerts</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ToggleSwitch
                      checked={alertSettings.notificationPreferences.inAppNotifications}
                      onChange={(checked) => updateNotificationPreference('inAppNotifications', checked)}
                    />
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={'bell'} className="text-slate-500 w-4 h-4 mr-2" />
                      <span className="text-sm dark:text-slate-300">In-App Notifications</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Alert Modal */}
        {showCustomAlertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-slate-200">Create Custom Alert</h3>
                <button
                  onClick={() => setShowCustomAlertModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <FontAwesomeIcon icon={'times'} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-2">Category</label>
                  <select
                    value={newCustomAlert.category}
                    onChange={(e) => setNewCustomAlert({...newCustomAlert, category: e.target.value})}
                    className="w-full bg-white dark:bg-gray-600 border border-slate-200 dark:border-slate-500 text-slate-700 dark:text-white text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-2"
                  >
                    {nigerianCategories.filter(cat => cat !== 'All Categories').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-2">Condition</label>
                  <select
                    value={newCustomAlert.condition}
                    onChange={(e) => setNewCustomAlert({...newCustomAlert, condition: e.target.value})}
                    className="w-full bg-white dark:bg-gray-600 border border-slate-200 dark:border-slate-500 text-slate-700 dark:text-white text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-2"
                  >
                    {alertConditions.map(condition => (
                      <option key={condition.value} value={condition.value}>{condition.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-2">
                    Threshold ({newCustomAlert.isPercentage ? '%' : '₦'})
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={newCustomAlert.threshold}
                      onChange={(e) => setNewCustomAlert({...newCustomAlert, threshold: parseInt(e.target.value) || 0})}
                      className="flex-1 bg-white dark:bg-gray-600 border border-slate-200 dark:border-slate-500 text-slate-700 dark:text-white text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-2"
                      min="0"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPercentage"
                        checked={newCustomAlert.isPercentage}
                        onChange={(e) => setNewCustomAlert({...newCustomAlert, isPercentage: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="isPercentage" className="text-sm dark:text-slate-300">%</label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-slate-300 mb-2">Notification Timing</label>
                  <select
                    value={newCustomAlert.notificationTiming}
                    onChange={(e) => setNewCustomAlert({...newCustomAlert, notificationTiming: e.target.value})}
                    className="w-full bg-white dark:bg-gray-600 border border-slate-200 dark:border-slate-500 text-slate-700 dark:text-white text-sm rounded-lg focus:ring-indigo-200 focus:border-indigo-400 px-3 py-2"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily_8pm">Daily at 8 PM</option>
                    <option value="weekly_friday">Weekly on Friday</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCustomAlertModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomAlert}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition flex items-center"
                >
                  <FontAwesomeIcon icon={'plus'} className='mr-2' />
                  Create Alert
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <br /><br /><br /><br />
    </>
  )
}

// Helper function to route notification actions properly
const getActionRoute = (action: any): string | null => {
  switch (action.action) {
    case 'view_category_breakdown':
    case 'view_budget_breakdown':
      return '/budget-planner/screen-1';
    case 'adjust_budget':
    case 'adjust_category_budget':
      return '/budget-planner/screen-2';
    case 'create_next_month_budget':
      return '/budget-planner/screen-3';
    case 'view_savings_goals':
    case 'create_savings_goal':
      return '/smartGoals';
    case 'add_school_fees_category':
      return '/budget-planner/screen-2?category=School Fees';
    default:
      return null;
  }
};

export default BudgetAlertsPage;