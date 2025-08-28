'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function AccountLinking() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!session?.user) return null;

  // Determine current authentication methods
  const isGoogleUser = session.user.provider === 'google';
  const isCredentialsUser = session.user.provider === 'credentials';
  const isDualUser = session.user.provider === 'dual';
  const hasPassword = isCredentialsUser || isDualUser;
  const hasGoogle = isGoogleUser || isDualUser;

  const handleAddPassword = async () => {
    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-password',
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setShowPasswordForm(false);
        setPassword('');
        setConfirmPassword('');
        // Force session refresh
        window.location.reload();
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Add password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoogle = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add-google',
          currentPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.requiresGoogleSignIn) {
          setSuccess('Redirecting to Google sign-in...');
          setCurrentPassword('');
          // Redirect to Google OAuth for linking
          window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent('/settings')}`;
        } else {
          setSuccess(data.message);
          await update();
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePassword = async () => {
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Current password is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/link-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove-password',
          currentPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        setShowRemoveForm(false);
        setCurrentPassword('');
        await update();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Account Authentication Methods
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Google OAuth Status */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Google Sign-In</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasGoogle ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            {hasGoogle ? (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                ✓ Active
              </span>
            ) : (
              <button
                onClick={() => {
                  setError('');
                  setSuccess('');
                  // For credentials users, prompt for password first
                  const password = prompt('Enter your current password to link Google account:');
                  if (password) {
                    setCurrentPassword(password);
                    handleAddGoogle();
                  }
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                Link Google
              </button>
            )}
          </div>
        </div>

        {/* Password Authentication Status */}
        <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Email & Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {hasPassword ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasPassword ? (
              <>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                  ✓ Active
                </span>
                {isDualUser && (
                  <button
                    onClick={() => setShowRemoveForm(!showRemoveForm)}
                    className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
              >
                Add Password
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Password Form */}
      {showPasswordForm && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Add Password Authentication</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200"
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Password'}
              </button>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Password Form */}
      {showRemoveForm && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-3">Remove Password Authentication</h4>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">
            ⚠️ After removing password authentication, you&apos;ll only be able to sign in with Google.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-red-300 dark:border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-600 dark:text-gray-200"
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRemovePassword}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Removing...' : 'Remove Password'}
              </button>
              <button
                onClick={() => setShowRemoveForm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}