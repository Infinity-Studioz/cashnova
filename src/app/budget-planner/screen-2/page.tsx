// // src/app/budget-planner/screen-2/page.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import MainNavigation from '@/app/components/MainNavigation'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import Link from 'next/link'
// import '../../../lib/fontawesome'

// interface BudgetData {
//   budget: {
//     month: string;
//     totalBudget: number;
//     formattedTotalBudget: string;
//   } | null;
//   categoryBudgets: Array<{
//     _id: string;
//     category: string;
//     allocated: number;
//     spent: number;
//     remaining: number;
//     percentageUsed: number;
//     status: 'good' | 'warning' | 'exceeded';
//     formattedAllocated: string;
//     formattedSpent: string;
//     formattedRemaining: string;
//     transactionCount: number;
//   }>;
//   summary: {
//     month: string;
//     totalAllocated: number;
//     totalSpent: number;
//     totalRemaining: number;
//     budgetUtilization: number;
//     formattedTotalAllocated: string;
//     formattedTotalSpent: string;
//     formattedTotalRemaining: string;
//   };
//   insights: Array<{
//     type: 'warning' | 'suggestion' | 'alert';
//     message: string;
//     action: string;
//     category?: string;
//   }>;
// }

// const CATEGORY_ICONS = {
//   'Groceries': 'shopping-basket',
//   'Food & Dining': 'utensils',
//   'Transport': 'car',
//   'Entertainment': 'film',
//   'Fitness': 'dumbbell',
//   'Health & Fitness': 'heartbeat',
//   'Rent': 'home',
//   'Rent/Housing': 'home',
//   'Bills': 'bolt',
//   'Family Support': 'heart',
//   'Emergency Fund': 'shield-alt',
// } as const;

// const CATEGORY_COLORS = {
//   'Groceries': { bg: 'bg-green-100', text: 'text-green-600' },
//   'Food & Dining': { bg: 'bg-green-100', text: 'text-green-600' },
//   'Transport': { bg: 'bg-blue-100', text: 'text-blue-600' },
//   'Entertainment': { bg: 'bg-pink-100', text: 'text-pink-600' },
//   'Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
//   'Health & Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
//   'Rent': { bg: 'bg-purple-100', text: 'text-purple-600' },
//   'Rent/Housing': { bg: 'bg-purple-100', text: 'text-purple-600' },
//   'Bills': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
//   'Family Support': { bg: 'bg-red-100', text: 'text-red-600' },
//   'Emergency Fund': { bg: 'bg-gray-100', text: 'text-gray-600' },
// } as const;

// const CategoryBudgetsPage = () => {
//   const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
//   const [editingCategory, setEditingCategory] = useState<string | null>(null);
//   const [editValue, setEditValue] = useState<string>('');

//   useEffect(() => {
//     fetchBudgetData();
//   }, [currentMonth]);

//   const fetchBudgetData = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`/api/budgets?month=${currentMonth}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch budget data');
//       }

//       const result = await response.json();
//       setBudgetData(result);
//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to load budget data';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateBudget = async (category: string, newAmount: number) => {
//     if (!budgetData?.categoryBudgets) return;

//     try {
//       const updatedCategories = budgetData.categoryBudgets.map(cat =>
//         cat.category === category ? { ...cat, allocated: newAmount } : cat
//       );

//       const response = await fetch(`/api/budgets/${currentMonth}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           categories: updatedCategories.map(cat => ({
//             category: cat.category,
//             allocated: cat.allocated
//           }))
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to update budget');
//       }

//       toast.success(`${category} budget updated successfully`);
//       await fetchBudgetData();
//       setEditingCategory(null);
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to update budget');
//     }
//   };

//   const handleTransferBudget = async (fromCategory: string, toCategory: string, amount: number) => {
//     try {
//       const response = await fetch('/api/budgets/transfer', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           month: currentMonth,
//           fromCategory,
//           toCategory,
//           amount,
//           reason: 'Budget reallocation via Category Budgets screen'
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to transfer budget');
//       }

//       const result = await response.json();
//       toast.success(result.message);
//       await fetchBudgetData();
//     } catch (err: any) {
//       toast.error(err.message || 'Failed to transfer budget');
//     }
//   };

//   const startEdit = (category: string, currentAmount: number) => {
//     setEditingCategory(category);
//     setEditValue(currentAmount.toString());
//   };

//   const saveEdit = (category: string) => {
//     const newAmount = parseInt(editValue.replace(/,/g, ''));
//     if (isNaN(newAmount) || newAmount < 0) {
//       toast.error('Please enter a valid amount');
//       return;
//     }
//     handleUpdateBudget(category, newAmount);
//   };

//   const cancelEdit = () => {
//     setEditingCategory(null);
//     setEditValue('');
//   };

//   const changeMonth = (direction: 'prev' | 'next') => {
//     const current = new Date(currentMonth + '-01');
//     if (direction === 'prev') {
//       current.setMonth(current.getMonth() - 1);
//     } else {
//       current.setMonth(current.getMonth() + 1);
//     }
//     setCurrentMonth(current.toISOString().slice(0, 7));
//   };

//   const formatMonthName = (month: string) => {
//     const date = new Date(month + '-01');
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
//   };

//   if (loading) {
//     return (
//       <>
//         <MainNavigation />
//         <div className="min-h-screen">
//           <div className="container mx-auto px-4 py-8 max-w-6xl">
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Category Budgets</h2>
//               <p className="text-slate-500 dark:text-slate-400">Loading budget data...</p>
//             </div>
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (error || !budgetData?.budget) {
//     return (
//       <>
//         <MainNavigation />
//         <div className="min-h-screen">
//           <div className="container mx-auto px-4 py-8 max-w-6xl">
//             <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm text-red-700">{error || 'No budget found for this month'}</p>
//                   <div className="mt-2 space-x-2">
//                     <button
//                       onClick={fetchBudgetData}
//                       className="text-xs font-medium text-red-600 hover:text-red-500"
//                     >
//                       Try again
//                     </button>
//                     <button
//                       onClick={() => window.location.href = '/budget-planner/screen-3'}
//                       className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
//                     >
//                       Create Budget
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const { budget, categoryBudgets, summary, insights } = budgetData;

//   return (
//     <>
//       <MainNavigation />
//       <div className="min-h-screen">
//         <div className="container mx-auto px-4 py-8 max-w-6xl">
//           {/* Navigation */}
//           <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
//             <Link
//               href="/budget-planner/screen-1"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Monthly Overview</Link>
//             <Link
//               href="/budget-planner/screen-2"
//               className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
//             >Category Budgets</Link>
//             <Link
//               href="/budget-planner/screen-3"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Smart Budget Assistant (AI)</Link>
//             <Link
//               href="/budget-planner/screen-4"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Budget Alerts & Reminders</Link>
//             <Link
//               href="/budget-planner/screen-5"
//               className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//             >Budget Calendar</Link>
//           </nav>

//           {/* Page Header */}
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Category Budgets</h2>
//               <p className="text-slate-500 dark:text-slate-400">
//                 Set and manage spending limits per category
//               </p>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={() => window.history.back()}
//                 className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
//               >
//                 <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
//               </button>
//             </div>
//           </div>

//           {/* Current Month Selector */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between">
//             <div>
//               <h3 className="font-semibold text-slate-700 dark:text-slate-200">
//                 {formatMonthName(currentMonth)} Budgets
//               </h3>
//               <p className="text-sm text-slate-500 dark:text-slate-400">
//                 Viewing budgets for selected month
//               </p>
//             </div>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => changeMonth('prev')}
//                 className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
//               >
//                 <FontAwesomeIcon icon={'chevron-left'} className='text-slate-500' />
//               </button>
//               <button className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium">
//                 <FontAwesomeIcon icon={'calendar-alt'} className='mr-2' /> Change Month
//               </button>
//               <button
//                 onClick={() => changeMonth('next')}
//                 className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700"
//               >
//                 <FontAwesomeIcon icon={'chevron-right'} className='text-slate-500' />
//               </button>
//             </div>
//           </div>

//           {/* AI Insight Panel */}
//           {insights.length > 0 && (
//             <div className="ai-insight text-white rounded-xl p-4 mb-6 flex items-start">
//               <div
//                 className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
//                 style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//               >
//                 <FontAwesomeIcon icon={'lightbulb'} />
//               </div>
//               <div className="flex-1">
//                 <p className="font-medium">AI Budget Insight</p>
//                 <p className="text-sm opacity-90 mb-2">{insights[0].message}</p>
//                 <div className="flex items-center space-x-3 mt-2">
//                   <button
//                     onClick={() => toast.info('Budget adjustments can be made by editing category amounts below')}
//                     className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
//                     style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                   >
//                     <FontAwesomeIcon icon={'adjust'} className='mr-1' /> Adjust Budget
//                   </button>
//                   {insights[0].category && (
//                     <button
//                       onClick={() => {
//                         const categoryData = categoryBudgets.find(c => c.category === insights[0].category);
//                         if (categoryData && categoryData.remaining > 0) {
//                           const needsMore = categoryBudgets.find(c => c.status === 'exceeded');
//                           if (needsMore) {
//                             const transferAmount = Math.min(categoryData.remaining, Math.abs(needsMore.remaining));
//                             handleTransferBudget(insights[0].category!, needsMore.category, transferAmount);
//                           }
//                         }
//                       }}
//                       className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
//                       style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                     >
//                       <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Auto Transfer
//                     </button>
//                   )}
//                   <button
//                     onClick={() => window.location.href = '/budget-planner/screen-1'}
//                     className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
//                     style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                   >
//                     <FontAwesomeIcon icon={'chart-line'} className='mr-1' /> View Trends
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Category Budget List */}
//           <div className="space-y-4 mb-8">
//             {categoryBudgets.map((categoryBudget, index) => {
//               const icon = CATEGORY_ICONS[categoryBudget.category] || 'folder';
//               const colors = CATEGORY_COLORS[categoryBudget.category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
//               const isEditing = editingCategory === categoryBudget.category;

//               return (
//                 <div key={index} className="category-item bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-start">
//                       <div className={`${colors.bg} ${colors.text} p-2 rounded-lg mr-3`}>
//                         <FontAwesomeIcon icon={icon} />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-700 dark:text-slate-200">
//                           {categoryBudget.category}
//                         </h3>
//                         <p className="text-sm text-slate-500 dark:text-slate-400">
//                           {categoryBudget.transactionCount} transactions this month
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <div className="relative">
//                         <span className="text-sm font-medium text-slate-500 dark:text-slate-200">₦ </span>
//                         {isEditing ? (
//                           <div className="flex items-center space-x-2">
//                             <input
//                               type="number"
//                               value={editValue}
//                               onChange={(e) => setEditValue(e.target.value)}
//                               className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200"
//                               onKeyDown={(e) => {
//                                 if (e.key === 'Enter') saveEdit(categoryBudget.category);
//                                 if (e.key === 'Escape') cancelEdit();
//                               }}
//                               autoFocus
//                             />
//                             <button
//                               onClick={() => saveEdit(categoryBudget.category)}
//                               className="text-green-600 hover:text-green-500"
//                             >
//                               <FontAwesomeIcon icon={'check'} className='text-xs' />
//                             </button>
//                             <button
//                               onClick={cancelEdit}
//                               className="text-red-600 hover:text-red-500"
//                             >
//                               <FontAwesomeIcon icon={'times'} className='text-xs' />
//                             </button>
//                           </div>
//                         ) : (
//                           <>
//                             <span className="bg-slate-100 text-slate-700 dark:bg-slate-600 dark:text-slate-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium">
//                               {categoryBudget.allocated.toLocaleString()}
//                             </span>
//                             <button
//                               onClick={() => startEdit(categoryBudget.category, categoryBudget.allocated)}
//                               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 hover:text-slate-600"
//                             >
//                               <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
//                             </button>
//                           </>
//                         )}
//                       </div>
//                       <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
//                         Spent: {categoryBudget.formattedSpent}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between text-sm mb-2">
//                     <span className="text-slate-500 dark:text-slate-400">
//                       {categoryBudget.percentageUsed}% of budget used
//                     </span>
//                     <span className={`font-medium ${
//                       categoryBudget.remaining >= 0
//                         ? 'text-slate-600 dark:text-slate-300'
//                         : 'text-red-600'
//                     }`}>
//                       {categoryBudget.formattedRemaining} {categoryBudget.remaining >= 0 ? 'remaining' : 'over budget'}
//                     </span>
//                   </div>
//                   <div className="budget-meter">
//                     <div
//                       className={`budget-meter-fill ${
//                         categoryBudget.status === 'exceeded' ? 'bg-red-500' :
//                         categoryBudget.status === 'warning' ? 'bg-yellow-500' :
//                         'bg-green-500'
//                       }`}
//                       style={{ width: `${Math.min(categoryBudget.percentageUsed, 100)}%` }}
//                     ></div>
//                   </div>
//                   <div className="mt-3 flex justify-between text-xs">
//                     <button
//                       onClick={() => window.location.href = `/transactionHistory?category=${encodeURIComponent(categoryBudget.category)}`}
//                       className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
//                     >
//                       <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
//                     </button>
//                     <button
//                       onClick={() => toast.info('Budget alerts can be configured in the Alerts & Reminders section')}
//                       className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
//                     >
//                       <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
//                     </button>
//                     <button
//                       onClick={() => {
//                         if (categoryBudget.remaining > 0) {
//                           const needsMore = categoryBudgets.find(c => c.status === 'exceeded' && c.category !== categoryBudget.category);
//                           if (needsMore) {
//                             const transferAmount = Math.min(categoryBudget.remaining / 2, Math.abs(needsMore.remaining));
//                             if (transferAmount > 0) {
//                               handleTransferBudget(categoryBudget.category, needsMore.category, transferAmount);
//                             }
//                           } else {
//                             toast.info('No categories currently need additional budget');
//                           }
//                         } else {
//                           toast.info('No budget available to transfer from this category');
//                         }
//                       }}
//                       className="px-2 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
//                     >
//                       <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Add New Category */}
//           <div
//             className="bg-white rounded-xl p-4 shadow-sm border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-indigo-300 dark:hover:border-primary dark:border-gray-500 dark:bg-gray-800 transition mb-8"
//             onClick={() => window.location.href = '/budget-planner/screen-3'}
//           >
//             <div className="flex items-center">
//               <div className="w-10 h-10 rounded-full bg-slate-200 text-indigo-600 dark:bg-opacity-80 flex items-center justify-center mr-3">
//                 <FontAwesomeIcon icon={'plus'} />
//               </div>
//               <p className="text-sm font-medium text-indigo-600">
//                 Add New Budget Category
//               </p>
//             </div>
//           </div>

//           {/* Budget Summary */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
//             <h3 className="text-lg text-slate-700 dark:text-slate-300 font-semibold mb-4">Budget Summary</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
//                 <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Total Budget</p>
//                 <h4 className="text-xl font-bold text-slate-600 dark:text-slate-200">
//                   {summary.formattedTotalAllocated}
//                 </h4>
//               </div>
//               <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
//                 <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Total Spent</p>
//                 <h4 className="text-xl font-bold text-slate-600 dark:text-slate-200">
//                   {summary.formattedTotalSpent}
//                 </h4>
//               </div>
//               <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
//                 <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Remaining</p>
//                 <h4 className={`text-xl font-bold ${
//                   summary.totalRemaining >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
//                 }`}>
//                   {summary.formattedTotalRemaining}
//                 </h4>
//               </div>
//             </div>
//             <div className="mt-6">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="text-slate-500 dark:text-slate-400">Budget Utilization</span>
//                 <span className="text-slate-600 dark:text-slate-300">{summary.budgetUtilization}%</span>
//               </div>
//               <div className="budget-meter">
//                 <div
//                   className={`budget-meter-fill ${
//                     summary.budgetUtilization > 100 ? 'bg-red-500' :
//                     summary.budgetUtilization > 80 ? 'bg-yellow-500' :
//                     'bg-green-500'
//                   }`}
//                   style={{ width: `${Math.min(summary.budgetUtilization, 100)}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <br /><br /><br /><br />
//     </>
//   )
// }

// export default CategoryBudgetsPage;

// src/app/budget-planner/screen-2/page.tsx - Enhanced with Nigerian Market Intelligence
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainNavigation from '@/app/components/MainNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import '../../../lib/fontawesome'

interface BudgetData {
  budget: {
    month: string;
    totalBudget: number;
    formattedTotalBudget: string;
    AIWarning?: string;
  } | null;
  categoryBudgets: Array<{
    _id: string;
    category: string;
    allocated: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    status: 'good' | 'warning' | 'exceeded';
    formattedAllocated: string;
    formattedSpent: string;
    formattedRemaining: string;
    transactionCount: number;
    AIRecommendation?: string;
    nigerianPriority?: 'high' | 'medium' | 'low';
    lastTransactionDate?: string;
  }>;
  summary: {
    month: string;
    totalAllocated: number;
    totalSpent: number;
    totalRemaining: number;
    budgetUtilization: number;
    formattedTotalAllocated: string;
    formattedTotalSpent: string;
    formattedTotalRemaining: string;
  };
  insights: Array<{
    type: 'warning' | 'suggestion' | 'alert' | 'nigerian_context' | 'transfer_recommendation';
    message: string;
    action?: string;
    category?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    transferSuggestion?: {
      from: string;
      to: string;
      amount: number;
      reason: string;
    };
  }>;
  nigerianContext: {
    salaryExpected: boolean;
    schoolFeesSeason: boolean;
    festiveSeason: boolean;
    daysUntilSalary: number;
    priorityCategories: string[];
    seasonalAdjustments: Array<{
      category: string;
      suggestedIncrease: number;
      reason: string;
    }>;
  };
}

const NIGERIAN_CATEGORY_ICONS = {
  'Food & Dining': 'utensils',
  'Transport': 'car',
  'Rent/Housing': 'home',
  'Bills': 'bolt',
  'Family Support': 'heart',
  'School Fees': 'graduation-cap',
  'Church/Mosque': 'praying-hands',
  'Emergency Fund': 'shield-alt',
  'Entertainment': 'gamepad',
  'Health/Medical': 'heartbeat',
  'Shopping': 'shopping-bag',
  'Personal Care': 'user',
  'Business': 'briefcase',
  'Savings/Investment': 'piggy-bank',
  'Data/Airtime': 'mobile-alt',
  'Fuel': 'gas-pump',
  'Groceries': 'shopping-basket',
  'Fitness': 'dumbbell',
  'Rent': 'home',
} as const;

const NIGERIAN_CATEGORY_COLORS = {
  'Food & Dining': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
  'Transport': { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
  'Rent/Housing': { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  'Bills': { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' },
  'Family Support': { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
  'School Fees': { bg: 'bg-indigo-100 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
  'Church/Mosque': { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
  'Emergency Fund': { bg: 'bg-gray-100 dark:bg-gray-700/20', text: 'text-gray-600 dark:text-gray-400' },
  'Entertainment': { bg: 'bg-pink-100 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
  'Health/Medical': { bg: 'bg-teal-100 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
  'Shopping': { bg: 'bg-indigo-100 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
  'Personal Care': { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
  'Business': { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
  'Savings/Investment': { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
  'Data/Airtime': { bg: 'bg-cyan-100 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
  'Fuel': { bg: 'bg-rose-100 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400' },
  'Groceries': { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
  'Fitness': { bg: 'bg-teal-100 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' },
  'Rent': { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
} as const;

const CategoryBudgetsPage = () => {
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [transferMode, setTransferMode] = useState(false);
  const [transferFrom, setTransferFrom] = useState<string>('');
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');

  useEffect(() => {
    fetchBudgetData();
  }, [currentMonth]);

  const fetchBudgetData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch budget data');
      }

      const result = await response.json();
      setBudgetData(result);

      // Show Nigerian context notifications
      if (result.nigerianContext) {
        const { schoolFeesSeason, festiveSeason, seasonalAdjustments } = result.nigerianContext;
        
        if (schoolFeesSeason && seasonalAdjustments?.length > 0) {
          toast.info('School fees season detected - consider adjusting education budget categories');
        }
        
        if (festiveSeason) {
          toast.info('Festive season active - family and entertainment budgets may need increases');
        }
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load budget data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async (category: string, newAmount: number) => {
    if (!budgetData?.categoryBudgets) return;

    try {
      const updatedCategories = budgetData.categoryBudgets.map(cat => 
        cat.category === category ? { ...cat, allocated: newAmount } : cat
      );

      const response = await fetch(`/api/budgets/${currentMonth}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: updatedCategories.map(cat => ({
            category: cat.category,
            allocated: cat.allocated
          })),
          nigerianContext: true // Enable Nigerian market adjustments
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update budget');
      }

      const result = await response.json();
      
      toast.success(`${category} budget updated successfully`);
      
      // Show Nigerian context feedback if available
      if (result.nigerianInsights) {
        toast.info(result.nigerianInsights);
      }

      await fetchBudgetData();
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update budget');
    }
  };

  const handleTransferBudget = async (fromCategory: string, toCategory: string, amount: number) => {
    try {
      const response = await fetch('/api/budgets/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          fromCategory,
          toCategory,
          amount,
          reason: `Budget reallocation from ${fromCategory} to ${toCategory} via Category Budgets screen`,
          nigerianContext: budgetData?.nigerianContext || {}
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transfer budget');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Show Nigerian context insights if available
      if (result.insights) {
        toast.info(result.insights);
      }

      await fetchBudgetData();
      setTransferMode(false);
      setTransferFrom('');
      setTransferTo('');
      setTransferAmount('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to transfer budget');
    }
  };

  const executeSmartTransfer = async (transferSuggestion: any) => {
    await handleTransferBudget(
      transferSuggestion.from,
      transferSuggestion.to,
      transferSuggestion.amount
    );
  };

  const startEdit = (category: string, currentAmount: number) => {
    setEditingCategory(category);
    setEditValue(currentAmount.toString());
  };

  const saveEdit = (category: string) => {
    const newAmount = parseInt(editValue.replace(/,/g, ''));
    if (isNaN(newAmount) || newAmount < 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    handleUpdateBudget(category, newAmount);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const current = new Date(currentMonth + '-01');
    if (direction === 'prev') {
      current.setMonth(current.getMonth() - 1);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
    setCurrentMonth(current.toISOString().slice(0, 7));
  };

  const formatMonthName = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getNigerianPriorityBadge = (category: string, nigerianContext: any) => {
    if (!nigerianContext?.priorityCategories) return null;
    
    if (nigerianContext.priorityCategories.includes(category)) {
      return (
        <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
          Nigerian Priority
        </span>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Category Budgets</h2>
              <p className="text-gray-600 dark:text-gray-400">Loading Nigerian market-optimized budget data...</p>
            </div>
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !budgetData?.budget) {
    return (
      <>
        <MainNavigation />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500 dark:text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-300">{error || 'No budget found for this month'}</p>
                  <div className="mt-2 space-x-2">
                    <button 
                      onClick={fetchBudgetData}
                      className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-500"
                    >
                      Try again
                    </button>
                    <button 
                      onClick={() => window.location.href = '/budget-planner/screen-3'}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                    >
                      Create Budget
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { budget, categoryBudgets, summary, insights, nigerianContext } = budgetData;

  return (
    <>
      <MainNavigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Navigation */}
          <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
            <Link
              href="/budget-planner/screen-1"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >Monthly Overview</Link>
            <Link
              href="/budget-planner/screen-2"
              className="text-sm font-medium text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 pb-1"
            >Category Budgets</Link>
            <Link
              href="/budget-planner/screen-3"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >Smart Budget Assistant (AI)</Link>
            <Link
              href="/budget-planner/screen-4"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >Budget Alerts & Reminders</Link>
            <Link
              href="/budget-planner/screen-5"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >Budget Calendar</Link>
          </nav>

          {/* Page Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Category Budgets</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage Nigerian market-optimized spending limits per category
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setTransferMode(!transferMode)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${
                  transferMode 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white dark:bg-gray-800 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                }`}
              >
                <FontAwesomeIcon icon={'exchange-alt'} className='mr-2' />
                {transferMode ? 'Exit Transfer' : 'Transfer Mode'}
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center"
              >
                <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
              </button>
            </div>
          </div>

          {/* Current Month Selector */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between border border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {formatMonthName(currentMonth)} Budgets
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {nigerianContext?.salaryExpected 
                  ? `Salary expected in ${nigerianContext.daysUntilSalary} days`
                  : 'Viewing budgets for selected month'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => changeMonth('prev')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={'chevron-left'} className='text-gray-500 dark:text-gray-400' />
              </button>
              <button className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium">
                <FontAwesomeIcon icon={'calendar-alt'} className='mr-2' /> Change Month
              </button>
              <button 
                onClick={() => changeMonth('next')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={'chevron-right'} className='text-gray-500 dark:text-gray-400' />
              </button>
            </div>
          </div>

          {/* Nigerian Context Panel */}
          {nigerianContext && (nigerianContext.schoolFeesSeason || nigerianContext.festiveSeason || nigerianContext.seasonalAdjustments?.length > 0) && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FontAwesomeIcon icon={'globe-africa'} className="text-green-600 dark:text-green-400 mt-1" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Nigerian Market Context</h4>
                  <div className="space-y-1 text-xs">
                    {nigerianContext.schoolFeesSeason && (
                      <p className="text-green-700 dark:text-green-300">
                        🎓 School fees season - Consider increasing education category budgets
                      </p>
                    )}
                    {nigerianContext.festiveSeason && (
                      <p className="text-blue-700 dark:text-blue-300">
                        🎉 Festive season - Family support and entertainment may need budget increases
                      </p>
                    )}
                    {nigerianContext.seasonalAdjustments?.map((adjustment, index) => (
                      <p key={index} className="text-purple-700 dark:text-purple-300">
                        💡 {adjustment.category}: Consider ₦{adjustment.suggestedIncrease.toLocaleString()} increase - {adjustment.reason}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Insight Panel with Transfer Recommendations */}
          {insights.length > 0 && (
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-4 mb-6 flex items-start">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <FontAwesomeIcon icon={'robot'} className='text-purple-700' />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nigerian Market AI Insights</p>
                <p className="text-sm opacity-90 mb-2">{insights[0].message}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {insights[0].transferSuggestion && (
                    <button
                      onClick={() => executeSmartTransfer(insights[0].transferSuggestion)}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition"
                    >
                      <FontAwesomeIcon icon={'magic'} className='mr-1' /> 
                      Smart Transfer: ₦{insights[0].transferSuggestion.amount.toLocaleString()}
                    </button>
                  )}
                  <button
                    onClick={() => toast.info('Budget adjustments can be made by editing category amounts below')}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs text-purple-700 font-medium hover:bg-opacity-30 transition"
                  >
                    <FontAwesomeIcon icon={'adjust'} className='mr-1' /> Manual Adjust
                  </button>
                  <button
                    onClick={() => window.location.href = '/budget-planner/screen-1'}
                    className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs text-purple-700 font-medium hover:bg-opacity-30 transition"
                  >
                    <FontAwesomeIcon icon={'chart-line'} className='mr-1' /> View Overview
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transfer Mode Panel */}
          {transferMode && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 border border-indigo-200 dark:border-indigo-500/30">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <FontAwesomeIcon icon={'exchange-alt'} className="text-indigo-600 dark:text-indigo-400 mr-2" />
                Budget Transfer Mode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md p-2 text-sm"
                >
                  <option value="">From Category</option>
                  {categoryBudgets.filter(cat => cat.remaining > 0).map(cat => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category} (₦{cat.remaining.toLocaleString()} available)
                    </option>
                  ))}
                </select>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md p-2 text-sm"
                >
                  <option value="">To Category</option>
                  {categoryBudgets.filter(cat => cat.category !== transferFrom).map(cat => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category} {cat.remaining < 0 && `(needs ₦${Math.abs(cat.remaining).toLocaleString()})`}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md p-2 text-sm"
                />
                <button
                  onClick={() => {
                    if (transferFrom && transferTo && transferAmount) {
                      handleTransferBudget(transferFrom, transferTo, parseFloat(transferAmount));
                    } else {
                      toast.error('Please fill all transfer fields');
                    }
                  }}
                  disabled={!transferFrom || !transferTo || !transferAmount}
                  className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <FontAwesomeIcon icon={'arrow-right'} className="mr-1" />
                  Execute Transfer
                </button>
              </div>
            </div>
          )}

          {/* Category Budget List */}
          <div className="space-y-4 mb-8">
            {categoryBudgets.map((categoryBudget, index) => {
              const icon = NIGERIAN_CATEGORY_ICONS[categoryBudget.category as keyof typeof NIGERIAN_CATEGORY_ICONS] || 'folder';
              const colors = NIGERIAN_CATEGORY_COLORS[categoryBudget.category as keyof typeof NIGERIAN_CATEGORY_COLORS] || {
                bg: 'bg-gray-100 dark:bg-gray-700/20',
                text: 'text-gray-600 dark:text-gray-400'
              };
              const isEditing = editingCategory === categoryBudget.category;
              const priorityBadge = getNigerianPriorityBadge(categoryBudget.category, nigerianContext);

              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start">
                      <div className={`${colors.bg} ${colors.text} p-2 rounded-lg mr-3`}>
                        <FontAwesomeIcon icon={icon} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {categoryBudget.category}
                          </h3>
                          {priorityBadge}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {categoryBudget.transactionCount} transactions this month
                          {categoryBudget.lastTransactionDate && (
                            <span className="ml-2 text-xs text-gray-500">
                              Last: {new Date(categoryBudget.lastTransactionDate).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                        {categoryBudget.AIRecommendation && (
                          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1">
                            💡 {categoryBudget.AIRecommendation}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="relative">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">₦ </span>
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/50"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(categoryBudget.category);
                                if (e.key === 'Escape') cancelEdit();
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(categoryBudget.category)}
                              className="text-green-600 dark:text-green-400 hover:text-green-500"
                            >
                              <FontAwesomeIcon icon={'check'} className='text-xs' />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 dark:text-red-400 hover:text-red-500"
                            >
                              <FontAwesomeIcon icon={'times'} className='text-xs' />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg pl-3 pr-7 py-1 text-left w-24 font-medium">
                              {categoryBudget.allocated.toLocaleString()}
                            </span>
                            <button
                              onClick={() => startEdit(categoryBudget.category, categoryBudget.allocated)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <FontAwesomeIcon icon={'pencil-alt'} className='text-xs' />
                            </button>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Spent: {categoryBudget.formattedSpent}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      {categoryBudget.percentageUsed}% of budget used
                    </span>
                    <span className={`font-medium ${
                      categoryBudget.remaining >= 0 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {categoryBudget.formattedRemaining} {categoryBudget.remaining >= 0 ? 'remaining' : 'over budget'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        categoryBudget.status === 'exceeded' ? 'bg-red-500' :
                        categoryBudget.status === 'warning' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(categoryBudget.percentageUsed, 100)}%` }}
                    ></div>
                  </div>
                  <div className="mt-3 flex justify-between text-xs">
                    <button
                      onClick={() => window.location.href = `/transactionHistory?category=${encodeURIComponent(categoryBudget.category)}`}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FontAwesomeIcon icon={'chart-pie'} className='mr-1' /> View Breakdown
                    </button>
                    <button
                      onClick={() => window.location.href = '/budget-planner/screen-4'}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <FontAwesomeIcon icon={'bell'} className='mr-1' /> Set Alert
                    </button>
                    <button
                      onClick={() => {
                        if (categoryBudget.remaining > 0) {
                          const needsMore = categoryBudgets.find(c => c.status === 'exceeded' && c.category !== categoryBudget.category);
                          if (needsMore) {
                            const transferAmount = Math.min(categoryBudget.remaining / 2, Math.abs(needsMore.remaining));
                            if (transferAmount > 0) {
                              handleTransferBudget(categoryBudget.category, needsMore.category, transferAmount);
                            }
                          } else {
                            toast.info('No categories currently need additional budget');
                          }
                        } else {
                          toast.info('No budget available to transfer from this category');
                        }
                      }}
                      className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      <FontAwesomeIcon icon={'exchange-alt'} className='mr-1' /> Transfer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Category */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-400 transition mb-8"
            onClick={() => window.location.href = '/budget-planner/screen-3'}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={'plus'} />
              </div>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Add New Budget Category
              </p>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-gray-900 dark:text-gray-100 font-semibold">Budget Summary</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  summary.budgetUtilization > 100 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                  summary.budgetUtilization > 80 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                }`}>
                  {summary.budgetUtilization > 100 ? 'Over Budget' :
                   summary.budgetUtilization > 80 ? 'Near Limit' : 'On Track'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Budget</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {summary.formattedTotalAllocated}
                </h4>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Spent</p>
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {summary.formattedTotalSpent}
                </h4>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</p>
                <h4 className={`text-xl font-bold ${
                  summary.totalRemaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {summary.formattedTotalRemaining}
                </h4>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Budget Utilization</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium">{summary.budgetUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    summary.budgetUtilization > 100 ? 'bg-red-500' :
                    summary.budgetUtilization > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(summary.budgetUtilization, 100)}%` }}
                ></div>
              </div>
              {summary.budgetUtilization > 100 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center">
                  <FontAwesomeIcon icon={'exclamation-triangle'} className="mr-1" />
                  Budget exceeded by ₦{Math.abs(summary.totalRemaining).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="pb-20" />
    </>
  )
}

export default CategoryBudgetsPage;