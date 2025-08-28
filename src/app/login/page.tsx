'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRememberMe } from '@/hooks/useRememberMe';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { rememberMe, rememberedEmail, updateRememberMe } = useRememberMe();

  // Auto-fill email if remembered
  useEffect(() => {
    if (rememberedEmail && !email) {
      setEmail(rememberedEmail);
    }
  }, [rememberedEmail, email]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Reset errors
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    // Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      // Update remember me preference
      updateRememberMe(rememberMe, email);

      // Sign in with credentials
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle specific error messages
        if (result.error.includes('Too many failed login attempts')) {
          setEmailError('Account temporarily locked due to too many failed attempts. Please try again later.');
        } else if (result.error.includes('Too many login attempts')) {
          setPasswordError('Too many login attempts. Please wait before trying again.');
        } else if (result.error === 'No account found with this email') {
          setEmailError('No account found with this email address.');
        } else if (result.error === 'Invalid password') {
          setPasswordError('Incorrect password. Please try again.');
        } else if (result.error === 'Account is deactivated') {
          setEmailError('This account has been deactivated. Please contact support.');
        } else {
          setPasswordError('Login failed. Please check your credentials.');
        }
      } else if (result?.ok) {
        // Success - redirect to dashboard
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setPasswordError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center p-4'>
      <div className="glass-card w-full max-w-md rounded-xl shadow-xl overflow-hidden p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image src="/assets/main.png" width={100} height={100} className="w-30 h-30" alt="logo" />
          </div>

          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-4">Welcome back to your finance hub</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Track. Save. Reimagine.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: "/dashboard" })}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-500 bg-gray-50 dark:bg-gray-700 rounded-lg py-3 px-4 hover:bg-gray-100 transition duration-200 mb-6 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="text-gray-700 dark:text-gray-200 font-medium">Continue with Google</span>
          </button>

          {/* Separator */}
          <div className="separator">
            <span className="text-xs text-gray-500 dark:text-gray-300">or</span>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
            <div className="relative">
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
            </div>
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition duration-200 pr-12 disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle absolute text-gray-400 hover:text-gray-600 dark:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {showPassword ? (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a10.044 10.044 0 013.147-4.568M6.23 6.23A9.965 9.965 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.965 9.965 0 01-1.045 2.018M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => updateRememberMe(e.target.checked, email)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me for 30 days
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="gradient-btn w-full py-3 px-4 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Login'
            )}
          </button>

          {/* Remember Me Info */}
          {rememberMe && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Your session will be extended to 30 days for convenience.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Bottom Navigation */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don&apos;t have an account? 
            <Link href="/signup" className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-200 ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}