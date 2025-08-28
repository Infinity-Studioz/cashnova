'use client';

import { useSession } from 'next-auth/react';
import { getSessionExpiryInfo } from '@/lib/authUtils';
import { useState, useEffect } from 'react';

export default function SessionInfoCard() {
  const { data: session } = useSession();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    if (session) {
      const info = getSessionExpiryInfo(session);
      setSessionInfo(info);
    }
  }, [session]);

  if (!session || !sessionInfo) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Session Information
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Login Method:</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
            {session.user.provider === 'google' ? 'Google OAuth' : 'Email & Password'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Session Type:</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {sessionInfo.isRemembered ? (
              <span className="text-blue-600 dark:text-blue-400">Extended (30 days)</span>
            ) : (
              <span className="text-gray-600 dark:text-gray-400">Standard (7 days)</span>
            )}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Expires:</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {sessionInfo.expiryDate.toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Days Remaining:</span>
          <span className={`text-sm font-medium ${
            sessionInfo.isExpiringSoon 
              ? 'text-yellow-600 dark:text-yellow-400' 
              : 'text-green-600 dark:text-green-400'
          }`}>
            {sessionInfo.daysUntilExpiry} days
          </span>
        </div>
      </div>
      
      {sessionInfo.isExpiringSoon && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Your session is expiring soon. Please log in again to extend it.
          </p>
        </div>
      )}
    </div>
  );
}