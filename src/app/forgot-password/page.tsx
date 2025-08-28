'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        if (data.rateLimited) {
          setError('Too many password reset attempts. Please wait before trying again.');
        } else {
          setError(data.message || 'Failed to send reset email. Please try again.');
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className="glass-card w-full max-w-md rounded-xl shadow-xl overflow-hidden p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image src="/assets/main.png" width={100} height={100} className="w-30 h-30" alt="logo" />
            </div>

            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Check Your Email</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                We&apos;ve sent password reset instructions to:
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1">
                {email}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Didn&apos;t receive the email?</strong>
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 text-left">
                <li>• Check your spam/junk folder</li>
                <li>• Make sure you entered the correct email</li>
                <li>• Wait a few minutes for delivery</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                  setError('');
                }}
                className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
              >
                Try Different Email
              </button>
              
              <Link 
                href="/login"
                className="block w-full py-3 px-4 gradient-btn text-white text-center rounded-lg"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center p-4'>
      <div className="glass-card w-full max-w-md rounded-xl shadow-xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/assets/main.png" width={100} height={100} className="w-30 h-30" alt="logo" />
          </div>

          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-4">Reset Your Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition duration-200 disabled:opacity-50"
              placeholder="you@example.com"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="gradient-btn w-full py-3 px-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Reset Link...
              </div>
            ) : (
              'Send Reset Link'
            )}
          </button>

          <div className="text-center">
            <Link 
              href="/login" 
              className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}