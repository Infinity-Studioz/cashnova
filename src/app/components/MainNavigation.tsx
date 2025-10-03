// 'use client'

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import Image from "next/image"
// import ThemeToggle from "./ThemeToggle"
// import Link from "next/link"
// import { useState, useEffect } from "react"

// interface NotificationBadgeProps {
//   count: number;
// }

// const NotificationBadge = ({ count }: NotificationBadgeProps) => {
//   if (count === 0) return null;
  
//   return (
//     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
//       {count > 99 ? '99+' : count}
//     </span>
//   );
// };

// const MainNavigation = () => {
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
//   const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

//   useEffect(() => {
//     fetchNotificationCount();
    
//     // Auto-refresh notification count every 30 seconds
//     const interval = setInterval(fetchNotificationCount, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const fetchNotificationCount = async () => {
//     try {
//       const response = await fetch('/api/notifications?status=unread&limit=5');
//       const data = await response.json();
      
//       if (data.success) {
//         setNotificationCount(data.summary?.unread || 0);
//         setRecentNotifications(data.notifications || []);
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const handleNotificationClick = () => {
//     setShowNotificationDropdown(!showNotificationDropdown);
//   };

//   const markAsRead = async (notificationId: string) => {
//     try {
//       await fetch('/api/notifications', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           action: 'mark_read',
//           notificationId
//         })
//       });
      
//       // Refresh notifications
//       fetchNotificationCount();
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const formatTimeAgo = (dateString: string): string => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return `${Math.floor(diffInMinutes / 1440)}d ago`;
//   };

//   const getPriorityColor = (priority: string): string => {
//     switch (priority) {
//       case 'urgent': return 'text-red-600 bg-red-50';
//       case 'high': return 'text-orange-600 bg-orange-50';
//       case 'medium': return 'text-blue-600 bg-blue-50';
//       case 'low': return 'text-green-600 bg-green-50';
//       default: return 'text-gray-600 bg-gray-50';
//     }
//   };

//   return (
//     <>
//       {/* Header */}
//       <header className="shadow-sm bg-white dark:bg-gray-800 relative">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <div className="flex items-center">
//             <div className="w-20 h-10 rounded-full flex items-center justify-center">
//               <Image src="/assets/main.png" alt="Logo" width={100} height={100} />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-yellow-600 dark:text-yellow-500">
//                 CashNova
//               </h1>
//               <span className="text-xs ml-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
//                 by Infinity
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <ThemeToggle />
            
//             {/* Transaction History Button */}
//             <Link href="/transactionHistory">
//               <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
//                 <FontAwesomeIcon icon={"clock-rotate-left"} />
//               </button>
//             </Link>
            
//             {/* Enhanced Notifications Button */}
//             <div className="relative">
//               <button
//                 onClick={handleNotificationClick}
//                 className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
//               >
//                 <FontAwesomeIcon icon={"bell"} />
//                 <NotificationBadge count={notificationCount} />
//               </button>

//               {/* Notification Dropdown */}
//               {showNotificationDropdown && (
//                 <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
//                   <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-semibold text-gray-900 dark:text-gray-100">
//                         Notifications
//                       </h3>
//                       {notificationCount > 0 && (
//                         <span className="text-xs text-blue-600 dark:text-blue-400">
//                           {notificationCount} unread
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="max-h-64 overflow-y-auto">
//                     {recentNotifications.length > 0 ? (
//                       recentNotifications.map((notification) => (
//                         <div
//                           key={notification._id}
//                           className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 cursor-pointer transition-colors ${
//                             notification.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
//                           }`}
//                           onClick={() => {
//                             if (notification.status === 'unread') {
//                               markAsRead(notification._id);
//                             }
//                             setShowNotificationDropdown(false);
//                           }}
//                         >
//                           <div className="flex items-start space-x-3">
//                             <div className={`w-2 h-2 rounded-full mt-2 ${
//                               notification.status === 'unread' ? 'bg-blue-500' : 'bg-gray-300'
//                             }`} />
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center justify-between">
//                                 <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
//                                   {notification.title}
//                                 </p>
//                                 <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(notification.priority)}`}>
//                                   {notification.priority}
//                                 </span>
//                               </div>
//                               <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
//                                 {notification.message}
//                               </p>
//                               <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
//                                 {formatTimeAgo(notification.createdAt)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="p-6 text-center">
//                         <FontAwesomeIcon
//                           icon={'bell-slash'}
//                           className="text-2xl text-gray-300 dark:text-gray-600 mb-2"
//                         />
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           No notifications yet
//                         </p>
//                       </div>
//                     )}
//                   </div>

//                   {recentNotifications.length > 0 && (
//                     <div className="p-3 border-t border-gray-200 dark:border-gray-700">
//                       <Link
//                         href="/budget-planner/screen-4"
//                         onClick={() => setShowNotificationDropdown(false)}
//                         className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
//                       >
//                         View All Notifications
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Click outside to close dropdown */}
//         {showNotificationDropdown && (
//           <div
//             className="fixed inset-0 z-40"
//             onClick={() => setShowNotificationDropdown(false)}
//           />
//         )}
//       </header>

//       {/* Enhanced Bottom Navigation with badges */}
//       <nav className="z-50 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-400 fixed bottom-0 w-full">
//         <div className="container mx-auto px-4">
//           <div className="flex justify-around py-3">
//             <Link
//               href="/dashboard"
//               className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
//             >
//               <FontAwesomeIcon icon={"home"} className="text-xl" />
//               <span className="text-xs mt-2">Home</span>
//             </Link>
            
//             <Link
//               href="/analytics&reports"
//               className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
//             >
//               <FontAwesomeIcon icon={"chart-pie"} className="text-xl" />
//               <span className="text-xs mt-2">Analytics</span>
//             </Link>
            
//             <Link
//               href="/addTransaction"
//               className="text-indigo-600 flex flex-col items-center"
//             >
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center -mt-6 pulse">
//                   <FontAwesomeIcon icon={"plus"} className="text-white text-xl" />
//                 </div>
//               </div>
//             </Link>
            
//             <Link
//               href="/smartGoals"
//               className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative"
//             >
//               <FontAwesomeIcon icon={"bullseye"} className="text-xl" />
//               <span className="text-xs mt-2">Goals</span>
//             </Link>
            
//             <Link
//               href="/settings"
//               className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
//             >
//               <FontAwesomeIcon icon={'cog'} className="text-xl" />
//               <span className="text-xs mt-2">Settings</span>
//             </Link>
//           </div>
//         </div>
//       </nav>
//     </>
//   )
// }

// export default MainNavigation

// src/components/MainNavigation.tsx
'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconName } from '@fortawesome/fontawesome-svg-core'
import Image from "next/image"
import ThemeToggle from "./ThemeToggle"
import Link from "next/link"
import { useState, useEffect } from "react"
import '../../lib/fontawesome'

interface NotificationBadgeProps {
  count: number;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
  actionUrl?: string;
}

const NotificationBadge = ({ count }: NotificationBadgeProps) => {
  if (count === 0) return null;
  
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
};

const MainNavigation = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotificationCount();
    
    // Auto-refresh notification count every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotificationCount = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications?status=unread&limit=5');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setNotificationCount(data.summary?.unread || 0);
        setRecentNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Gracefully handle errors - don't show error messages for background updates
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'mark_read', 
          notificationId 
        })
      });

      if (response.ok) {
        // Refresh notifications after marking as read
        await fetchNotificationCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'dismiss', 
          notificationId 
        })
      });

      if (response.ok) {
        // Refresh notifications after dismissing
        await fetchNotificationCount();
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const handleNotificationAction = async (notification: Notification) => {
    // Mark as read first
    if (notification.status === 'unread') {
      await markAsRead(notification._id);
    }

    // Close dropdown
    setShowNotificationDropdown(false);

    // Handle navigation if actionUrl exists
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    } else {
      // Default navigation based on notification type
      switch (notification.type) {
        case 'category_threshold':
        case 'budget_exceeded':
          window.location.href = '/budget-planner/screen-1';
          break;
        case 'school_fee_alert':
          window.location.href = '/smartGoals?category=school_fees';
          break;
        case 'salary_reminder':
          window.location.href = '/budget-planner/screen-3';
          break;
        default:
          window.location.href = '/budget-planner/screen-4';
      }
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getNotificationIcon = (type: string): IconName => {
    switch (type) {
      case 'category_threshold':
      case 'budget_exceeded':
        return 'exclamation-triangle' as IconName;
      case 'salary_reminder':
        return 'money-bill-wave' as IconName;
      case 'school_fee_alert':
        return 'graduation-cap' as IconName;
      case 'savings_tip':
        return 'lightbulb' as IconName;
      case 'bill_reminder':
        return 'file-invoice-dollar' as IconName;
      default:
        return 'bell' as IconName;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="shadow-sm bg-white dark:bg-gray-800 relative z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-20 h-10 rounded-full flex items-center justify-center">
              <Image src="/assets/main.png" alt="Logo" width={100} height={100} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-yellow-600 dark:text-yellow-500">
                CashNova
              </h1>
              <span className="text-xs ml-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                by Infinity
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Transaction History Button */}
            <Link href="/transactionHistory">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                <FontAwesomeIcon icon={"clock-rotate-left"} />
              </button>
            </Link>
            
            {/* Enhanced Notifications Button */}
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                disabled={loading}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon 
                  icon={loading ? "spinner" : "bell"} 
                  className={loading ? "animate-spin" : ""}
                />
                <NotificationBadge count={notificationCount} />
              </button>

              {/* Enhanced Notification Dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Notifications
                      </h3>
                      {notificationCount > 0 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {notificationCount} unread
                          </span>
                          <button
                            onClick={() => {
                              // Mark all as read
                              recentNotifications.forEach(notification => {
                                if (notification.status === 'unread') {
                                  markAsRead(notification._id);
                                }
                              });
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Mark all read
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 cursor-pointer transition-colors ${
                            notification.status === 'unread' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <FontAwesomeIcon 
                                icon={getNotificationIcon(notification.type)}
                                className={`text-lg ${
                                  notification.priority === 'urgent' ? 'text-red-500' :
                                  notification.priority === 'high' ? 'text-orange-500' :
                                  'text-blue-500'
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {notification.title}
                                </p>
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                  {formatTimeAgo(notification.createdAt)}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationAction(notification);
                                    }}
                                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dismissNotification(notification._id);
                                    }}
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    Dismiss
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                              notification.status === 'unread' ? 'bg-blue-500' : 'bg-gray-300'
                            }`} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <FontAwesomeIcon 
                          icon={'bell-slash'} 
                          className="text-3xl text-gray-300 dark:text-gray-600 mb-3" 
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          No notifications yet
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          We&apos;ll notify you about important financial insights and budget alerts
                        </p>
                      </div>
                    )}
                  </div>

                  {recentNotifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href="/budget-planner/screen-4"
                        onClick={() => setShowNotificationDropdown(false)}
                        className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {showNotificationDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotificationDropdown(false)}
          />
        )}
      </header>

      {/* Enhanced Bottom Navigation */}
      <nav className="z-50 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-400 fixed bottom-0 w-full">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link
              href="/dashboard"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={"home"} className="text-xl" />
              <span className="text-xs mt-2">Home</span>
            </Link>
            
            <Link
              href="/analytics&reports"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={"chart-pie"} className="text-xl" />
              <span className="text-xs mt-2">Analytics</span>
            </Link>
            
            <Link
              href="/addTransaction"
              className="text-indigo-600 flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center -mt-6 pulse">
                  <FontAwesomeIcon icon={"plus"} className="text-white text-xl" />
                </div>
              </div>
            </Link>
            
            <Link
              href="/smartGoals"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative"
            >
              <FontAwesomeIcon icon={"bullseye"} className="text-xl" />
              <span className="text-xs mt-2">Goals</span>
            </Link>
            
            <Link
              href="/settings"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative"
            >
              <FontAwesomeIcon icon={'cog'} className="text-xl" />
              <span className="text-xs mt-2">Settings</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default MainNavigation