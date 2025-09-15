// // src/app/settings/page.tsx

// 'use client'
// import { useSession } from 'next-auth/react'
// import { redirect } from 'next/navigation'
// import MainNavigation from '../components/MainNavigation'
// import ToggleSwitch from '../components/ToggleSwitch'
// import AccountLinking from '../components/AccountLinking'
// import SessionInfoCard from '../components/SessionInfoCard'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import '../../lib/fontawesome'
// import SignOutButton from '../components/SignOutButton';
// import Image from 'next/image'

// export default function SettingsPage() {
//   const { data: session, status } = useSession();

//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!session) {
//     redirect('/login');
//   }

//   return (
//     <>
//       <div className="min-h-screen">
//         <MainNavigation />
//         <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
//                 Settings & Security
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Manage your account preferences and security
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 className="bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center"
//               >
//                 <FontAwesomeIcon icon={'shield-alt'} className='mr-2' /> Security Center
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Profile & Security */}
//             <div className="lg:col-span-2 space-y-6">

//               {/* Profile Card */}
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
//                 <div className="border-b border-gray-200 dark:border-gray-700 p-4">
//                   <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
//                     <FontAwesomeIcon icon={'user-circle'} className='mr-2 text-primary' />
//                     Profile Settings
//                   </h3>
//                 </div>
//                 <div className="p-4">
//                   <div className="flex items-center space-x-4 mb-6">
//                     <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
//                       {session.user?.image ? (
//                         <Image
//                           src={session.user.image}
//                           alt="Profile"
//                           fill
//                           className="object-cover"
//                         />
//                       ) : (
//                         <FontAwesomeIcon icon={'user'} className='text-gray-500 dark:text-gray-400 text-2xl' />
//                       )}
//                     </div>
//                     <div>
//                       <h4 className="font-medium text-gray-900 dark:text-white">
//                         {session.user?.name}
//                       </h4>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         {session.user?.email}
//                       </p>
//                       <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 capitalize">
//                         {session.user.provider === 'dual' ? 'Google + Email/Password' :
//                           session.user.provider === 'google' ? 'Google OAuth' :
//                             'Email/Password'} Account
//                       </p>
//                     </div>
//                     <button className="ml-auto text-primary dark:text-primary-light text-sm font-medium">
//                       Edit Profile
//                     </button>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">
//                           Display Name
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           {session.user?.name}
//                         </p>
//                       </div>
//                       <button className="text-primary dark:text-primary-light text-sm font-medium">
//                         Edit
//                       </button>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">
//                           Email Address
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           {session.user?.email}
//                         </p>
//                       </div>
//                       <button className="text-primary dark:text-primary-light text-sm font-medium">
//                         Change
//                       </button>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">
//                           Phone Number
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           +234 810 123 4567
//                         </p>
//                       </div>
//                       <button className="text-primary dark:text-primary-light text-sm font-medium">
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Authentication Methods */}
//               <AccountLinking />

//               {/* Enhanced Security Settings */}
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
//                 <div className="border-b border-gray-200 dark:border-gray-700 p-4">
//                   <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
//                     <FontAwesomeIcon icon={'shield-alt'} className='mr-2 text-primary' />
//                     Security Settings
//                   </h3>
//                 </div>
//                 <div className="p-4 space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         App Lock
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Require PIN or biometric to open app
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Biometric Login
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Use fingerprint or face recognition
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Change PIN
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Update your 4-digit security PIN
//                       </p>
//                     </div>
//                     <button className="text-primary dark:text-primary-light text-sm font-medium">
//                       Change
//                     </button>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Two-Factor Authentication
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Add an extra layer of security
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>
//                 </div>
//               </div>

//               {/* Bank Connections */}
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
//                 <div className="border-b border-gray-200 dark:border-gray-700 p-4">
//                   <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
//                     <FontAwesomeIcon icon={'university'} className='mr-2 text-primary' />
//                     Bank Connections
//                   </h3>
//                 </div>
//                 <div className="p-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Connected accounts (3)
//                     </p>
//                     <button className="text-primary dark:text-primary-light text-sm font-medium flex items-center">
//                       <FontAwesomeIcon icon={'plus'} className='mr-1' /> Add Account
//                     </button>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
//                       <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
//                         <FontAwesomeIcon icon={'university'} className='text-blue-500 dark:text-blue-400' />
//                       </div>
//                       <div className="ml-3">
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">
//                           Guaranty Trust Bank
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           ****1234 • Savings
//                         </p>
//                       </div>
//                       <button className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
//                         <FontAwesomeIcon icon={'ellipsis-v'} />
//                       </button>
//                     </div>

//                     <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
//                       <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
//                         <FontAwesomeIcon icon={'university'} className='text-green-500 dark:text-green-400' />
//                       </div>
//                       <div className="ml-3">
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">
//                           First Bank of Nigeria
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           ****5678 • Current
//                         </p>
//                       </div>
//                       <button className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
//                         <FontAwesomeIcon icon={'ellipsis-v'} />
//                       </button>
//                     </div>

//                     <div className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
//                       <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
//                         <FontAwesomeIcon icon={'university'} className='text-purple-500 dark:text-purple-400' />
//                       </div>
//                       <div className="ml-3">
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">
//                           Zenith Bank
//                         </p>
//                         <p className="text-xs text-gray-500 dark:text-gray-400">
//                           ****9012 • Savings
//                         </p>
//                       </div>
//                       <button className="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
//                         <FontAwesomeIcon icon={'ellipsis-v'} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Right Column - Session Info & Notifications */}
//             <div className="space-y-6">

//               {/* Session Information */}
//               <SessionInfoCard />

//               {/* Simplified Preferences */}
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
//                 <div className="border-b border-gray-200 dark:border-gray-700 p-4">
//                   <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
//                     <FontAwesomeIcon icon={'cog'} className='mr-2 text-primary' />
//                     Preferences
//                   </h3>
//                 </div>
//                 <div className="p-4 space-y-6">
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
//                       Currency
//                     </p>
//                     <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                       <span>₦</span>
//                       <span>Nigerian Naira (NGN)</span>
//                     </div>
//                   </div>

//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
//                       Date Format
//                     </p>
//                     <select className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
//                       <option>DD/MM/YYYY</option>
//                       <option>MM/DD/YYYY</option>
//                       <option>YYYY-MM-DD</option>
//                     </select>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Dark Mode
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Switch between light and dark theme
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>

//                   <SignOutButton />
//                 </div>
//               </div>

//               {/* Finance-focused Notifications */}
//               <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
//                 <div className="border-b border-gray-200 dark:border-gray-700 p-4">
//                   <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
//                     <FontAwesomeIcon icon={'bell'} className='mr-2 text-primary' />
//                     Notifications
//                   </h3>
//                 </div>
//                 <div className="p-4 space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Transaction Alerts
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Notify me for all transactions
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Budget Alerts
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Alert when approaching budget limits
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Weekly Summary
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Weekly spending summary emails
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Goal Reminders
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Progress updates on savings goals
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         AI Insights
//                       </p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Smart financial recommendations
//                       </p>
//                     </div>
//                     <ToggleSwitch />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//         <br /><br /><br /><br />
//       </div>
//     </>
//   )
// }

'use client'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import MainNavigation from '../components/MainNavigation'
import ToggleSwitch from '../components/ToggleSwitch'
import AccountLinking from '../components/AccountLinking'
import SessionInfoCard from '../components/SessionInfoCard'
import SignOutButton from '../components/SignOutButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import '../../lib/fontawesome'

// Types based on your models
interface UserSettings {
  currency: 'NGN' | 'USD' | 'EUR' | 'GBP';
  locale: 'en-NG' | 'en-US' | 'en-GB';
  theme: 'light' | 'dark' | 'system';
  biometricLogin: boolean;
  notifications: {
    budgetAlerts: boolean;
    weeklySummary: boolean;
  };
  dataSync: {
    enabled: boolean;
    provider: 'googleDrive' | 'dropbox' | 'iCloud' | null;
  };
}

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

interface BankConnection {
  _id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  status: 'active' | 'inactive' | 'error';
  linkedAt: string;
  lastSync?: string;
}

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  phoneNumber?: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();

  // State management
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [alertSettings, setAlertSettings] = useState<AlertSettings | null>(null);
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeEditModal, setActiveEditModal] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Authentication checks
  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.email) return;

      setLoading(true);
      await Promise.all([
        fetchUserSettings(),
        fetchAlertSettings(),
        fetchBankConnections(),
      ]);
      setLoading(false);
    };

    if (session?.user?.email) {
      loadData();
    }
  }, [session?.user?.email]);


  // Data fetching functions
  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setUserSettings(data.settings);
      } else {
        // If no settings exist, create default ones
        const defaultSettings: UserSettings = {
          currency: 'NGN',
          locale: 'en-NG',
          theme: 'system',
          biometricLogin: false,
          notifications: {
            budgetAlerts: true,
            weeklySummary: true,
          },
          dataSync: {
            enabled: false,
            provider: null,
          },
        };
        setUserSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const fetchAlertSettings = async () => {
    try {
      const response = await fetch('/api/alert-settings');
      if (response.ok) {
        const data = await response.json();
        setAlertSettings(data.alertSettings);
      } else {
        // Default alert settings
        const defaultAlertSettings: AlertSettings = {
          categoryThreshold: {
            enabled: true,
            percentage: 80,
          },
          budgetExceeded: {
            enabled: true,
            percentage: 5,
          },
          weeklySummary: {
            enabled: false,
            day: 'Sunday',
            time: '9:00 AM',
          },
          notificationPreferences: {
            pushNotifications: true,
            emailAlerts: true,
            smsAlerts: false,
            inAppNotifications: true,
          },
          nigerianContext: {
            salaryDayReminders: true,
            schoolFeeAlerts: true,
            festiveSeasonWarnings: true,
            transportPriceAlerts: true,
          },
        };
        setAlertSettings(defaultAlertSettings);
      }
    } catch (error) {
      console.error('Error fetching alert settings:', error);
      toast.error('Failed to load notification settings');
    }
  };

  const fetchBankConnections = async () => {
    try {
      // Note: You may need to create this endpoint in your API
      const response = await fetch('/api/bank-connections');
      if (response.ok) {
        const data = await response.json();
        setBankConnections(data.connections || []);
      }
    } catch (error) {
      console.error('Error fetching bank connections:', error);
      // Set mock data for now
      setBankConnections([
        {
          _id: '1',
          bankName: 'Guaranty Trust Bank',
          accountNumber: '****1234',
          accountType: 'Savings',
          status: 'active',
          linkedAt: new Date().toISOString(),
          lastSync: new Date().toISOString(),
        },
        {
          _id: '2',
          bankName: 'First Bank of Nigeria',
          accountNumber: '****5678',
          accountType: 'Current',
          status: 'active',
          linkedAt: new Date().toISOString(),
          lastSync: new Date().toISOString(),
        },
        {
          _id: '3',
          bankName: 'Zenith Bank',
          accountNumber: '****9012',
          accountType: 'Savings',
          status: 'active',
          linkedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  // Save functions
  const saveUserSettings = async (updatedSettings: Partial<UserSettings>) => {
    setSaveLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setUserSettings(data.settings);
        toast.success('Settings updated successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving user settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  const saveAlertSettings = async (updatedSettings: Partial<AlertSettings>) => {
    setSaveLoading(true);
    try {
      const response = await fetch('/api/alert-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        const data = await response.json();
        setAlertSettings(data.alertSettings);
        toast.success('Notification settings updated');
      } else {
        throw new Error('Failed to save alert settings');
      }
    } catch (error) {
      console.error('Error saving alert settings:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaveLoading(false);
    }
  };

  // Toggle functions for switches
  const handleSettingToggle = (setting: keyof UserSettings, value?: any) => {
    if (!userSettings) return;

    let updatedSettings: Partial<UserSettings>;

    if (setting === 'biometricLogin') {
      updatedSettings = {
        ...userSettings,
        biometricLogin: !userSettings.biometricLogin,
      };
    } else if (setting === 'theme') {
      updatedSettings = {
        ...userSettings,
        theme: value,
      };
    } else if (setting === 'currency') {
      updatedSettings = {
        ...userSettings,
        currency: value,
      };
    } else {
      updatedSettings = { ...userSettings };
    }

    setUserSettings(updatedSettings as UserSettings);
    saveUserSettings(updatedSettings);
  };

  const handleAlertToggle = (category: string, setting: string) => {
    if (!alertSettings) return;

    let updatedSettings = { ...alertSettings };

    if (category === 'notificationPreferences') {
      updatedSettings.notificationPreferences = {
        ...updatedSettings.notificationPreferences,
        [setting]: !updatedSettings.notificationPreferences[setting as keyof typeof updatedSettings.notificationPreferences],
      };
    } else if (category === 'nigerianContext') {
      updatedSettings.nigerianContext = {
        ...updatedSettings.nigerianContext,
        [setting]: !updatedSettings.nigerianContext[setting as keyof typeof updatedSettings.nigerianContext],
      };
    } else if (category === 'categoryThreshold') {
      updatedSettings.categoryThreshold = {
        ...updatedSettings.categoryThreshold,
        enabled: !updatedSettings.categoryThreshold.enabled,
      };
    } else if (category === 'budgetExceeded') {
      updatedSettings.budgetExceeded = {
        ...updatedSettings.budgetExceeded,
        enabled: !updatedSettings.budgetExceeded.enabled,
      };
    } else if (category === 'weeklySummary') {
      updatedSettings.weeklySummary = {
        ...updatedSettings.weeklySummary,
        enabled: !updatedSettings.weeklySummary.enabled,
      };
    }

    setAlertSettings(updatedSettings);
    saveAlertSettings(updatedSettings);
  };

  // Edit modal handlers
  const handleEditProfile = (field: string) => {
    setActiveEditModal(field);
    setFormData({
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phoneNumber: '+234 810 123 4567', // Mock data for now
    });
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      // Note: You may need to create a profile update endpoint
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setActiveEditModal(null);
        // Update session if needed
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaveLoading(false);
    }
  };

  // Loading check
  if (status === 'loading' || loading) {
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
                className="bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50 transition-colors"
                onClick={() => toast.info('Security Center coming soon!')}
              >
                <FontAwesomeIcon icon={'shield-alt'} className='mr-2' /> Security Center
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Security */}
            <div className="lg:col-span-2 space-y-6">

              {/* Enhanced Profile Card with Edit Functionality */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'user-circle'} className='mr-2 text-primary' />
                    Profile Settings
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <FontAwesomeIcon icon={'user'} className='text-gray-500 dark:text-gray-400 text-2xl' />
                      )}
                      <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs hover:bg-primary-dark transition-colors">
                        <FontAwesomeIcon icon={'camera'} />
                      </button>
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
                    <button
                      className="ml-auto text-primary dark:text-primary-light text-sm font-medium hover:underline"
                      onClick={() => handleEditProfile('general')}
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Display Name
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.user?.name}
                        </p>
                      </div>
                      <button
                        className="text-primary dark:text-primary-light text-sm font-medium hover:underline"
                        onClick={() => handleEditProfile('name')}
                        disabled={saveLoading}
                      >
                        Edit
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {session.user?.email}
                        </p>
                      </div>
                      <button
                        className="text-primary dark:text-primary-light text-sm font-medium hover:underline"
                        onClick={() => handleEditProfile('email')}
                        disabled={saveLoading}
                      >
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Phone Number
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +234 810 123 4567
                        </p>
                      </div>
                      <button
                        className="text-primary dark:text-primary-light text-sm font-medium hover:underline"
                        onClick={() => handleEditProfile('phone')}
                        disabled={saveLoading}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Profile Modal */}
              {activeEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Edit {activeEditModal === 'name' ? 'Display Name' :
                          activeEditModal === 'email' ? 'Email Address' :
                            activeEditModal === 'phone' ? 'Phone Number' : 'Profile'}
                      </h3>
                      <button
                        onClick={() => setActiveEditModal(null)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <FontAwesomeIcon icon={'times'} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {activeEditModal === 'name' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter your full name"
                          />
                        </div>
                      )}

                      {activeEditModal === 'email' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter your email address"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            You'll need to verify your new email address
                          </p>
                        </div>
                      )}

                      {activeEditModal === 'phone' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phoneNumber || ''}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="+234 xxx xxx xxxx"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end space-x-3 mt-6">
                      <button
                        onClick={() => setActiveEditModal(null)}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        disabled={saveLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        disabled={saveLoading}
                      >
                        {saveLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Authentication Methods - Enhanced */}
              <AccountLinking />

              {/* Enhanced Security Settings with Real Toggle Integration */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'shield-alt'} className='mr-2 text-primary' />
                    Security Settings
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        App Lock
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require PIN or biometric to open app
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={userSettings?.biometricLogin || false}
                      onChange={() => handleSettingToggle('biometricLogin')}
                      disabled={saveLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Biometric Login
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={userSettings?.biometricLogin || false}
                      onChange={() => handleSettingToggle('biometricLogin')}
                      disabled={saveLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Change PIN
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update your 4-digit security PIN
                      </p>
                    </div>
                    <button
                      className="text-primary dark:text-primary-light text-sm font-medium hover:underline"
                      onClick={() => toast.info('PIN change functionality coming soon')}
                      disabled={saveLoading}
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security
                      </p>
                    </div>
                    <button
                      className="text-primary dark:text-primary-light text-sm font-medium hover:underline"
                      onClick={() => toast.info('2FA setup coming soon')}
                      disabled={saveLoading}
                    >
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Bank Connections with Real Data */}
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
                      Connected accounts ({bankConnections.length})
                    </p>
                    <button
                      className="text-primary dark:text-primary-light text-sm font-medium flex items-center hover:underline"
                      onClick={() => toast.info('Bank connection coming soon')}
                      disabled={saveLoading}
                    >
                      <FontAwesomeIcon icon={'plus'} className='mr-1' /> Add Account
                    </button>
                  </div>

                  <div className="space-y-3">
                    {bankConnections.map((bank, index) => (
                      <div key={bank._id} className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? 'bg-blue-50 dark:bg-blue-900/30' :
                          index === 1 ? 'bg-green-50 dark:bg-green-900/30' :
                            'bg-purple-50 dark:bg-purple-900/30'
                          }`}>
                          <FontAwesomeIcon
                            icon={'university'}
                            className={`${index === 0 ? 'text-blue-500 dark:text-blue-400' :
                              index === 1 ? 'text-green-500 dark:text-green-400' :
                                'text-purple-500 dark:text-purple-400'
                              }`}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {bank.bankName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {bank.accountNumber} • {bank.accountType}
                          </p>
                          <div className="flex items-center mt-1 space-x-2">
                            <div className={`w-2 h-2 rounded-full ${bank.status === 'active' ? 'bg-green-500' :
                              bank.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></div>
                            <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                              {bank.status}
                            </span>
                            {bank.lastSync && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">
                                • Last sync: {new Date(bank.lastSync).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1"
                            onClick={() => toast.info(`Bank options for ${bank.bankName}`)}
                          >
                            <FontAwesomeIcon icon={'ellipsis-v'} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {bankConnections.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <FontAwesomeIcon icon={'university'} className="text-3xl mb-3 opacity-50" />
                        <p className="text-sm">No bank accounts connected</p>
                        <p className="text-xs mt-1">Connect your Nigerian bank accounts for automatic transaction sync</p>
                      </div>
                    )}
                  </div>

                  {bankConnections.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start">
                        <FontAwesomeIcon icon={'info-circle'} className="text-blue-500 dark:text-blue-400 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                            Bank Integration Status
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Your accounts sync automatically every 6 hours. Manual sync available in transaction history.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Right Column - Session Info & Enhanced Notifications */}
            <div className="space-y-6">

              {/* Session Information */}
              <SessionInfoCard />

              {/* Enhanced Preferences with Real Data */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'cog'} className='mr-2 text-primary' />
                    Preferences
                  </h3>
                </div>
                <div className="p-4 space-y-6">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Currency
                    </p>
                    <select
                      value={userSettings?.currency || 'NGN'}
                      onChange={(e) => handleSettingToggle('currency', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      disabled={saveLoading}
                    >
                      <option value="NGN">₦ Nigerian Naira (NGN)</option>
                      <option value="USD">$ US Dollar (USD)</option>
                      <option value="EUR">€ Euro (EUR)</option>
                      <option value="GBP">£ British Pound (GBP)</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Language & Region
                    </p>
                    <select
                      value={userSettings?.locale || 'en-NG'}
                      onChange={(e) => saveUserSettings({ locale: e.target.value as any })}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      disabled={saveLoading}
                    >
                      <option value="en-NG">English (Nigeria)</option>
                      <option value="en-US">English (United States)</option>
                      <option value="en-GB">English (United Kingdom)</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Date Format
                    </p>
                    <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Dark Mode
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <select
                      value={userSettings?.theme || 'system'}
                      onChange={(e) => handleSettingToggle('theme', e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                      disabled={saveLoading}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <SignOutButton />
                  </div>
                </div>
              </div>

              {/* Enhanced Nigerian Finance-focused Notifications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden settings-card transition-all duration-200">
                <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <FontAwesomeIcon icon={'bell'} className='mr-2 text-primary' />
                    Notifications
                  </h3>
                </div>
                <div className="p-4 space-y-6">

                  {/* Financial Alerts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <FontAwesomeIcon icon={'chart-line'} className='mr-2 text-green-500' />
                      Financial Alerts
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Transaction Alerts
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Notify me for all transactions
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.notificationPreferences.pushNotifications || false}
                          onChange={() => handleAlertToggle('notificationPreferences', 'pushNotifications')}
                          disabled={saveLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Budget Alerts
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Alert when approaching budget limits
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.categoryThreshold.enabled || false}
                          onChange={() => handleAlertToggle('categoryThreshold', 'enabled')}
                          disabled={saveLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Weekly Summary
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Weekly spending summary emails
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.weeklySummary.enabled || false}
                          onChange={() => handleAlertToggle('weeklySummary', 'enabled')}
                          disabled={saveLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nigerian Context Alerts */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <FontAwesomeIcon icon={'flag'} className='mr-2 text-green-600' />
                      Nigerian Context
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Salary Day Reminders
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            End-of-month salary cycle alerts
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.nigerianContext.salaryDayReminders || false}
                          onChange={() => handleAlertToggle('nigerianContext', 'salaryDayReminders')}
                          disabled={saveLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            School Fees Alerts
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            January & September school fees reminders
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.nigerianContext.schoolFeeAlerts || false}
                          onChange={() => handleAlertToggle('nigerianContext', 'schoolFeeAlerts')}
                          disabled={saveLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Festive Season Warnings
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            December spending pattern alerts
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.nigerianContext.festiveSeasonWarnings || false}
                          onChange={() => handleAlertToggle('nigerianContext', 'festiveSeasonWarnings')}
                          disabled={saveLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Transport Price Alerts
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Fuel price volatility notifications
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.nigerianContext.transportPriceAlerts || false}
                          onChange={() => handleAlertToggle('nigerianContext', 'transportPriceAlerts')}
                          disabled={saveLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* AI & Goals */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <FontAwesomeIcon icon={'brain'} className='mr-2 text-purple-500' />
                      AI & Goals
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Goal Reminders
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Progress updates on savings goals
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.notificationPreferences.emailAlerts || false}
                          onChange={() => handleAlertToggle('notificationPreferences', 'emailAlerts')}
                          disabled={saveLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            AI Insights
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Smart financial recommendations
                          </p>
                        </div>
                        <ToggleSwitch
                          checked={alertSettings?.notificationPreferences.inAppNotifications || false}
                          onChange={() => handleAlertToggle('notificationPreferences', 'inAppNotifications')}
                          disabled={saveLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Methods */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Delivery Methods
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-notifications"
                          checked={alertSettings?.notificationPreferences.emailAlerts || false}
                          onChange={() => handleAlertToggle('notificationPreferences', 'emailAlerts')}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          disabled={saveLoading}
                        />
                        <label htmlFor="email-notifications" className="text-sm text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sms-notifications"
                          checked={alertSettings?.notificationPreferences.smsAlerts || false}
                          onChange={() => handleAlertToggle('notificationPreferences', 'smsAlerts')}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                          disabled={saveLoading}
                        />
                        <label htmlFor="sms-notifications" className="text-sm text-gray-700 dark:text-gray-300">
                          SMS
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <br /><br /><br /><br />
      </div>
    </>
  );
}