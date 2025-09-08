// src/app/addTransaction/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainNavigation from '../components/MainNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../lib/fontawesome'
import { useSession } from 'next-auth/react';
import AuthButtons from '../components/AuthButtons'
import { toast } from 'sonner'

// Nigerian categories and suggestions
const NIGERIAN_CATEGORIES = {
  expense: [
    { value: 'Food & Dining', label: 'Food & Dining', icon: 'utensils' },
    { value: 'Transport', label: 'Transport', icon: 'car' },
    { value: 'Rent/Housing', label: 'Rent/Housing', icon: 'home' },
    { value: 'Bills', label: 'Bills (NEPA, Water, Internet)', icon: 'bolt' },
    { value: 'Family Support', label: 'Family Support', icon: 'heart' },
    { value: 'School Fees', label: 'School Fees', icon: 'graduation-cap' },
    { value: 'Church/Mosque', label: 'Church/Mosque', icon: 'praying-hands' },
    { value: 'Health/Medical', label: 'Health/Medical', icon: 'heartbeat' },
    { value: 'Entertainment', label: 'Entertainment', icon: 'film' },
    { value: 'Shopping', label: 'Shopping', icon: 'shopping-bag' },
    { value: 'Personal Care', label: 'Personal Care', icon: 'cut' },
    { value: 'Emergency Fund', label: 'Emergency Fund', icon: 'shield-alt' },
    { value: 'Other Expenses', label: 'Other', icon: 'receipt' }
  ],
  income: [
    { value: 'Salary', label: 'Salary', icon: 'money-bill-wave' },
    { value: 'Freelance Work', label: 'Freelance Work', icon: 'laptop-code' },
    { value: 'Business Income', label: 'Business Income', icon: 'briefcase' },
    { value: 'Investment Returns', label: 'Investment Returns', icon: 'chart-line' },
    { value: 'Gift/Family Support', label: 'Gift/Family Support', icon: 'gift' },
    { value: 'Side Hustle', label: 'Side Hustle', icon: 'hammer' },
    { value: 'Rental Income', label: 'Rental Income', icon: 'building' },
    { value: 'Other Income', label: 'Other Income', icon: 'plus-circle' }
  ]
};

const NIGERIAN_MERCHANTS = [
  // Banks
  'GTBank', 'First Bank', 'Zenith Bank', 'Access Bank', 'UBA', 'Stanbic IBTC',
  // Transport
  'Uber', 'Bolt', 'InDrive', 'Lagos BRT', 'ABC Transport',
  // Shopping
  'Shoprite', 'Game', 'Spar', 'Park n Shop', 'Jumia', 'Konga',
  // Food
  'KFC', 'Dominos', 'Mr Biggs', 'Chicken Republic', 'Sweet Sensation',
  // Utilities
  'EKEDC', 'DSTV', 'GOtv', 'Airtel', 'MTN', 'Glo', '9mobile',
  // Fuel
  'Total', 'Mobil', 'NNPC', 'Oando', 'Conoil'
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Debit/Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'pos', label: 'POS Terminal' },
  { value: 'online', label: 'Online Payment' },
  { value: 'other', label: 'Other' }
];

export default function AddTransactionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [transactionType, setTransactionType] = useState('expense');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    merchant: '',
    location: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    recurring: false,
    recurringPattern: 'monthly'
  });
  
  // UI state
  const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState('');

  useEffect(() => {
    // Auto-suggest category based on merchant
    if (formData.merchant) {
      const merchant = formData.merchant.toLowerCase();
      let suggested = '';
      
      if (['uber', 'bolt', 'indrive', 'brt', 'keke', 'okada', 'danfo'].some(t => merchant.includes(t))) {
        suggested = 'Transport';
      } else if (['shoprite', 'game', 'spar', 'jumia', 'konga', 'market'].some(s => merchant.includes(s))) {
        suggested = 'Shopping';
      } else if (['kfc', 'dominos', 'chicken', 'restaurant', 'food', 'suya'].some(f => merchant.includes(f))) {
        suggested = 'Food & Dining';
      } else if (['gtbank', 'first bank', 'zenith', 'access', 'uba'].some(b => merchant.includes(b))) {
        suggested = 'Bills';
      } else if (['nepa', 'ekedc', 'dstv', 'gotv', 'airtel', 'mtn', 'glo'].some(u => merchant.includes(u))) {
        suggested = 'Bills';
      } else if (['total', 'mobil', 'nnpc', 'oando', 'petrol', 'fuel'].some(f => merchant.includes(f))) {
        suggested = 'Transport';
      }
      
      setSuggestedCategory(suggested);
    } else {
      setSuggestedCategory('');
    }
  }, [formData.merchant]);

  const handleMerchantChange = (value: string) => {
    setFormData(prev => ({ ...prev, merchant: value }));
    
    // Filter suggestions
    if (value) {
      const filtered = NIGERIAN_MERCHANTS.filter(merchant =>
        merchant.toLowerCase().includes(value.toLowerCase())
      );
      setMerchantSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setMerchantSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (merchant: string) => {
    setFormData(prev => ({ ...prev, merchant }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }
      
      if (!formData.date) {
        toast.error('Please select a date');
        return;
      }

      // Prepare transaction data
      const transactionData = {
        type: transactionType,
        amount: parseFloat(formData.amount),
        category: formData.category || suggestedCategory,
        merchant: formData.merchant.trim() || undefined,
        location: formData.location.trim() || undefined,
        paymentMethod: formData.paymentMethod || 'cash',
        date: formData.date,
        note: formData.note.trim() || undefined,
        recurring: formData.recurring,
        recurringPattern: formData.recurring ? formData.recurringPattern : undefined
      };

      // Submit to API
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add transaction');
      }

      const result = await response.json();
      
      // Show success message
      toast.success(`Transaction added successfully! ${result.transaction.formattedAmount}`);
      
      // Show AI insights if available
      if (result.aiInsights?.suggestedRecurring) {
        toast.info(`💡 This looks like a recurring transaction. Consider marking future ${formData.merchant} payments as recurring.`);
      }
      
      if (result.aiInsights?.flaggedForReview) {
        toast.warning(`⚠️ ${result.aiInsights.insight}`);
      }

      // Show recommendations
      if (result.recommendations?.length > 0) {
        setTimeout(() => {
          result.recommendations.forEach((rec: any, index: number) => {
            setTimeout(() => {
              toast.info(rec.message);
            }, index * 2000); // Stagger recommendations
          });
        }, 1000);
      }

      // Reset form
      setFormData({
        amount: '',
        category: '',
        merchant: '',
        location: '',
        paymentMethod: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        recurring: false,
        recurringPattern: 'monthly'
      });

      // Navigate back to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast.error(error.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return (
    <>
      <p>You must be signed in</p>
      <AuthButtons />
    </>
  );

  return (
    <>
      <div className="min-h-screen flex flex-col pb-16">
        <MainNavigation />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Transaction
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Record your income or expenses
            </p>
          </div>

          {/* Transaction Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setTransactionType('expense')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg border focus:z-10 focus:ring-2 focus:ring-indigo-500 ${
                  transactionType === 'expense'
                    ? 'text-white bg-indigo-600 border-indigo-600'
                    : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-indigo-700'
                }`}
              >
                <FontAwesomeIcon icon={'arrow-down'} className='mr-2' /> Expense
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('income')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border focus:z-10 focus:ring-2 focus:ring-indigo-500 ${
                  transactionType === 'income'
                    ? 'text-white bg-indigo-600 border-indigo-600'
                    : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-indigo-700'
                }`}
              >
                <FontAwesomeIcon icon={'arrow-up'} className='mr-2' /> Income
              </button>
            </div>
          </div>

          {/* Transaction Form */}
          <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800">
            <form onSubmit={handleSubmit}>
              {/* Amount Field */}
              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 dark:text-white">₦</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-gray-100 border border-gray-300 text-gray-900 dark:border-gray-700 dark:text-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 p-2.5"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Merchant/Description Field */}
              <div className="mb-6 relative">
                <label
                  htmlFor="merchant"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Merchant/Description
                </label>
                <input
                  type="text"
                  id="merchant"
                  value={formData.merchant}
                  onChange={(e) => handleMerchantChange(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="e.g., Shoprite, Uber, GTBank"
                />
                
                {/* Merchant Suggestions */}
                {showSuggestions && merchantSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
                    {merchantSuggestions.map((merchant, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSuggestion(merchant)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      >
                        {merchant}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Field */}
              <div className="mb-6">
                <label
                  htmlFor="location"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Location (Optional)
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="e.g., Victoria Island, Ikeja, Abuja"
                />
              </div>

              {/* Category Dropdown */}
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Category
                  {suggestedCategory && (
                    <span className="ml-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      Suggested: {suggestedCategory}
                    </span>
                  )}
                </label>
                <select
                  id="category"
                  value={formData.category || suggestedCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-gray-50 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option value="">Select a category</option>
                  {NIGERIAN_CATEGORIES[transactionType as keyof typeof NIGERIAN_CATEGORIES].map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label
                  htmlFor="payment"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Payment Method
                </label>
                <select
                  id="payment"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                >
                  <option value="">Select payment method</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Picker */}
              <div className="mb-6">
                <label
                  htmlFor="date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  required
                />
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <label
                  htmlFor="notes"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  rows={2}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Add any details about this transaction"
                />
              </div>

              {/* Recurring Toggle */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="recurring" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                  Recurring Transaction
                </label>
              </div>

              {/* Recurring Options */}
              {formData.recurring && (
                <div className="mb-6">
                  <label
                    htmlFor="frequency"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                  >
                    Frequency
                  </label>
                  <select
                    id="frequency"
                    value={formData.recurringPattern}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringPattern: e.target.value }))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={'spinner'} className="animate-spin mr-2" />
                    Adding Transaction...
                  </>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  )
}