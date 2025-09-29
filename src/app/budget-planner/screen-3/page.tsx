// // src/app/budget-planner/screen-3/page.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import MainNavigation from '@/app/components/MainNavigation'
// import '../../../lib/fontawesome'
// import Link from 'next/link'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import BudgetCategoryCard from '@/app/components/BudgetCategoryCard'

// interface AIBudgetSuggestion {
//   totalBudget: number;
//   optimizations: Array<{
//     category: string;
//     currentBudget: number;
//     suggestedBudget: number;
//     reasoning: string;
//     impact: string;
//     priority: number;
//   }>;
//   projectedSavings: number;
//   confidence: number;
//   nigerianFactors: string[];
// }

// interface BudgetOptimization {
//   category: string;
//   currentBudget: number;
//   suggestedBudget: number;
//   reasoning: string;
//   impact: string;
//   priority: number;
// }

// const SmartBudgetAssistant = () => {
//   const [aiSuggestions, setAISuggestions] = useState<AIBudgetSuggestion | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [promptText, setPromptText] = useState('');
//   const [currentMonth] = useState(new Date().toISOString().slice(0, 7));
//   const [budgetValues, setBudgetValues] = useState<Record<string, number>>({});
//   const [applying, setApplying] = useState(false);

//   useEffect(() => {
//     // Auto-generate a default budget suggestion when component loads
//     generateBudgetSuggestion('optimize', 'Generate an optimized budget based on my spending patterns');
//   }, []);

//   const generateBudgetSuggestion = async (goalType: string, prompt: string) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch('/api/budgets/ai-assistant', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           currentMonth,
//           goalType,
//           prompt,
//           targetSavings: goalType === 'save_percentage' ? 10 : undefined,
//           constraints: []
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to generate AI suggestions');
//       }

//       const result = await response.json();
//       setAISuggestions(result.suggestions);
      
//       // Initialize budget values with AI suggestions
//       const initialValues: Record<string, number> = {};
//       result.suggestions.optimizations.forEach((opt: BudgetOptimization) => {
//         initialValues[opt.category] = opt.suggestedBudget;
//       });
//       setBudgetValues(initialValues);

//       toast.success('AI budget suggestions generated successfully!');
//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to generate AI suggestions';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePromptSubmit = () => {
//     if (!promptText.trim()) {
//       toast.error('Please enter a budget request');
//       return;
//     }
//     generateBudgetSuggestion('custom', promptText);
//   };

//   const handleQuickPrompt = (prompt: string, goalType: string) => {
//     setPromptText(prompt);
//     generateBudgetSuggestion(goalType, prompt);
//   };

//   const handleValueChange = (category: string, value: number) => {
//     setBudgetValues(prev => ({
//       ...prev,
//       [category]: value
//     }));
//   };

//   const handleApplyBudget = async () => {
//     if (!aiSuggestions || Object.keys(budgetValues).length === 0) {
//       toast.error('No budget data to apply');
//       return;
//     }

//     setApplying(true);

//     try {
//       const totalBudget = Object.values(budgetValues).reduce((sum, val) => sum + val, 0);
//       const categories = Object.entries(budgetValues).map(([category, allocated]) => ({
//         category,
//         allocated
//       }));

//       const response = await fetch('/api/budgets', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           month: currentMonth,
//           totalBudget,
//           categories
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to apply budget');
//       }

//       const result = await response.json();
//       toast.success('Budget applied successfully!');
      
//       // Redirect to category budgets to see the applied budget
//       setTimeout(() => {
//         window.location.href = '/budget-planner/screen-2';
//       }, 1500);

//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to apply budget';
//       toast.error(errorMessage);
//     } finally {
//       setApplying(false);
//     }
//   };

//   const handleRegenerate = () => {
//     if (promptText.trim()) {
//       generateBudgetSuggestion('custom', promptText);
//     } else {
//       generateBudgetSuggestion('optimize', 'Generate an optimized budget based on my spending patterns');
//     }
//   };

//   const getCategoryIcon = (category: string) => {
//     const iconMap: Record<string, string> = {
//       'Groceries': 'shopping-basket',
//       'Food & Dining': 'utensils',
//       'Transport': 'car',
//       'Entertainment': 'film',
//       'Fitness': 'dumbbell',
//       'Health & Fitness': 'heartbeat',
//       'Rent': 'home',
//       'Rent/Housing': 'home',
//       'Bills': 'bolt',
//       'Family Support': 'heart',
//       'Emergency Fund': 'shield-alt',
//     };
//     return iconMap[category] || 'folder';
//   };

//   const getCategoryColors = (category: string) => {
//     const colorMap: Record<string, { bg: string; text: string }> = {
//       'Groceries': { bg: 'bg-green-100', text: 'text-green-600' },
//       'Food & Dining': { bg: 'bg-green-100', text: 'text-green-600' },
//       'Transport': { bg: 'bg-blue-100', text: 'text-blue-600' },
//       'Entertainment': { bg: 'bg-pink-100', text: 'text-pink-600' },
//       'Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
//       'Health & Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
//       'Rent': { bg: 'bg-purple-100', text: 'text-purple-600' },
//       'Rent/Housing': { bg: 'bg-purple-100', text: 'text-purple-600' },
//       'Bills': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
//       'Family Support': { bg: 'bg-red-100', text: 'text-red-600' },
//       'Emergency Fund': { bg: 'bg-gray-100', text: 'text-gray-600' },
//     };
//     return colorMap[category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
//   };

//   const calculateTotalBudget = () => {
//     return Object.values(budgetValues).reduce((sum, val) => sum + val, 0);
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//       minimumFractionDigits: 0,
//     }).format(amount).replace('NGN', '₦');
//   };

//   return (
//     <>
//       <MainNavigation />
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Navigation */}
//         <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
//           <Link
//             href="/budget-planner/screen-1"
//             className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//           >Monthly Overview</Link>
//           <Link
//             href="/budget-planner/screen-2"
//             className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//           >Category Budgets</Link>
//           <Link
//             href="/budget-planner/screen-3"
//             className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
//           >Smart Budget Assistant (AI)</Link>
//           <Link
//             href="/budget-planner/screen-4"
//             className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//           >Budget Alerts & Reminders</Link>
//           <Link
//             href="/budget-planner/screen-5"
//             className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
//           >Budget Calendar</Link>
//         </nav>

//         {/* Page Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
//               Smart Budget Assistant
//             </h2>
//             <p className="text-slate-500 dark:text-slate-400">
//               AI-powered budget generation and optimization
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => window.history.back()}
//               className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
//             >
//               <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
//             </button>
//           </div>
//         </div>

//         {/* AI Prompt Section */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
//           <div className="flex items-center mb-4">
//             <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
//               <FontAwesomeIcon icon={'robot'} className='text-xl' />
//             </div>
//             <div>
//               <h3 className="font-semibold text-slate-700 dark:text-slate-300">
//                 How can I help with your budget?
//               </h3>
//               <p className="text-sm text-slate-500 dark:text-slate-400">
//                 Try one of these prompts or type your own
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
//             <button
//               onClick={() => handleQuickPrompt('Generate a new budget based on last 3 months', 'generate_from_history')}
//               disabled={loading}
//               className="prompt-chip px-4 py-3 bg-indigo-50 dark:bg-indigo-100 dark:hover:bg-indigo-200 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left disabled:opacity-50"
//             >
//               <FontAwesomeIcon icon={'magic'} className='mr-2' />
//               Generate a new budget based on last 3 months
//             </button>
//             <button
//               onClick={() => handleQuickPrompt('Optimize to save 10% more this month', 'save_percentage')}
//               disabled={loading}
//               className="prompt-chip px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-100 dark:hover:bg-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left disabled:opacity-50"
//             >
//               <FontAwesomeIcon icon={'bullseye'} className='mr-2' />
//               Optimize to save 10% more this month
//             </button>
//             <button
//               onClick={() => handleQuickPrompt('Build me a zero-based budget', 'zero_based')}
//               disabled={loading}
//               className="prompt-chip px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-100 dark:hover:bg-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left disabled:opacity-50"
//             >
//               <FontAwesomeIcon icon={'calculator'} className='mr-2' />
//               Build me a zero-based budget
//             </button>
//           </div>

//           <div className="relative">
//             <input
//               type="text"
//               value={promptText}
//               onChange={(e) => setPromptText(e.target.value)}
//               placeholder="Type your budget request here..."
//               className="w-full px-4 py-3 pr-12 bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
//               onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
//               disabled={loading}
//             />
//             <button
//               onClick={handlePromptSubmit}
//               disabled={loading || !promptText.trim()}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
//               ) : (
//                 <FontAwesomeIcon icon={'paper-plane'} />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
//               <p className="text-slate-600 dark:text-slate-300">
//                 AI is analyzing your spending patterns and generating budget suggestions...
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//                 <button
//                   onClick={handleRegenerate}
//                   className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
//                 >
//                   Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* AI Generated Budget */}
//         {aiSuggestions && !loading && (
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
//                   <FontAwesomeIcon icon={'lightbulb'} />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-slate-700 dark:text-slate-300">AI-Generated Budget</h3>
//                   <p className="text-sm text-slate-500 dark:text-slate-400">
//                     Based on your spending patterns and goals ({Math.round(aiSuggestions.confidence * 100)}% confidence)
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={handleRegenerate}
//                   disabled={loading}
//                   className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition disabled:opacity-50"
//                 >
//                   <FontAwesomeIcon icon={'redo'} className='mr-1' /> Regenerate
//                 </button>
//                 <button
//                   onClick={handleApplyBudget}
//                   disabled={applying}
//                   className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition disabled:opacity-50"
//                 >
//                   {applying ? (
//                     <>
//                       <div className="animate-spin w-3 h-3 border border-green-600 border-t-transparent rounded-full inline-block mr-1"></div>
//                       Applying...
//                     </>
//                   ) : (
//                     <>
//                       <FontAwesomeIcon icon={'check-circle'} className='mr-1' /> Apply Budget
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Nigerian Context Information */}
//             {aiSuggestions.nigerianFactors && aiSuggestions.nigerianFactors.length > 0 && (
//               <div className="ai-gradient-bg text-white rounded-lg p-4 mb-6 flex items-start">
//                 <div
//                   style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
//                   className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
//                 >
//                   <FontAwesomeIcon icon={'info-circle'} />
//                 </div>
//                 <div className="flex-1">
//                   <p className="font-medium">Nigerian Market Optimizations</p>
//                   <ul className="text-sm opacity-90 mt-1">
//                     {aiSuggestions.nigerianFactors.map((factor, index) => (
//                       <li key={index}>• {factor}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             )}

//             {/* Budget Category Sliders */}
//             <div className="space-y-6">
//               {aiSuggestions.optimizations
//                 .sort((a, b) => a.priority - b.priority)
//                 .map((optimization, index) => {
//                   const icon = getCategoryIcon(optimization.category);
//                   const colors = getCategoryColors(optimization.category);
//                   const currentValue = budgetValues[optimization.category] || optimization.suggestedBudget;
//                   const minValue = Math.max(optimization.suggestedBudget * 0.5, 1000);
//                   const maxValue = optimization.suggestedBudget * 1.5;
                  
//                   return (
//                     <BudgetCategoryCard
//                       key={index}
//                       icon={icon}
//                       iconBgClass={colors.bg}
//                       iconTextClass={colors.text}
//                       categoryTitle={optimization.category}
//                       categorySubtitle={optimization.reasoning}
//                       crossedAmount={optimization.currentBudget > 0 ? formatCurrency(optimization.currentBudget) : undefined}
//                       minValue={minValue}
//                       maxValue={maxValue}
//                       defaultValue={currentValue}
//                       bottomTip={optimization.impact ? {
//                         icon: 'info-circle',
//                         text: optimization.impact,
//                         className: 'text-indigo-500',
//                       } : undefined}
//                       onValueChange={(value) => handleValueChange(optimization.category, value)}
//                     />
//                   );
//                 })}
//             </div>
//           </div>
//         )}

//         {/* Budget Summary */}
//         {aiSuggestions && !loading && (
//           <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Budget Summary</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
//                 <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Previous Total Budget</p>
//                 <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200">
//                   {aiSuggestions.optimizations.reduce((sum, opt) => sum + opt.currentBudget, 0) > 0
//                     ? formatCurrency(aiSuggestions.optimizations.reduce((sum, opt) => sum + opt.currentBudget, 0))
//                     : 'No Previous Budget'
//                   }
//                 </h4>
//               </div>
//               <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
//                 <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">AI-Adjusted Budget</p>
//                 <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-500">
//                   {formatCurrency(calculateTotalBudget())}
//                 </h4>
//               </div>
//               <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
//                 <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">
//                   {aiSuggestions.projectedSavings >= 0 ? 'Monthly Savings' : 'Additional Spending'}
//                 </p>
//                 <h4 className={`text-xl font-bold ${
//                   aiSuggestions.projectedSavings >= 0
//                     ? 'text-green-600 dark:text-green-500'
//                     : 'text-red-600 dark:text-red-500'
//                 }`}>
//                   {aiSuggestions.projectedSavings >= 0 ? '+' : ''}{formatCurrency(aiSuggestions.projectedSavings)}
//                 </h4>
//               </div>
//             </div>

//             <div className="flex justify-between items-center">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
//                   <FontAwesomeIcon icon={'info-circle'} />
//                 </div>
//                 <div>
//                   <p className="text-sm text-slate-500 dark:text-slate-300">
//                     {aiSuggestions.projectedSavings >= 0
//                       ? `This budget helps you save ${formatCurrency(aiSuggestions.projectedSavings)} monthly`
//                       : 'This budget allocates more for essential categories'
//                     }
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleApplyBudget}
//                 disabled={applying}
//                 className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
//               >
//                 {applying ? 'Applying Budget...' : 'Apply This Budget'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       <br /><br /><br /><br />
//     </>
//   )
// }

// export default SmartBudgetAssistant;

// src/app/budget-planner/screen-3/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MainNavigation from '@/app/components/MainNavigation'
import '../../../lib/fontawesome'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BudgetCategoryCard from '@/app/components/BudgetCategoryCard'

interface AIBudgetSuggestion {
  totalBudget: number;
  optimizations: Array<{
    category: string;
    currentBudget: number;
    suggestedBudget: number;
    reasoning: string;
    impact: string;
    priority: number;
  }>;
  projectedSavings: number;
  confidence: number;
  nigerianFactors: string[];
}

interface BudgetOptimization {
  category: string;
  currentBudget: number;
  suggestedBudget: number;
  reasoning: string;
  impact: string;
  priority: number;
}

const SmartBudgetAssistant = () => {
  const [aiSuggestions, setAISuggestions] = useState<AIBudgetSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptText, setPromptText] = useState('');
  const [currentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgetValues, setBudgetValues] = useState<Record<string, number>>({});
  const [applying, setApplying] = useState(false);

  // Nigerian context state
  const [nigerianContext, setNigerianContext] = useState({
    salaryExpected: false,
    schoolFeesSeason: false,
    festiveSeason: false,
    midMonthCashFlow: false
  });

  // Budget analysis state
  const [budgetAnalysis, setBudgetAnalysis] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    nigerianOptimizations: string[];
  } | null>(null);

  useEffect(() => {
    // Set Nigerian context based on current date
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const month = currentDate.getMonth();
    
    setNigerianContext({
      salaryExpected: dayOfMonth >= 25,
      schoolFeesSeason: [0, 8].includes(month), // January, September
      festiveSeason: [11, 0].includes(month), // December, January
      midMonthCashFlow: dayOfMonth >= 15 && dayOfMonth <= 20
    });

    // Auto-generate a default budget suggestion when component loads
    generateBudgetSuggestion('optimize', 'Generate an optimized budget based on my spending patterns and Nigerian economic context');
  }, []);

  const generateBudgetSuggestion = async (goalType: string, prompt: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/budgets/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMonth,
          goalType,
          prompt,
          targetSavings: goalType === 'save_percentage' ? 15 : undefined,
          constraints: [],
          nigerianContext: {
            salaryExpected: nigerianContext.salaryExpected,
            schoolFeesSeason: nigerianContext.schoolFeesSeason,
            festiveSeason: nigerianContext.festiveSeason,
            midMonthCashFlow: nigerianContext.midMonthCashFlow
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate AI suggestions');
      }

      const result = await response.json();
      setAISuggestions(result.suggestions);
      
      // Initialize budget values with AI suggestions
      const initialValues: Record<string, number> = {};
      result.suggestions.optimizations.forEach((opt: BudgetOptimization) => {
        initialValues[opt.category] = opt.suggestedBudget;
      });
      setBudgetValues(initialValues);

      // Generate enhanced budget analysis
      generateBudgetAnalysis(result.suggestions);

      toast.success('AI budget suggestions generated successfully with Nigerian market intelligence!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI suggestions';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateBudgetAnalysis = (suggestions: AIBudgetSuggestion) => {
    const totalBudget = suggestions.optimizations.reduce((sum, opt) => sum + opt.suggestedBudget, 0);
    const savingsRate = (suggestions.projectedSavings / totalBudget) * 100;
    
    let score = 70; // Base score
    
    // Score adjustments
    if (savingsRate >= 20) score += 20;
    else if (savingsRate >= 10) score += 10;
    
    if (suggestions.confidence >= 0.8) score += 10;
    if (suggestions.nigerianFactors?.length >= 3) score += 10;

    const analysis = {
      score: Math.min(score, 100),
      strengths: [
        'Well-balanced category allocation for Nigerian market',
        `Savings rate of ${Math.round(savingsRate)}% aligns with local financial goals`,
        'Budget includes Nigerian economic volatility buffers'
      ],
      improvements: [
        'Consider increasing emergency fund for naira volatility',
        'Transport budget could benefit from fuel price adjustments',
        'Family support allocation may need seasonal review'
      ],
      nigerianOptimizations: suggestions.nigerianFactors || [
        'Budget accounts for Nigerian salary payment cycles',
        'Seasonal adjustments for school fees included',
        'Local economic patterns incorporated'
      ]
    };

    setBudgetAnalysis(analysis);
  };

  const handlePromptSubmit = () => {
    if (!promptText.trim()) {
      toast.error('Please enter a budget request');
      return;
    }
    generateBudgetSuggestion('custom', promptText);
  };

  const handleQuickPrompt = (prompt: string, goalType: string) => {
    setPromptText(prompt);
    generateBudgetSuggestion(goalType, prompt);
  };

  const handleValueChange = (category: string, value: number) => {
    setBudgetValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleApplyBudget = async () => {
    if (!aiSuggestions || Object.keys(budgetValues).length === 0) {
      toast.error('No budget data to apply');
      return;
    }

    setApplying(true);

    try {
      const totalBudget = Object.values(budgetValues).reduce((sum, val) => sum + val, 0);
      const categories = Object.entries(budgetValues).map(([category, allocated]) => ({
        category,
        allocated
      }));

      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: currentMonth,
          totalBudget,
          categories,
          aiGenerated: true,
          nigerianContext,
          budgetScore: budgetAnalysis?.score
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply budget');
      }

      const result = await response.json();
      toast.success('AI-optimized budget applied successfully!');
      
      // Redirect to category budgets to see the applied budget
      setTimeout(() => {
        window.location.href = '/budget-planner/screen-2';
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to apply budget';
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const handleRegenerate = () => {
    if (promptText.trim()) {
      generateBudgetSuggestion('custom', promptText);
    } else {
      generateBudgetSuggestion('optimize', 'Generate an optimized budget based on my spending patterns and Nigerian economic context');
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      'Groceries': 'shopping-basket',
      'Food & Dining': 'utensils',
      'Transport': 'car',
      'Entertainment': 'film',
      'Fitness': 'dumbbell',
      'Health & Fitness': 'heartbeat',
      'Rent': 'home',
      'Rent/Housing': 'home',
      'Bills': 'bolt',
      'Family Support': 'heart',
      'Emergency Fund': 'shield-alt',
      'Church/Mosque': 'pray',
      'School Fees': 'graduation-cap',
      'Data/Airtime': 'mobile-alt'
    };
    return iconMap[category] || 'folder';
  };

  const getCategoryColors = (category: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      'Groceries': { bg: 'bg-green-100', text: 'text-green-600' },
      'Food & Dining': { bg: 'bg-green-100', text: 'text-green-600' },
      'Transport': { bg: 'bg-blue-100', text: 'text-blue-600' },
      'Entertainment': { bg: 'bg-pink-100', text: 'text-pink-600' },
      'Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
      'Health & Fitness': { bg: 'bg-teal-100', text: 'text-teal-600' },
      'Rent': { bg: 'bg-purple-100', text: 'text-purple-600' },
      'Rent/Housing': { bg: 'bg-purple-100', text: 'text-purple-600' },
      'Bills': { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      'Family Support': { bg: 'bg-red-100', text: 'text-red-600' },
      'Emergency Fund': { bg: 'bg-gray-100', text: 'text-gray-600' },
      'Church/Mosque': { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      'School Fees': { bg: 'bg-orange-100', text: 'text-orange-600' },
      'Data/Airtime': { bg: 'bg-cyan-100', text: 'text-cyan-600' }
    };
    return colorMap[category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  const calculateTotalBudget = () => {
    return Object.values(budgetValues).reduce((sum, val) => sum + val, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦');
  };

  return (
    <>
      <MainNavigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation */}
        <nav className="flex items-center space-x-6 mb-8 overflow-x-auto pb-2">
          <Link
            href="/budget-planner/screen-1"
            className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
          >Monthly Overview</Link>
          <Link
            href="/budget-planner/screen-2"
            className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
          >Category Budgets</Link>
          <Link
            href="/budget-planner/screen-3"
            className="text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1"
          >Smart Budget Assistant (AI)</Link>
          <Link
            href="/budget-planner/screen-4"
            className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
          >Budget Alerts & Reminders</Link>
          <Link
            href="/budget-planner/screen-5"
            className="text-sm font-medium text-slate-500 dark:text-slate-300 dark:hover:text-indigo-500 hover:text-indigo-600"
          >Budget Calendar</Link>
        </nav>

        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Smart Budget Assistant
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              AI-powered budget generation and optimization for the Nigerian market
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-white border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 transition flex items-center"
            >
              <FontAwesomeIcon icon={'arrow-left'} className='mr-2' /> Back
            </button>
          </div>
        </div>

        {/* Nigerian Market Context Alert */}
        {(nigerianContext.salaryExpected || nigerianContext.schoolFeesSeason || nigerianContext.festiveSeason) && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 mb-6 border border-green-200 dark:border-green-800">
            <div className="flex items-start space-x-3">
              <FontAwesomeIcon icon={'info-circle'} className="text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-green-800 dark:text-green-200">Nigerian Market Context</h3>
                <div className="mt-2 space-y-1">
                  {nigerianContext.salaryExpected && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      • Salary payment season - optimal time for budget planning
                    </p>
                  )}
                  {nigerianContext.schoolFeesSeason && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      • School fees season - consider additional education allocations
                    </p>
                  )}
                  {nigerianContext.festiveSeason && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      • Festive season - budget for celebrations and family obligations
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Prompt Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={'robot'} className='text-xl' />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                How can I help optimize your budget?
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try one of these Nigerian-optimized prompts or type your own
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => handleQuickPrompt('Generate a budget optimized for Nigerian salary cycles and economic patterns', 'generate_from_history')}
              disabled={loading}
              className="prompt-chip px-4 py-3 bg-indigo-50 dark:bg-indigo-100 dark:hover:bg-indigo-200 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left disabled:opacity-50"
            >
              <FontAwesomeIcon icon={'magic'} className='mr-2' />
              Nigerian Market Optimized Budget
            </button>
            <button
              onClick={() => handleQuickPrompt('Create a budget that saves 15% while accounting for Nigerian economic volatility', 'save_percentage')}
              disabled={loading}
              className="prompt-chip px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-100 dark:hover:bg-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left disabled:opacity-50"
            >
              <FontAwesomeIcon icon={'bullseye'} className='mr-2' />
              High-Savings Nigerian Budget
            </button>
            <button
              onClick={() => handleQuickPrompt('Build a zero-based budget with Nigerian category priorities', 'zero_based')}
              disabled={loading}
              className="prompt-chip px-4 py-3 bg-indigo-50 text-indigo-600 dark:bg-indigo-100 dark:hover:bg-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition text-left disabled:opacity-50"
            >
              <FontAwesomeIcon icon={'calculator'} className='mr-2' />
              Zero-Based Nigerian Budget
            </button>
          </div>

          {nigerianContext.schoolFeesSeason && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleQuickPrompt('Optimize my budget for school fees season with emergency buffers', 'school_fees_season')}
                disabled={loading}
                className="prompt-chip px-4 py-3 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition text-left disabled:opacity-50"
              >
                <FontAwesomeIcon icon={'graduation-cap'} className='mr-2' />
                School Fees Season Budget
              </button>
              <button
                onClick={() => handleQuickPrompt('Create a budget that balances school fees with family obligations', 'education_family_balance')}
                disabled={loading}
                className="prompt-chip px-4 py-3 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition text-left disabled:opacity-50"
              >
                <FontAwesomeIcon icon={'balance-scale'} className='mr-2' />
                Education-Family Balance
              </button>
            </div>
          )}

          <div className="relative">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Type your budget request here (e.g., 'Plan for Sallah expenses', 'Budget for fuel price increases')..."
              className="w-full px-4 py-3 pr-12 bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent"
              onKeyDown={(e) => e.key === 'Enter' && handlePromptSubmit()}
              disabled={loading}
            />
            <button
              onClick={handlePromptSubmit}
              disabled={loading || !promptText.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
              ) : (
                <FontAwesomeIcon icon={'paper-plane'} />
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
              <p className="text-slate-600 dark:text-slate-300">
                AI is analyzing Nigerian market patterns and generating optimized budget suggestions...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FontAwesomeIcon icon={'exclamation-triangle'} className="text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={handleRegenerate}
                  className="mt-2 text-xs font-medium text-red-600 hover:text-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Budget Analysis Score */}
        {budgetAnalysis && aiSuggestions && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                Nigerian Market Budget Analysis
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-slate-500 dark:text-slate-400">AI Confidence Score</p>
                  <p className={`text-2xl font-bold ${budgetAnalysis.score >= 80 ? 'text-green-600' : budgetAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {budgetAnalysis.score}/100
                  </p>
                </div>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${budgetAnalysis.score >= 80 ? 'bg-green-100 dark:bg-green-900/30' : budgetAnalysis.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  <FontAwesomeIcon icon={budgetAnalysis.score >= 80 ? 'check-circle' : budgetAnalysis.score >= 60 ? 'exclamation-circle' : 'times-circle'} className={`w-6 h-6 ${budgetAnalysis.score >= 80 ? 'text-green-600' : budgetAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
                </div>
              </div>
            </div>
            
            <div className={`rounded-lg p-4 ${budgetAnalysis.score >= 80 ? 'bg-green-50 dark:bg-green-900/20' : budgetAnalysis.score >= 60 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <p className={`text-sm ${budgetAnalysis.score >= 80 ? 'text-green-800 dark:text-green-200' : budgetAnalysis.score >= 60 ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'}`}>
                {budgetAnalysis.score >= 80 ? '🎉 Excellent! Your budget is well-optimized for the Nigerian market with proper allocations and economic buffers.' :
                 budgetAnalysis.score >= 60 ? '⚠️ Good foundation, but some adjustments recommended for Nigerian market conditions.' :
                 '❌ Budget needs significant adjustments to align with Nigerian economic realities.'}
              </p>
            </div>
          </div>
        )}

        {/* AI Generated Budget */}
        {aiSuggestions && !loading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={'lightbulb'} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300">AI-Generated Nigerian Budget</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Optimized for Nigerian market conditions ({Math.round(aiSuggestions.confidence * 100)}% confidence)
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={'redo'} className='mr-1' /> Regenerate
                </button>
                <button
                  onClick={handleApplyBudget}
                  disabled={applying}
                  className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm font-medium hover:bg-green-200 transition disabled:opacity-50"
                >
                  {applying ? (
                    <>
                      <div className="animate-spin w-3 h-3 border border-green-600 border-t-transparent rounded-full inline-block mr-1"></div>
                      Applying...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={'check-circle'} className='mr-1' /> Apply Budget
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Nigerian Context Information */}
            {aiSuggestions.nigerianFactors && aiSuggestions.nigerianFactors.length > 0 && (
              <div className="ai-gradient-bg text-white rounded-lg p-4 mb-6 flex items-start">
                <div
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  className="bg-white bg-opacity-20 rounded-full p-2 mr-3"
                >
                  <FontAwesomeIcon icon={'info-circle'} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">🇳🇬 Nigerian Market Optimizations Applied</p>
                  <ul className="text-sm opacity-90 mt-1">
                    {aiSuggestions.nigerianFactors.map((factor, index) => (
                      <li key={index}>• {factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Enhanced Analysis Grid */}
            {budgetAnalysis && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Strengths */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                    <FontAwesomeIcon icon={'check-circle'} className="mr-2" />
                    Strengths
                  </h4>
                  <div className="space-y-2">
                    {budgetAnalysis.strengths.map((strength, index) => (
                      <p key={index} className="text-sm text-green-700 dark:text-green-300">
                        • {strength}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Improvements */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-600 mb-3 flex items-center">
                    <FontAwesomeIcon icon={'exclamation-triangle'} className="mr-2" />
                    Improvements
                  </h4>
                  <div className="space-y-2">
                    {budgetAnalysis.improvements.map((improvement, index) => (
                      <p key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                        • {improvement}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Nigerian Optimizations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
                    Nigerian Features
                  </h4>
                  <div className="space-y-2">
                    {budgetAnalysis.nigerianOptimizations.map((optimization, index) => (
                      <p key={index} className="text-sm text-blue-700 dark:text-blue-300">
                        • {optimization}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Budget Category Sliders */}
            <div className="space-y-6">
              {aiSuggestions.optimizations
                .sort((a, b) => a.priority - b.priority)
                .map((optimization, index) => {
                  const icon = getCategoryIcon(optimization.category);
                  const colors = getCategoryColors(optimization.category);
                  const currentValue = budgetValues[optimization.category] || optimization.suggestedBudget;
                  const minValue = Math.max(optimization.suggestedBudget * 0.5, 1000);
                  const maxValue = optimization.suggestedBudget * 1.5;
                  
                  return (
                    <BudgetCategoryCard
                      key={index}
                      icon={icon}
                      iconBgClass={colors.bg}
                      iconTextClass={colors.text}
                      categoryTitle={optimization.category}
                      categorySubtitle={optimization.reasoning}
                      crossedAmount={optimization.currentBudget > 0 ? formatCurrency(optimization.currentBudget) : undefined}
                      minValue={minValue}
                      maxValue={maxValue}
                      defaultValue={currentValue}
                      bottomTip={optimization.impact ? {
                        icon: 'info-circle',
                        text: optimization.impact,
                        className: 'text-indigo-500',
                      } : undefined}
                      onValueChange={(value) => handleValueChange(optimization.category, value)}
                    />
                  );
                })}
            </div>
          </div>
        )}

        {/* Budget Summary */}
        {aiSuggestions && !loading && (
          <div className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">Budget Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">Previous Total Budget</p>
                <h4 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                  {aiSuggestions.optimizations.reduce((sum, opt) => sum + opt.currentBudget, 0) > 0 
                    ? formatCurrency(aiSuggestions.optimizations.reduce((sum, opt) => sum + opt.currentBudget, 0))
                    : 'No Previous Budget'
                  }
                </h4>
              </div>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">AI-Adjusted Budget</p>
                <h4 className="text-xl font-bold text-indigo-600 dark:text-indigo-500">
                  {formatCurrency(calculateTotalBudget())}
                </h4>
              </div>
              <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-4">
                <p className="text-sm text-slate-500 dark:text-slate-300 mb-1">
                  {aiSuggestions.projectedSavings >= 0 ? 'Monthly Savings' : 'Additional Spending'}
                </p>
                <h4 className={`text-xl font-bold ${
                  aiSuggestions.projectedSavings >= 0 
                    ? 'text-green-600 dark:text-green-500' 
                    : 'text-red-600 dark:text-red-500'
                }`}>
                  {aiSuggestions.projectedSavings >= 0 ? '+' : ''}{formatCurrency(aiSuggestions.projectedSavings)}
                </h4>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={'info-circle'} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {aiSuggestions.projectedSavings >= 0 
                      ? `This Nigerian-optimized budget helps you save ${formatCurrency(aiSuggestions.projectedSavings)} monthly`
                      : 'This budget allocates more for essential Nigerian categories'
                    }
                  </p>
                  {budgetAnalysis && (
                    <p className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                      Budget health score: {budgetAnalysis.score}/100 • Nigerian market intelligence applied
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleApplyBudget}
                disabled={applying}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {applying ? 'Applying Nigerian Budget...' : 'Apply This Budget'}
              </button>
            </div>
          </div>
        )}
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default SmartBudgetAssistant;