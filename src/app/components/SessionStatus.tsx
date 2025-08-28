'use client';

import { useSession } from 'next-auth/react';
import { getSessionExpiryInfo } from '@/lib/authUtils';
import { useState, useEffect } from 'react';

export default function SessionStatus() {
  const { data: session } = useSession();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    if (session) {
      const info = getSessionExpiryInfo(session);
      setSessionInfo(info);
    }
  }, [session]);

  if (!session || !sessionInfo) return null;

  // Don't show anything if session is not expiring soon
  if (!sessionInfo.isExpiringSoon) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Session Expiring Soon
          </h3>
          <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
            <p>Your session will expire in {sessionInfo.daysUntilExpiry} days.</p>
            <p className="mt-1">
              {sessionInfo.isRemembered ? (
                'Extended session active (30 days total)'
              ) : (
                'Standard session (7 days total)'
              )}
            </p>
          </div>
          <div className="mt-2">
            <button
              onClick={() => window.location.reload()}
              className="text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
            >
              Extend Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}