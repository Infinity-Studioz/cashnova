'use client';

import { useState } from 'react';

export default function TestEmail() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Network error', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Test Email Service
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              placeholder="test@example.com"
            />
          </div>
          
          <button
            onClick={testEmail}
            disabled={!email || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Result:</h3>
            <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p><strong>Environment Check:</strong></p>
          <p>• RESEND_API_KEY: {process.env.NEXT_PUBLIC_HAS_RESEND ? '✅ Set' : '❌ Missing'}</p>
          <p>• Check your browser console and terminal for detailed logs</p>
        </div>
      </div>
    </div>
  );
}