// // src/app/addTransaction/page.tsx
// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import MainNavigation from '../components/MainNavigation'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import '../../lib/fontawesome'
// import { useSession } from 'next-auth/react';
// import AuthButtons from '../components/AuthButtons'
// import { toast } from 'sonner'

// // Enhanced Nigerian categories with cultural context
// const NIGERIAN_CATEGORIES = {
//   expense: [
//     { value: 'Food & Dining', label: 'Food & Dining', icon: 'utensils', popular: true },
//     { value: 'Transport', label: 'Transport', icon: 'car', popular: true },
//     { value: 'Rent/Housing', label: 'Rent/Housing', icon: 'home', popular: true },
//     { value: 'Bills', label: 'Bills (NEPA, Water, Internet)', icon: 'bolt', popular: true },
//     { value: 'Family Support', label: 'Family Support', icon: 'heart', cultural: true },
//     { value: 'School Fees', label: 'School Fees', icon: 'graduation-cap', seasonal: true },
//     { value: 'Church/Mosque', label: 'Church/Mosque', icon: 'praying-hands', cultural: true },
//     { value: 'Health/Medical', label: 'Health/Medical', icon: 'heartbeat' },
//     { value: 'Entertainment', label: 'Entertainment', icon: 'film' },
//     { value: 'Shopping', label: 'Shopping', icon: 'shopping-bag' },
//     { value: 'Personal Care', label: 'Personal Care', icon: 'cut' },
//     { value: 'Emergency Fund', label: 'Emergency Fund', icon: 'shield-alt' },
//     { value: 'Other Expenses', label: 'Other', icon: 'receipt' }
//   ],
//   income: [
//     { value: 'Salary', label: 'Salary', icon: 'money-bill-wave', popular: true },
//     { value: 'Freelance Work', label: 'Freelance Work', icon: 'laptop-code', popular: true },
//     { value: 'Business Income', label: 'Business Income', icon: 'briefcase' },
//     { value: 'Investment Returns', label: 'Investment Returns', icon: 'chart-line' },
//     { value: 'Gift/Family Support', label: 'Gift/Family Support', icon: 'gift', cultural: true },
//     { value: 'Side Hustle', label: 'Side Hustle', icon: 'hammer', popular: true },
//     { value: 'Rental Income', label: 'Rental Income', icon: 'building' },
//     { value: 'Other Income', label: 'Other Income', icon: 'plus-circle' }
//   ]
// };

// // Enhanced Nigerian merchants with categories
// const NIGERIAN_MERCHANTS = {
//   'GTBank': 'Bills',
//   'First Bank': 'Bills',
//   'Zenith Bank': 'Bills',
//   'Access Bank': 'Bills',
//   'UBA': 'Bills',
//   'Stanbic IBTC': 'Bills',
//   'Uber': 'Transport',
//   'Bolt': 'Transport',
//   'InDrive': 'Transport',
//   'Lagos BRT': 'Transport',
//   'ABC Transport': 'Transport',
//   'Shoprite': 'Shopping',
//   'Game': 'Shopping',
//   'Spar': 'Shopping',
//   'Park n Shop': 'Shopping',
//   'Jumia': 'Shopping',
//   'Konga': 'Shopping',
//   'KFC': 'Food & Dining',
//   'Dominos': 'Food & Dining',
//   'Mr Biggs': 'Food & Dining',
//   'Chicken Republic': 'Food & Dining',
//   'Sweet Sensation': 'Food & Dining',
//   'EKEDC': 'Bills',
//   'DSTV': 'Bills',
//   'GOtv': 'Bills',
//   'Airtel': 'Bills',
//   'MTN': 'Bills',
//   'Glo': 'Bills',
//   '9mobile': 'Bills',
//   'Total': 'Transport',
//   'Mobil': 'Transport',
//   'NNPC': 'Transport',
//   'Oando': 'Transport',
//   'Conoil': 'Transport'
// };

// const PAYMENT_METHODS = [
//   { value: 'cash', label: 'Cash', icon: 'money-bill' },
//   { value: 'card', label: 'Debit/Credit Card', icon: 'credit-card' },
//   { value: 'bank_transfer', label: 'Bank Transfer', icon: 'exchange-alt' },
//   { value: 'mobile_money', label: 'Mobile Money', icon: 'mobile-alt' },
//   { value: 'pos', label: 'POS Terminal', icon: 'calculator' },
//   { value: 'online', label: 'Online Payment', icon: 'globe' },
//   { value: 'other', label: 'Other', icon: 'ellipsis-h' }
// ];

// export default function AddTransactionPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [aiProcessing, setAiProcessing] = useState(false);

//   // Form state
//   const [transactionType, setTransactionType] = useState('expense');
//   const [formData, setFormData] = useState({
//     amount: '',
//     category: '',
//     merchant: '',
//     location: '',
//     paymentMethod: '',
//     date: new Date().toISOString().split('T')[0],
//     note: '',
//     recurring: false,
//     recurringPattern: 'monthly'
//   });

//   // UI state
//   const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [suggestedCategory, setSuggestedCategory] = useState('');
//   const [categoryConfidence, setCategoryConfidence] = useState(0);
//   const [aiInsights, setAiInsights] = useState<any[]>([]);
//   const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

//   // Enhanced category detection with AI insights
//   useEffect(() => {
//     const detectCategory = async () => {
//       if (formData.merchant && formData.amount) {
//         setAiProcessing(true);

//         try {
//           // Check merchant database first
//           const directMatch = Object.entries(NIGERIAN_MERCHANTS).find(([merchant]) =>
//             merchant.toLowerCase() === formData.merchant.toLowerCase()
//           );

//           if (directMatch) {
//             setSuggestedCategory(directMatch[1]);
//             setCategoryConfidence(95);
//           } else {
//             // Use AI-powered detection
//             const response = await fetch('/api/ai/categorize', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 merchant: formData.merchant,
//                 amount: parseFloat(formData.amount),
//                 type: transactionType
//               })
//             });

//             if (response.ok) {
//               const result = await response.json();
//               if (result.success) {
//                 setSuggestedCategory(result.category);
//                 setCategoryConfidence(result.confidence);

//                 if (result.insights) {
//                   setAiInsights(result.insights);
//                 }

//                 if (result.duplicateWarning) {
//                   setDuplicateWarning(result.duplicateWarning);
//                 }
//               }
//             }
//           }
//         } catch (error: any) {
//           console.error('Category detection error:', error);
//           // Fallback to basic pattern matching
//           basicCategoryDetection();
//         } finally {
//           setAiProcessing(false);
//         }
//       } else {
//         setSuggestedCategory('');
//         setCategoryConfidence(0);
//         setAiInsights([]);
//         setDuplicateWarning(null);
//       }
//     };

//     const timeoutId = setTimeout(detectCategory, 500); // Debounce API calls
//     return () => clearTimeout(timeoutId);
//   }, [formData.merchant, formData.amount, transactionType]);

//   const basicCategoryDetection = () => {
//     const merchant = formData.merchant.toLowerCase();
//     let suggested = '';
//     let confidence = 0;

//     if (['uber', 'bolt', 'indrive', 'brt', 'keke', 'okada', 'danfo', 'taxi'].some(t => merchant.includes(t))) {
//       suggested = 'Transport';
//       confidence = 85;
//     } else if (['shoprite', 'game', 'spar', 'jumia', 'konga', 'market', 'mall'].some(s => merchant.includes(s))) {
//       suggested = 'Shopping';
//       confidence = 80;
//     } else if (['kfc', 'dominos', 'chicken', 'restaurant', 'food', 'suya', 'mama put'].some(f => merchant.includes(f))) {
//       suggested = 'Food & Dining';
//       confidence = 85;
//     } else if (['gtbank', 'first bank', 'zenith', 'access', 'uba', 'bank'].some(b => merchant.includes(b))) {
//       suggested = 'Bills';
//       confidence = 75;
//     } else if (['nepa', 'ekedc', 'dstv', 'gotv', 'airtel', 'mtn', 'glo', 'internet'].some(u => merchant.includes(u))) {
//       suggested = 'Bills';
//       confidence = 90;
//     } else if (['total', 'mobil', 'nnpc', 'oando', 'petrol', 'fuel', 'filling station'].some(f => merchant.includes(f))) {
//       suggested = 'Transport';
//       confidence = 90;
//     } else if (['church', 'mosque', 'offering', 'tithe', 'zakat'].some(r => merchant.includes(r))) {
//       suggested = 'Church/Mosque';
//       confidence = 95;
//     } else if (['school', 'university', 'college', 'tuition', 'fees'].some(e => merchant.includes(e))) {
//       suggested = 'School Fees';
//       confidence = 90;
//     }

//     setSuggestedCategory(suggested);
//     setCategoryConfidence(confidence);
//   };

//   const handleMerchantChange = (value: string) => {
//     setFormData(prev => ({ ...prev, merchant: value }));

//     // Filter suggestions
//     if (value.length > 0) {
//       const filtered = Object.keys(NIGERIAN_MERCHANTS).filter(merchant =>
//         merchant.toLowerCase().includes(value.toLowerCase())
//       );
//       setMerchantSuggestions(filtered.slice(0, 8));
//       setShowSuggestions(filtered.length > 0);
//     } else {
//       setMerchantSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };

//   const selectSuggestion = (merchant: string) => {
//     setFormData(prev => ({ ...prev, merchant }));
//     setShowSuggestions(false);

//     // Auto-set category from merchant database
//     const category = NIGERIAN_MERCHANTS[merchant as keyof typeof NIGERIAN_MERCHANTS];
//     if (category) {
//       setFormData(prev => ({ ...prev, category }));
//       setSuggestedCategory(category);
//       setCategoryConfidence(95);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Enhanced validation
//       if (!formData.amount || parseFloat(formData.amount) <= 0) {
//         toast.error('Please enter a valid amount');
//         return;
//       }

//       if (!formData.date) {
//         toast.error('Please select a date');
//         return;
//       }

//       // Prepare enhanced transaction data
//       const transactionData = {
//         type: transactionType,
//         amount: parseFloat(formData.amount),
//         category: formData.category || suggestedCategory,
//         merchant: formData.merchant.trim() || undefined,
//         location: formData.location.trim() || undefined,
//         paymentMethod: formData.paymentMethod || 'cash',
//         date: formData.date,
//         note: formData.note.trim() || undefined,
//         recurring: formData.recurring,
//         recurringPattern: formData.recurring ? formData.recurringPattern : undefined,
//         // Enhanced fields for API
//         confidence: categoryConfidence,
//         aiCategorized: categoryConfidence > 0,
//         culturalContext: NIGERIAN_CATEGORIES[transactionType as keyof typeof NIGERIAN_CATEGORIES]
//           .find(cat => cat.value === (formData.category || suggestedCategory))?.cultural || false
//       };

//       // Submit to enhanced API
//       const response = await fetch('/api/transactions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(transactionData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to add transaction');
//       }

//       const result = await response.json();

//       // Enhanced success feedback
//       toast.success(`Transaction added successfully! ${result.transaction?.formattedAmount || '₦' + formData.amount}`);

//       // Show AI insights if available
//       if (result.aiInsights) {
//         if (result.aiInsights.autoDetectedCategory) {
//           toast.info(`🤖 Smart categorization: ${result.aiInsights.autoDetectedCategory} (${result.aiInsights.categoryConfidence}% confidence)`);
//         }

//         if (result.aiInsights.suggestedRecurring) {
//           toast.info(`💡 This looks like a recurring transaction. Consider marking future ${formData.merchant} payments as recurring.`);
//         }

//         if (result.aiInsights.flaggedForReview) {
//           toast.warning(`⚠️ ${result.aiInsights.insight}`);
//         }

//         if (result.aiInsights.seasonalInsight) {
//           toast.info(`📅 ${result.aiInsights.seasonalInsight}`);
//         }
//       }

//       // Show budget impact
//       if (result.budgetImpact) {
//         if (result.budgetImpact.overBudget) {
//           toast.warning(`📊 Budget Alert: You've exceeded your ${result.budgetImpact.category} budget by ${result.budgetImpact.overAmount}`);
//         } else if (result.budgetImpact.nearLimit) {
//           toast.info(`📊 Budget Update: ${result.budgetImpact.remainingAmount} left in your ${result.budgetImpact.category} budget`);
//         }
//       }

//       // Show Nigerian context recommendations
//       if (result.recommendations?.length > 0) {
//         setTimeout(() => {
//           result.recommendations.forEach((rec: any, index: number) => {
//             setTimeout(() => {
//               toast.info(`💡 ${rec.message}`);
//             }, index * 2000); // Stagger recommendations
//           });
//         }, 1000);
//       }

//       // Show cultural insights
//       if (result.culturalInsights?.length > 0) {
//         setTimeout(() => {
//           result.culturalInsights.forEach((insight: string, index: number) => {
//             setTimeout(() => {
//               toast.info(`🇳🇬 ${insight}`);
//             }, (index + result.recommendations?.length || 0) * 2000);
//           });
//         }, 1500);
//       }

//       // Reset form
//       setFormData({
//         amount: '',
//         category: '',
//         merchant: '',
//         location: '',
//         paymentMethod: '',
//         date: new Date().toISOString().split('T')[0],
//         note: '',
//         recurring: false,
//         recurringPattern: 'monthly'
//       });
//       setSuggestedCategory('');
//       setCategoryConfidence(0);
//       setAiInsights([]);
//       setDuplicateWarning(null);

//       // Navigate back to dashboard after delay
//       setTimeout(() => {
//         router.push('/dashboard');
//       }, 4000);

//     } catch (error: any) {
//       console.error('Error adding transaction:', error);
//       toast.error(error.message || 'Failed to add transaction');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
//   if (!session) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <p className="mb-4">You must be signed in to add transactions</p>
//         <AuthButtons />
//       </div>
//     </div>
//   );

//   return (
//     <>
//       <div className="min-h-screen flex flex-col pb-16 bg-gray-50 dark:bg-gray-900">
//         <MainNavigation />
//         <main className="flex-1 container mx-auto px-4 py-6">
//           <div className="mb-6">
//             <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//               Add Transaction
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400">
//               Record your income or expenses with smart Nigerian categorization
//             </p>
//           </div>

//           {/* AI Processing Indicator */}
//           {aiProcessing && (
//             <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <div className="flex items-center space-x-2">
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                 <span className="text-sm text-blue-700">AI is analyzing your transaction...</span>
//               </div>
//             </div>
//           )}

//           {/* Duplicate Warning */}
//           {duplicateWarning && (
//             <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//               <div className="flex items-center space-x-2">
//                 <FontAwesomeIcon icon={'exclamation-triangle'} className="text-yellow-600" />
//                 <span className="text-sm text-yellow-700">{duplicateWarning}</span>
//               </div>
//             </div>
//           )}

//           {/* Transaction Type Toggle */}
//           <div className="flex justify-center mb-6">
//             <div className="inline-flex rounded-md shadow-sm" role="group">
//               <button
//                 type="button"
//                 onClick={() => setTransactionType('expense')}
//                 className={`px-6 py-3 text-sm font-medium rounded-l-lg border focus:z-10 focus:ring-2 focus:ring-indigo-500 transition-all ${
//                   transactionType === 'expense'
//                     ? 'text-white bg-indigo-600 border-indigo-600 shadow-md'
//                     : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-indigo-700'
//                 }`}
//               >
//                 <FontAwesomeIcon icon={'arrow-down'} className='mr-2' /> Expense
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setTransactionType('income')}
//                 className={`px-6 py-3 text-sm font-medium rounded-r-lg border focus:z-10 focus:ring-2 focus:ring-indigo-500 transition-all ${
//                   transactionType === 'income'
//                     ? 'text-white bg-indigo-600 border-indigo-600 shadow-md'
//                     : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-indigo-700'
//                 }`}
//               >
//                 <FontAwesomeIcon icon={'arrow-up'} className='mr-2' /> Income
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Transaction Form */}
//           <div className="bg-white rounded-xl p-6 card-shadow dark:bg-gray-800 max-w-2xl mx-auto">
//             <form onSubmit={handleSubmit}>
//               {/* Amount Field with Enhanced Styling */}
//               <div className="mb-6">
//                 <label
//                   htmlFor="amount"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
//                 >
//                   Amount *
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                     <span className="text-lg font-bold text-gray-500 dark:text-white">₦</span>
//                   </div>
//                   <input
//                     type="number"
//                     id="amount"
//                     value={formData.amount}
//                     onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
//                     className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:text-white dark:bg-gray-700 text-lg rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-4 py-3 transition-all"
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Enhanced Merchant Field with Real-time Suggestions */}
//               <div className="mb-6 relative">
//                 <label
//                   htmlFor="merchant"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
//                 >
//                   Merchant/Description
//                   {aiProcessing && (
//                     <span className="ml-2 text-xs text-blue-600">
//                       <FontAwesomeIcon icon={'robot'} className="mr-1" />
//                       AI Analyzing...
//                     </span>
//                   )}
//                 </label>
//                 <input
//                   type="text"
//                   id="merchant"
//                   value={formData.merchant}
//                   onChange={(e) => handleMerchantChange(e.target.value)}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
//                   placeholder="e.g., Shoprite, Uber, GTBank, KFC"
//                 />

//                 {/* Enhanced Merchant Suggestions */}
//                 {showSuggestions && merchantSuggestions.length > 0 && (
//                   <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 max-h-48 overflow-y-auto">
//                     {merchantSuggestions.map((merchant, index) => {
//                       const category = NIGERIAN_MERCHANTS[merchant as keyof typeof NIGERIAN_MERCHANTS];
//                       return (
//                         <button
//                           key={index}
//                           type="button"
//                           onClick={() => selectSuggestion(merchant)}
//                           className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
//                         >
//                           <div className="flex justify-between items-center">
//                             <span className="font-medium">{merchant}</span>
//                             {category && (
//                               <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
//                                 {category}
//                               </span>
//                             )}
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Enhanced Category Selection with AI Suggestions */}
//               <div className="mb-6">
//                 <label
//                   htmlFor="category"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
//                 >
//                   Category
//                   {suggestedCategory && (
//                     <span className="ml-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
//                       <FontAwesomeIcon icon={'magic'} className="mr-1" />
//                       AI Suggested: {suggestedCategory} ({categoryConfidence}% confidence)
//                     </span>
//                   )}
//                 </label>
//                 <select
//                   id="category"
//                   value={formData.category || suggestedCategory}
//                   onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
//                   className="bg-gray-50 border border-gray-300 dark:border-gray-700 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
//                 >
//                   <option value="">Select a category</option>
//                   {NIGERIAN_CATEGORIES[transactionType as keyof typeof NIGERIAN_CATEGORIES].map((cat) => (
//                     <option key={cat.value} value={cat.value}>
//                       {cat.label}
//                       {cat.popular && ' (Popular)'}
//                       {cat.cultural && ' (Cultural)'}
//                       {cat.seasonal && ' (Seasonal)'}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Location Field with Nigerian Context */}
//               <div className="mb-6">
//                 <label
//                   htmlFor="location"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
//                 >
//                   Location (Optional)
//                 </label>
//                 <input
//                   type="text"
//                   id="location"
//                   value={formData.location}
//                   onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
//                   placeholder="e.g., Victoria Island, Ikeja, Abuja, Kano"
//                 />
//               </div>

//               {/* Enhanced Payment Method */}
//               <div className="mb-6">
//                 <label
//                   htmlFor="payment"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
//                 >
//                   Payment Method
//                 </label>
//                 <select
//                   id="payment"
//                   value={formData.paymentMethod}
//                   onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
//                 >
//                   <option value="">Select payment method</option>
//                   {PAYMENT_METHODS.map((method) => (
//                     <option key={method.value} value={method.value}>
//                       {method.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Date Picker */}
//               <div className="mb-6">
//                 <label
//                   htmlFor="date"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
//                 >
//                   Date *
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   value={formData.date}
//                   onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
//                   required
//                 />
//               </div>

//               {/* Enhanced Notes Section */}
//               <div className="mb-6">
//                 <label
//                   htmlFor="notes"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
//                 >
//                   Notes (Optional)
//                 </label>
//                 <textarea
//                   id="notes"
//                   value={formData.note}
//                   onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
//                   rows={3}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
//                   placeholder="Add any details about this transaction"
//                 />
//               </div>

//               {/* Enhanced Recurring Toggle */}
//               <div className="flex items-center mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                 <input
//                   type="checkbox"
//                   id="recurring"
//                   checked={formData.recurring}
//                   onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
//                   className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                 />
//                 <label htmlFor="recurring" className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
//                   Recurring Transaction
//                   <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
//                     Mark this if you expect to make this payment regularly
//                   </span>
//                 </label>
//               </div>

//               {/* Recurring Options */}
//               {formData.recurring && (
//                 <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
//                   <label
//                     htmlFor="frequency"
//                     className="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-300"
//                   >
//                     How often does this transaction repeat?
//                   </label>
//                   <select
//                     id="frequency"
//                     value={formData.recurringPattern}
//                     onChange={(e) => setFormData(prev => ({ ...prev, recurringPattern: e.target.value }))}
//                     className="bg-white border border-indigo-300 text-gray-900 dark:border-indigo-600 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
//                   >
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                     <option value="yearly">Yearly</option>
//                   </select>
//                 </div>
//               )}

//               {/* AI Insights Display */}
//               {aiInsights.length > 0 && (
//                 <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//                   <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
//                     AI Insights
//                   </h4>
//                   <div className="space-y-2">
//                     {aiInsights.map((insight, index) => (
//                       <div key={index} className="flex items-start space-x-2">
//                         <FontAwesomeIcon icon={'lightbulb'} className="text-blue-600 mt-0.5 text-xs" />
//                         <span className="text-sm text-blue-800 dark:text-blue-300">{insight}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Enhanced Submit Button */}
//               <button
//                 type="submit"
//                 disabled={loading || aiProcessing}
//                 className="w-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
//               >
//                 {loading ? (
//                   <>
//                     <FontAwesomeIcon icon={'spinner'} className="animate-spin mr-2" />
//                     Processing Transaction...
//                   </>
//                 ) : aiProcessing ? (
//                   <>
//                     <FontAwesomeIcon icon={'robot'} className="mr-2" />
//                     AI Analyzing...
//                   </>
//                 ) : (
//                   <>
//                     <FontAwesomeIcon icon={'plus'} className="mr-2" />
//                     Add Transaction
//                   </>
//                 )}
//               </button>

//               {/* Quick Add Shortcuts */}
//               <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
//                 <h4 className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-3">Quick Add Common Transactions</h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[
//                     { label: 'Transport', amount: '1000', category: 'Transport', icon: 'car' },
//                     { label: 'Food', amount: '2000', category: 'Food & Dining', icon: 'utensils' },
//                     { label: 'Data/Airtime', amount: '1500', category: 'Bills', icon: 'mobile-alt' },
//                     { label: 'Fuel', amount: '5000', category: 'Transport', icon: 'gas-pump' }
//                   ].map((quick, index) => (
//                     <button
//                       key={index}
//                       type="button"
//                       onClick={() => {
//                         setFormData(prev => ({
//                           ...prev,
//                           amount: quick.amount,
//                           category: quick.category,
//                           merchant: quick.label
//                         }));
//                         setSuggestedCategory(quick.category);
//                         setCategoryConfidence(85);
//                       }}
//                       className="p-3 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 transition-all"
//                     >
//                       <div className="flex items-center space-x-2">
//                         <FontAwesomeIcon icon={quick.icon as any} className="text-indigo-600" />
//                         <div>
//                           <div className="text-sm font-medium text-gray-900 dark:text-gray-300">{quick.label}</div>
//                           <div className="text-xs text-gray-500">₦{quick.amount}</div>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </form>
//           </div>
//         </main>
//       </div>
//     </>
//   )
// }

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainNavigation from '../components/MainNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../../lib/fontawesome'
import { useSession } from 'next-auth/react'
import AuthButtons from '../components/AuthButtons'
import { toast } from 'sonner'

// Enhanced Nigerian categories with cultural context and proper integration
const NIGERIAN_CATEGORIES = {
  expense: [
    { value: 'Food & Dining', label: 'Food & Dining', icon: 'utensils', popular: true, seasonal: false },
    { value: 'Transport', label: 'Transport', icon: 'car', popular: true, seasonal: false },
    { value: 'Rent/Housing', label: 'Rent/Housing', icon: 'home', popular: true, seasonal: false },
    { value: 'Bills', label: 'Bills (NEPA, Water, Internet)', icon: 'bolt', popular: true, seasonal: false },
    { value: 'Family Support', label: 'Family Support', icon: 'heart', cultural: true, seasonal: false },
    { value: 'School Fees', label: 'School Fees', icon: 'graduation-cap', seasonal: true, cultural: true },
    { value: 'Church/Mosque', label: 'Church/Mosque', icon: 'praying-hands', cultural: true, seasonal: false },
    { value: 'Health/Medical', label: 'Health/Medical', icon: 'heartbeat', popular: false, seasonal: false },
    { value: 'Entertainment', label: 'Entertainment', icon: 'film', popular: false, seasonal: false },
    { value: 'Shopping', label: 'Shopping', icon: 'shopping-bag', popular: false, seasonal: false },
    { value: 'Personal Care', label: 'Personal Care', icon: 'cut', popular: false, seasonal: false },
    { value: 'Emergency Fund', label: 'Emergency Fund', icon: 'shield-alt', popular: false, seasonal: false },
    { value: 'Other Expenses', label: 'Other', icon: 'receipt', popular: false, seasonal: false }
  ],
  income: [
    { value: 'Salary', label: 'Salary', icon: 'money-bill-wave', popular: true, seasonal: false },
    { value: 'Freelance Work', label: 'Freelance Work', icon: 'laptop-code', popular: true, seasonal: false },
    { value: 'Business Income', label: 'Business Income', icon: 'briefcase', popular: false, seasonal: false },
    { value: 'Investment Returns', label: 'Investment Returns', icon: 'chart-line', popular: false, seasonal: false },
    { value: 'Gift/Family Support', label: 'Gift/Family Support', icon: 'gift', cultural: true, seasonal: false },
    { value: 'Side Hustle', label: 'Side Hustle', icon: 'hammer', popular: true, seasonal: false },
    { value: 'Rental Income', label: 'Rental Income', icon: 'building', popular: false, seasonal: false },
    { value: 'Other Income', label: 'Other Income', icon: 'plus-circle', popular: false, seasonal: false }
  ]
};

// Enhanced Nigerian merchants database with proper categorization
const NIGERIAN_MERCHANTS = {
  // Banks
  'GTBank': 'Bills',
  'First Bank': 'Bills',
  'Zenith Bank': 'Bills',
  'Access Bank': 'Bills',
  'UBA': 'Bills',
  'Stanbic IBTC': 'Bills',
  'Kuda': 'Bills',
  'PalmPay': 'Bills',
  'OPay': 'Bills',

  // Transport
  'Uber': 'Transport',
  'Bolt': 'Transport',
  'InDrive': 'Transport',
  'Lagos BRT': 'Transport',
  'ABC Transport': 'Transport',
  'GUO Transport': 'Transport',

  // Retail/Shopping
  'Shoprite': 'Shopping',
  'Game': 'Shopping',
  'Spar': 'Shopping',
  'Park n Shop': 'Shopping',
  'Jumia': 'Shopping',
  'Konga': 'Shopping',
  'Slot': 'Shopping',

  // Food & Dining
  'KFC': 'Food & Dining',
  'Dominos': 'Food & Dining',
  'Mr Biggs': 'Food & Dining',
  'Chicken Republic': 'Food & Dining',
  'Sweet Sensation': 'Food & Dining',
  'Coldstone': 'Food & Dining',

  // Utilities/Bills
  'EKEDC': 'Bills',
  'IKEDC': 'Bills',
  'AEDC': 'Bills',
  'DSTV': 'Bills',
  'GOtv': 'Bills',
  'StarTimes': 'Bills',
  'Airtel': 'Bills',
  'MTN': 'Bills',
  'Glo': 'Bills',
  '9mobile': 'Bills',
  'Smile': 'Bills',
  'Spectranet': 'Bills',

  // Fuel Stations
  'Total': 'Transport',
  'Mobil': 'Transport',
  'NNPC': 'Transport',
  'Oando': 'Transport',
  'Conoil': 'Transport',
  'Forte Oil': 'Transport'
};

// Enhanced payment methods with Nigerian context
const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', icon: 'money-bill', popular: true },
  { value: 'card', label: 'Debit/Credit Card', icon: 'credit-card', popular: true },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: 'exchange-alt', popular: true },
  { value: 'mobile_money', label: 'Mobile Money (PalmPay, OPay)', icon: 'mobile-alt', popular: true },
  { value: 'pos', label: 'POS Terminal', icon: 'calculator', popular: true },
  { value: 'online', label: 'Online Payment', icon: 'globe', popular: false },
  { value: 'other', label: 'Other', icon: 'ellipsis-h', popular: false }
];

export default function AddTransactionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Loading and processing states
  const [loading, setLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

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

  // UI and suggestion states
  const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const [categoryConfidence, setCategoryConfidence] = useState(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [budgetImpact, setBudgetImpact] = useState<any>(null);
  const [recurringDetected, setRecurringDetected] = useState(false);

  // Enhanced AI-powered category detection with Nigerian context
  useEffect(() => {
    const detectCategory = async () => {
      if (formData.merchant && formData.amount) {
        setAiProcessing(true);

        try {
          // Check direct merchant match first for instant feedback
          const directMatch = Object.entries(NIGERIAN_MERCHANTS).find(([merchant]) =>
            merchant.toLowerCase() === formData.merchant.toLowerCase()
          );

          if (directMatch) {
            setSuggestedCategory(directMatch[1]);
            setCategoryConfidence(95);
            setAiProcessing(false);
            return;
          }

          // Enhanced pattern matching for Nigerian context
          const smartCategory = performSmartCategorization(formData.merchant, formData.amount, transactionType);

          if (smartCategory.category) {
            setSuggestedCategory(smartCategory.category);
            setCategoryConfidence(smartCategory.confidence);

            // Generate contextual insights
            const insights = generateTransactionInsights(formData.merchant, smartCategory.category, formData.amount);
            setAiInsights(insights);
          }

          // Check for potential duplicates
          await checkForDuplicates();

          // Detect recurring patterns
          await detectRecurringPattern();

          // Check budget impact
          if (transactionType === 'expense' && smartCategory.category) {
            await checkBudgetImpact(smartCategory.category, parseFloat(formData.amount));
          }

        } catch (error: any) {
          console.error('AI categorization error:', error);
          // Fallback to basic categorization
          const fallback = performBasicCategorization(formData.merchant);
          if (fallback) {
            setSuggestedCategory(fallback.category);
            setCategoryConfidence(fallback.confidence);
          }
        } finally {
          setAiProcessing(false);
        }
      } else {
        // Reset states when no merchant/amount
        setSuggestedCategory('');
        setCategoryConfidence(0);
        setAiInsights([]);
        setDuplicateWarning(null);
        setBudgetImpact(null);
      }
    };

    // Debounce the API calls
    const timeoutId = setTimeout(detectCategory, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.merchant, formData.amount, transactionType]);

  // Enhanced smart categorization with Nigerian intelligence
  const performSmartCategorization = (merchant: string, amount: string, type: string) => {
    const merchantLower = merchant.toLowerCase();
    const amountNum = parseFloat(amount);

    let category = '';
    let confidence = 0;

    // Nigerian transport patterns
    if (['uber', 'bolt', 'indrive', 'brt', 'keke', 'okada', 'danfo', 'taxi', 'tricycle'].some(t => merchantLower.includes(t))) {
      category = 'Transport';
      confidence = 90;
    }
    // Fuel stations
    else if (['total', 'mobil', 'nnpc', 'oando', 'petrol', 'fuel', 'filling station', 'conoil'].some(f => merchantLower.includes(f))) {
      category = 'Transport';
      confidence = 95;
    }
    // Nigerian banks and financial services
    else if (['gtbank', 'first bank', 'zenith', 'access', 'uba', 'bank', 'atm', 'pos', 'transfer', 'wema'].some(b => merchantLower.includes(b))) {
      category = 'Bills';
      confidence = 85;
    }
    // Mobile money
    else if (['palmpay', 'opay', 'kuda', 'piggyvest', 'cowrywise', 'moniepoint', 'smartcash', 'paystack'].some(m => merchantLower.includes(m))) {
      category = 'Bills';
      confidence = 90;
    }
    // Retail and shopping
    else if (['shoprite', 'game', 'spar', 'jumia', 'konga', 'market', 'mall', 'store'].some(s => merchantLower.includes(s))) {
      category = 'Shopping';
      confidence = 88;
    }
    // Food and dining
    else if (['kfc', 'dominos', 'chicken', 'restaurant', 'food', 'suya', 'mama put', 'eatery', 'cafe'].some(f => merchantLower.includes(f))) {
      category = 'Food & Dining';
      confidence = 92;
    }
    // Utilities
    else if (['nepa', 'ekedc', 'ikedc', 'aedc', 'dstv', 'gotv', 'startimes', 'airtel', 'mtn', 'glo', 'internet', 'electricity', 'water'].some(u => merchantLower.includes(u))) {
      category = 'Bills';
      confidence = 93;
    }
    // Religious institutions
    else if (['church', 'mosque', 'cathedral', 'chapel', 'offering', 'tithe', 'zakat', 'sadaqah'].some(r => merchantLower.includes(r))) {
      category = 'Church/Mosque';
      confidence = 96;
    }
    // Education
    else if (['school', 'university', 'college', 'tuition', 'fees', 'education', 'academy'].some(e => merchantLower.includes(e))) {
      category = 'School Fees';
      confidence = 94;
    }
    // Healthcare
    else if (['hospital', 'clinic', 'pharmacy', 'doctor', 'medical', 'health', 'drug'].some(h => merchantLower.includes(h))) {
      category = 'Health/Medical';
      confidence = 89;
    }
    // Family context
    else if (['family', 'mum', 'dad', 'parent', 'sibling', 'brother', 'sister', 'relative'].some(f => merchantLower.includes(f))) {
      category = 'Family Support';
      confidence = 91;
    }
    // Amount-based heuristics for Nigerian context
    else if (type === 'income') {
      if (amountNum >= 50000) {
        category = 'Salary';
        confidence = 80;
      } else if (amountNum >= 5000) {
        category = 'Freelance Work';
        confidence = 70;
      }
    }

    return { category, confidence };
  };

  // Basic fallback categorization
  const performBasicCategorization = (merchant: string) => {
    if (!merchant) return null;

    const merchantLower = merchant.toLowerCase();

    // Simple keyword matching
    if (merchantLower.includes('transport') || merchantLower.includes('taxi')) {
      return { category: 'Transport', confidence: 60 };
    }
    if (merchantLower.includes('food') || merchantLower.includes('restaurant')) {
      return { category: 'Food & Dining', confidence: 65 };
    }
    if (merchantLower.includes('shop') || merchantLower.includes('store')) {
      return { category: 'Shopping', confidence: 55 };
    }

    return null;
  };

  // Generate contextual insights based on transaction data
  const generateTransactionInsights = (merchant: string, category: string, amount: string) => {
    const insights = [];
    const amountNum = parseFloat(amount);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const dayOfMonth = currentDate.getDate();

    // Nigerian seasonal insights
    if ([1, 9].includes(currentMonth) && category === 'School Fees') {
      insights.push('School fees season detected - this is a common time for education payments in Nigeria');
    }

    if ([12, 1].includes(currentMonth) && category === 'Family Support') {
      insights.push('Festive season - family support spending typically increases during December/January');
    }

    if (dayOfMonth >= 25 && category === 'Transport') {
      insights.push('End-of-month spending - transport costs often increase during salary period');
    }

    // Amount-based insights
    if (amountNum >= 100000 && category === 'Rent/Housing') {
      insights.push('Large housing payment detected - ensure this aligns with your monthly budget');
    }

    if (amountNum >= 50000 && category === 'School Fees') {
      insights.push('Significant education expense - consider budgeting for next term as well');
    }

    // Merchant-specific insights
    if (merchant.toLowerCase().includes('fuel') && amountNum >= 10000) {
      insights.push('High fuel cost - consider tracking fuel expenses separately due to price volatility');
    }

    return insights;
  };

  // Check for potential duplicate transactions
  const checkForDuplicates = async () => {
    if (!formData.merchant || !formData.amount) return;

    try {
      const response = await fetch('/api/transactions/check-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: formData.merchant,
          amount: parseFloat(formData.amount),
          date: formData.date
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.isDuplicate) {
          setDuplicateWarning(`Similar transaction found: ${result.duplicateInfo.merchant} - ${result.duplicateInfo.formattedAmount} on ${new Date(result.duplicateInfo.date).toLocaleDateString()}`);
        }
      }
    } catch (error: any) {
      // Silently handle - duplicate detection is not critical
      console.log('Duplicate check failed:', error);
    }
  };

  // Detect recurring transaction patterns
  const detectRecurringPattern = async () => {
    if (!formData.merchant || formData.recurring) return;

    try {
      const response = await fetch('/api/transactions/detect-recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant: formData.merchant,
          amount: parseFloat(formData.amount)
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.isRecurring) {
          setRecurringDetected(true);
          setAiInsights(prev => [...prev, `Recurring pattern detected: You've made similar ${formData.merchant} payments ${result.frequency}. Consider marking as recurring.`]);
        }
      }
    } catch (error: any) {
      console.log('Recurring detection failed:', error);
    }
  };

  // Check budget impact
  const checkBudgetImpact = async (category: string, amount: number) => {
    try {
      const response = await fetch('/api/budgets/impact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount })
      });

      if (response.ok) {
        const result = await response.json();
        setBudgetImpact(result.impact);
      }
    } catch (error: any) {
      console.log('Budget impact check failed:', error);
    }
  };

  // Enhanced merchant suggestion system
  const handleMerchantChange = (value: string) => {
    setFormData(prev => ({ ...prev, merchant: value }));

    // Clear previous states
    setDuplicateWarning(null);
    setBudgetImpact(null);

    if (value.length > 0) {
      // Filter Nigerian merchants for suggestions
      const filtered = Object.keys(NIGERIAN_MERCHANTS)
        .filter(merchant => merchant.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8); // Limit suggestions

      setMerchantSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setMerchantSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Select merchant suggestion with auto-categorization
  const selectSuggestion = (merchant: string) => {
    setFormData(prev => ({ ...prev, merchant }));
    setShowSuggestions(false);

    // Auto-set category and confidence
    const category = NIGERIAN_MERCHANTS[merchant as keyof typeof NIGERIAN_MERCHANTS];
    if (category) {
      setFormData(prev => ({ ...prev, category }));
      setSuggestedCategory(category);
      setCategoryConfidence(95);

      // Generate specific insights for known merchants
      const merchantInsights = generateMerchantSpecificInsights(merchant, category);
      setAiInsights(merchantInsights);
    }
  };

  // Generate merchant-specific insights
  const generateMerchantSpecificInsights = (merchant: string, category: string) => {
    const insights = [];

    if (merchant.includes('Uber') || merchant.includes('Bolt')) {
      insights.push('Ride-hailing service - consider tracking for transportation budget optimization');
    }

    if (merchant.includes('DSTV') || merchant.includes('GOtv')) {
      insights.push('Subscription service - mark as recurring for automatic tracking');
    }

    if (merchant.includes('Shoprite') || merchant.includes('Game')) {
      insights.push('Retail purchase - consider if this is groceries (Food) or general shopping');
    }

    if (['MTN', 'Airtel', 'Glo', '9mobile'].some(telco => merchant.includes(telco))) {
      insights.push('Telecom expense - consider bundling with other communication costs');
    }

    return insights;
  };

  // Enhanced form submission with complete API integration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Enhanced validation
      const amount = parseFloat(formData.amount);
      if (!amount || amount <= 0) {
        toast.error('Please enter a valid amount greater than ₦0');
        return;
      }

      if (amount > 10000000) {
        toast.error('Maximum transaction amount is ₦10,000,000');
        return;
      }

      if (!formData.date) {
        toast.error('Please select a transaction date');
        return;
      }

      // Prepare enhanced transaction data for your API
      const transactionData = {
        type: transactionType,
        amount: amount,
        category: formData.category || suggestedCategory,
        merchant: formData.merchant.trim() || undefined,
        location: formData.location.trim() || undefined,
        paymentMethod: formData.paymentMethod || 'cash',
        date: formData.date,
        note: formData.note.trim() || undefined,
        recurring: formData.recurring,
        recurringPattern: formData.recurring ? formData.recurringPattern : undefined,

        // Enhanced metadata for your models
        aiCategorized: categoryConfidence > 0,
        categoryConfidence: categoryConfidence,
        nigerianMerchant: NIGERIAN_MERCHANTS.hasOwnProperty(formData.merchant),
        culturalContext: NIGERIAN_CATEGORIES[transactionType as keyof typeof NIGERIAN_CATEGORIES].find(cat =>
          cat.value === (formData.category || suggestedCategory))?.cultural || false,
        seasonalContext: NIGERIAN_CATEGORIES[transactionType as keyof typeof NIGERIAN_CATEGORIES].find(cat =>
          cat.value === (formData.category || suggestedCategory))?.seasonal || false,

        // Nigerian economic context
        nigerianContext: {
          isSchoolFeeSeason: [1, 9].includes(new Date().getMonth() + 1),
          isSalaryCycle: new Date().getDate() >= 25,
          isFestiveSeason: [12, 1].includes(new Date().getMonth() + 1),
          dayOfMonth: new Date().getDate()
        }
      };

      // Call your enhanced transactions API
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

      // Enhanced success feedback with Nigerian formatting
      toast.success(`Transaction added successfully! ${result.transaction?.formattedAmount || new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
      }).format(amount).replace('NGN', '₦')}`);

      // Display AI insights from your backend
      if (result.aiInsights) {
        if (result.aiInsights.autoDetectedCategory && categoryConfidence < 100) {
          toast.info(`AI Smart Categorization: ${result.aiInsights.autoDetectedCategory} (${result.aiInsights.categoryConfidence}% confidence)`);
        }

        if (result.aiInsights.suggestedRecurring) {
          toast.info(`Recurring Transaction Detected: Consider marking future ${formData.merchant} payments as recurring for automatic tracking.`);
        }

        if (result.aiInsights.flaggedForReview) {
          toast.warning(`${result.aiInsights.insight}`);
        }

        if (result.aiInsights.seasonalInsight) {
          toast.info(`${result.aiInsights.seasonalInsight}`);
        }
      }

      // Display budget impact from your budget models
      if (result.budgetImpact) {
        if (result.budgetImpact.isOverBudget) {
          toast.warning(`Budget Alert: You've exceeded your ${result.budgetImpact.category} budget by ${result.budgetImpact.formattedOverAmount || '₦' + result.budgetImpact.overAmount?.toLocaleString()}`);
        } else if (result.budgetImpact.percentageUsed >= 80) {
          toast.info(`Budget Update: ${result.budgetImpact.formattedRemaining || '₦' + result.budgetImpact.remaining?.toLocaleString()} remaining in your ${result.budgetImpact.category} budget (${Math.round(result.budgetImpact.percentageUsed)}% used)`);
        }
      }

      // Display Nigerian context recommendations
      if (result.recommendations?.length > 0) {
        setTimeout(() => {
          result.recommendations.forEach((rec: any, index: number) => {
            setTimeout(() => {
              toast.info(`${rec.message}`);
            }, index * 2000);
          });
        }, 1000);
      }

      // Display cultural and seasonal insights
      if (result.nigerianInsights?.length > 0) {
        setTimeout(() => {
          result.nigerianInsights.forEach((insight: string, index: number) => {
            setTimeout(() => {
              toast.info(`${insight}`);
            }, (index + (result.recommendations?.length || 0)) * 2000);
          });
        }, 1500);
      }

      // Reset form to initial state
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

      // Reset AI states
      setSuggestedCategory('');
      setCategoryConfidence(0);
      setAiInsights([]);
      setDuplicateWarning(null);
      setBudgetImpact(null);
      setRecurringDetected(false);

      // Navigate back to dashboard with success
      setTimeout(() => {
        router.push('/dashboard?transaction=added');
      }, 4000);

    } catch (error: any) {
      console.error('Error adding transaction:', error);
      toast.error(error.message || 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading and authentication checks
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">You must be signed in to add transactions</p>
          <AuthButtons />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col pb-16 bg-gray-50 dark:bg-gray-900">
        <MainNavigation />
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Enhanced Header with Context */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add Transaction
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Record your income or expenses with smart Nigerian categorization
            </p>
          </div>

          {/* AI Processing Indicator */}
          {aiProcessing && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 dark:bg-blue-900/20 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  AI is analyzing your transaction...
                </span>
              </div>
            </div>
          )}

          {/* Duplicate Warning */}
          {duplicateWarning && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 dark:bg-yellow-900/20 dark:border-yellow-800">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={'exclamation-triangle'} className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300">{duplicateWarning}</span>
              </div>
            </div>
          )}

          {/* Budget Impact Alert */}
          {budgetImpact && (
            <div className={`mb-4 border rounded-lg p-3 ${budgetImpact.isOverBudget
                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                : budgetImpact.percentageUsed >= 80
                  ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
                  : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              }`}>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon
                  icon={budgetImpact.isOverBudget ? 'exclamation-circle' : budgetImpact.percentageUsed >= 80 ? 'exclamation-triangle' : 'check-circle'}
                  className={budgetImpact.isOverBudget ? 'text-red-600' : budgetImpact.percentageUsed >= 80 ? 'text-orange-600' : 'text-green-600'}
                />
                <span className={`text-sm ${budgetImpact.isOverBudget
                    ? 'text-red-700 dark:text-red-300'
                    : budgetImpact.percentageUsed >= 80
                      ? 'text-orange-700 dark:text-orange-300'
                      : 'text-green-700 dark:text-green-300'
                  }`}>
                  {budgetImpact.message}
                </span>
              </div>
            </div>
          )}

          {/* Transaction Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setTransactionType('expense')}
                className={`px-6 py-3 text-sm font-medium rounded-l-lg border focus:z-10 focus:ring-2 focus:ring-indigo-500 transition-all ${transactionType === 'expense'
                    ? 'text-white bg-indigo-600 border-indigo-600 shadow-md'
                    : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-indigo-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                  }`}
              >
                <FontAwesomeIcon icon={'arrow-down'} className='mr-2' /> Expense
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('income')}
                className={`px-6 py-3 text-sm font-medium rounded-r-lg border focus:z-10 focus:ring-2 focus:ring-indigo-500 transition-all ${transactionType === 'income'
                    ? 'text-white bg-indigo-600 border-indigo-600 shadow-md'
                    : 'text-gray-900 bg-white border-gray-200 hover:bg-gray-100 hover:text-indigo-700 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                  }`}
              >
                <FontAwesomeIcon icon={'arrow-up'} className='mr-2' /> Income
              </button>
            </div>
          </div>

          {/* Enhanced Transaction Form */}
          <div className="bg-white rounded-xl p-6 shadow-lg dark:bg-gray-800 max-w-2xl mx-auto">
            <div>
              {/* Amount Field with Enhanced Styling */}
              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="text-lg font-bold text-gray-500 dark:text-gray-400">₦</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-600 dark:text-white dark:bg-gray-700 dark:placeholder-gray-400 text-lg rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-4 py-3 transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {formData.amount && parseFloat(formData.amount) > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Intl.NumberFormat('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                      minimumFractionDigits: 0,
                    }).format(parseFloat(formData.amount)).replace('NGN', '₦')}
                  </p>
                )}
              </div>

              {/* Enhanced Merchant Field with Real-time Suggestions */}
              <div className="mb-6 relative">
                <label
                  htmlFor="merchant"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Merchant/Description
                  {aiProcessing && (
                    <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">
                      <FontAwesomeIcon icon={'robot'} className="mr-1" />
                      AI Analyzing...
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  id="merchant"
                  value={formData.merchant}
                  onChange={(e) => handleMerchantChange(e.target.value)}
                  onFocus={() => {
                    if (merchantSuggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding suggestions to allow selection
                    setTimeout(() => setShowSuggestions(false), 150);
                  }}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                  placeholder="e.g., Shoprite, Uber, GTBank, KFC, MTN"
                />

                {/* Enhanced Nigerian Merchant Suggestions */}
                {showSuggestions && merchantSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 max-h-64 overflow-y-auto">
                    {merchantSuggestions.map((merchant, index) => {
                      const category = NIGERIAN_MERCHANTS[merchant as keyof typeof NIGERIAN_MERCHANTS];
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSuggestion(merchant)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{merchant}</span>
                            {category && (
                              <span className="text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-1 rounded-full">
                                {category}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Enhanced Category Selection with AI Suggestions */}
              <div className="mb-6">
                <label
                  htmlFor="category"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Category
                  {suggestedCategory && (
                    <span className="ml-2 text-xs text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full">
                      <FontAwesomeIcon icon={'magic'} className="mr-1" />
                      AI Suggested: {suggestedCategory} ({categoryConfidence}% confidence)
                    </span>
                  )}
                </label>
                <select
                  id="category"
                  value={formData.category || suggestedCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="bg-gray-50 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                >
                  <option value="">Select a category</option>
                  {NIGERIAN_CATEGORIES[transactionType as keyof typeof NIGERIAN_CATEGORIES].map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                      {cat.popular && ' (Popular)'}
                      {cat.cultural && ' (Cultural)'}
                      {cat.seasonal && ' (Seasonal)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Field with Nigerian Context */}
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                  placeholder="e.g., Victoria Island, Ikeja, Abuja, Kano"
                />
              </div>

              {/* Enhanced Payment Method */}
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                >
                  <option value="">Select payment method</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                      {method.popular && ' (Popular)'}
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
                  max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                  required
                />
              </div>

              {/* Enhanced Notes Section */}
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
                  rows={3}
                  maxLength={500}
                  className="bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all resize-none"
                  placeholder="Add any details about this transaction..."
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {formData.note.length}/500 characters
                </div>
              </div>

              {/* Enhanced Recurring Toggle with Detection */}
              <div className="flex items-center mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.checked }))}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="recurring" className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Recurring Transaction
                  {recurringDetected && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                      Pattern Detected
                    </span>
                  )}
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mark this if you expect to make this payment regularly
                  </span>
                </label>
              </div>

              {/* Recurring Options */}
              {formData.recurring && (
                <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  <label
                    htmlFor="frequency"
                    className="block mb-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    How often does this transaction repeat?
                  </label>
                  <select
                    id="frequency"
                    value={formData.recurringPattern}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurringPattern: e.target.value }))}
                    className="bg-white border border-indigo-300 text-gray-900 dark:border-indigo-600 dark:bg-gray-700 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly (Most Common)</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              {/* AI Insights Display */}
              {aiInsights.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                    <FontAwesomeIcon icon={'lightbulb'} className="mr-2" />
                    AI Insights
                  </h4>
                  <div className="space-y-2">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <FontAwesomeIcon icon={'info-circle'} className="text-blue-600 dark:text-blue-400 mt-0.5 text-xs flex-shrink-0" />
                        <span className="text-sm text-blue-800 dark:text-blue-300">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || aiProcessing || !formData.amount || parseFloat(formData.amount) <= 0}
                className="w-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-3 text-center disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={'spinner'} className="animate-spin mr-2" />
                    Processing Transaction...
                  </div>
                ) : aiProcessing ? (
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={'robot'} className="mr-2" />
                    AI Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={'plus'} className="mr-2" />
                    Add Transaction
                  </div>
                )}
              </button>

              {/* Quick Add Shortcuts for Nigerian Context */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-3 flex items-center">
                  <FontAwesomeIcon icon={'bolt'} className="mr-2 text-indigo-600" />
                  Quick Add Common Nigerian Transactions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Transport', amount: '1000', category: 'Transport', icon: 'car', merchant: 'Local Transport' },
                    { label: 'Food', amount: '2000', category: 'Food & Dining', icon: 'utensils', merchant: 'Local Food' },
                    { label: 'Data/Airtime', amount: '1500', category: 'Bills', icon: 'mobile-alt', merchant: 'Telecom Recharge' },
                    { label: 'Fuel', amount: '5000', category: 'Transport', icon: 'gas-pump', merchant: 'Filling Station' }
                  ].map((quick, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          amount: quick.amount,
                          category: quick.category,
                          merchant: quick.merchant
                        }));
                        setSuggestedCategory(quick.category);
                        setCategoryConfidence(85);
                        toast.info(`Quick filled: ${quick.label} transaction`);
                      }}
                      className="p-3 text-left border border-gray-200 dark:border-gray-600 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 transition-all group"
                    >
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon
                          icon={quick.icon as any}
                          className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 transition-colors"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-300">{quick.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">₦{parseInt(quick.amount).toLocaleString()}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}