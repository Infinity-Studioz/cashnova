// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLightbulb, faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons';
// import { GoalsService, CreateGoalRequest } from '@/services/goalsService';
// import { Goal } from '@/services/goalsService';

// const goalIcons = [
//   { file: 'beach.png', category: 'vacation' },
//   { file: 'car.png', category: 'car_purchase' },
//   { file: 'home.png', category: 'house_deposit' },
//   { file: 'wedding.png', category: 'wedding' },
//   { file: 'graduation-cap.png', category: 'school_fees' },
//   { file: 'emergency.png', category: 'emergency_fund' },
//   { file: 'gift.png', category: 'custom' },
//   { file: 'money-bag.png', category: 'business_capital' },
// ];

// interface NewGoalModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onGoalCreated: (goal: any) => void;
//   editGoal?: Goal
// }

// export default function NewGoalModal({ isOpen, onClose, onGoalCreated, editGoal }: NewGoalModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null);

//   const [goalName, setGoalName] = useState('');
//   const [selectedImage, setSelectedImage] = useState('emergency.png');
//   const [selectedCategory, setSelectedCategory] = useState<CreateGoalRequest['category']>('emergency_fund');
//   const [targetAmount, setTargetAmount] = useState('');
//   const [currentAmount, setCurrentAmount] = useState('');
//   const [goalDate, setGoalDate] = useState('');
//   const [priority, setPriority] = useState<CreateGoalRequest['priority']>('medium');
//   const [description, setDescription] = useState('');
//   const [aiSuggestion, setAiSuggestion] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [enableAutoSave, setEnableAutoSave] = useState(false);
//   const [autoSavePercentage, setAutoSavePercentage] = useState(5);

//   // Nigerian templates for quick setup
//   const [nigerianTemplates] = useState(GoalsService.getNigerianTemplates());

//   // Set default goal date 3 months from now
//   useEffect(() => {
//     if (isOpen) {
//       const defaultDate = new Date();
//       defaultDate.setMonth(defaultDate.getMonth() + 3);
//       setGoalDate(defaultDate.toISOString().split('T')[0]);
//     }
//   }, [isOpen]);

//   // Handle outside click
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
//         handleClose();
//       }
//     }

//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isOpen]);

//   // Enhanced AI suggestion with Nigerian context
//   useEffect(() => {
//     if (targetAmount && goalDate) {
//       const amount = parseFloat(targetAmount) || 0;
//       const targetDate = new Date(goalDate);
//       const currentDate = new Date();
//       const monthsToGoal = Math.max(1, (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
//       const monthlyAmount = amount / monthsToGoal;

//       // Nigerian salary cycle context
//       const isEndOfMonth = currentDate.getDate() >= 25;
//       const salaryAdvice = isEndOfMonth
//         ? "Perfect timing! Consider contributing now during salary season."
//         : "Plan to contribute around month-end when salaries are typically paid.";

//       let categoryAdvice = '';
//       if (selectedCategory === 'emergency_fund') {
//         categoryAdvice = "Emergency funds are crucial for Nigerian economic stability. ";
//       } else if (selectedCategory === 'school_fees') {
//         categoryAdvice = "School fees are due in January and September. ";
//       }

//       setAiSuggestion(
//         `${categoryAdvice}Save ₦${Math.round(monthlyAmount).toLocaleString()} monthly over ${Math.round(monthsToGoal)} months. ${salaryAdvice}`
//       );
//     }
//   }, [targetAmount, goalDate, selectedCategory]);

//   // Add this useEffect after the existing ones in NewGoalModal:
//   useEffect(() => {
//     if (isOpen && editGoal) {
//       // Pre-populate form for editing
//       setGoalName(editGoal.title);
//       setSelectedCategory(editGoal.category);
//       setTargetAmount(editGoal.targetAmount.toString());
//       setCurrentAmount(editGoal.currentAmount.toString());
//       setGoalDate(editGoal.deadline ? new Date(editGoal.deadline).toISOString().split('T')[0] : '');
//       setPriority(editGoal.priority);
//       setDescription(editGoal.description || '');
//       setEnableAutoSave(editGoal.autoSaveRules?.enabled || false);
//       setAutoSavePercentage(editGoal.autoSaveRules?.percentage || 5);

//       // Find matching icon
//       const matchingIcon = goalIcons.find(icon => icon.category === editGoal.category);
//       if (matchingIcon) {
//         setSelectedImage(matchingIcon.file);
//       }
//     }
//   }, [isOpen, editGoal]);

//   // Handle template selection
//   const applyTemplate = (template: any) => {
//     setGoalName(template.title);
//     setDescription(template.description);
//     setTargetAmount(template.defaultAmount.toString());
//     setSelectedCategory(template.category);
//     setPriority(template.priority);

//     // Find matching icon
//     const matchingIcon = goalIcons.find(icon => icon.category === template.category);
//     if (matchingIcon) {
//       setSelectedImage(matchingIcon.file);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (isSubmitting) return;

//     // Enhanced validation to match backend requirements
//     if (!goalName.trim()) {
//       alert('Goal name is required');
//       return;
//     }

//     if (!targetAmount || isNaN(parseFloat(targetAmount))) {
//       alert('Please enter a valid target amount');
//       return;
//     }

//     const targetAmountNum = parseFloat(targetAmount);
//     if (targetAmountNum < 1000) {
//       alert('Minimum goal amount is ₦1,000');
//       return;
//     }

//     if (!selectedCategory) {
//       alert('Please select a category');
//       return;
//     }

//     // Validate deadline if provided
//     if (goalDate) {
//       const deadlineDate = new Date(goalDate);
//       if (deadlineDate <= new Date()) {
//         alert('Deadline must be in the future');
//         return;
//       }
//     }

//     setIsSubmitting(true);

//     try {
//       if (editGoal) {
//         // Update existing goal
//         const updateData = {
//           title: goalName.trim(),
//           description: description.trim() || undefined,
//           targetAmount: targetAmountNum,
//           category: selectedCategory,
//           deadline: goalDate || undefined,
//           priority: priority || 'medium',
//           autoSaveRules: enableAutoSave ? {
//             enabled: true,
//             percentage: autoSavePercentage,
//             frequency: 'monthly' as const,
//             minTransactionAmount: 1000
//           } : undefined,
//         };

//         const response = await GoalsService.updateGoal(editGoal._id, updateData);
//         onGoalCreated(response);
//       } else {
//         // Create new goal
//         const goalData = {
//           title: goalName.trim(),
//           description: description.trim() || undefined,
//           targetAmount: targetAmountNum,
//           currentAmount: parseFloat(currentAmount) || 0,
//           category: selectedCategory,
//           deadline: goalDate || undefined,
//           priority: priority || 'medium',
//           autoSaveRules: enableAutoSave ? {
//             enabled: true,
//             percentage: autoSavePercentage,
//             frequency: 'monthly' as const,
//             minTransactionAmount: 1000
//           } : undefined,
//           nigerianContext: {
//             isSchoolFeesGoal: selectedCategory === 'school_fees',
//             isEmergencyFund: selectedCategory === 'emergency_fund',
//             isSalaryLinked: ['emergency_fund', 'school_fees', 'rent_advance'].includes(selectedCategory),
//             festiveSeasonBuffer: selectedCategory === 'emergency_fund'
//           }
//         };

//         const response = await GoalsService.createGoal(goalData);
//         onGoalCreated(response.goal);
//       }

//       handleClose();
//     } catch (error) {
//       console.error('Error with goal:', error);

//       if (error instanceof Error) {
//         if (error.message.includes('Validation')) {
//           alert(`Validation Error: ${error.message}`);
//         } else {
//           alert(error.message);
//         }
//       } else {
//         alert(`Failed to ${editGoal ? 'update' : 'create'} goal. Please try again.`);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     if (isSubmitting) return;
//     resetForm();
//     onClose();
//   };

//   const resetForm = () => {
//     setGoalName('');
//     setSelectedImage('emergency.png');
//     setSelectedCategory('emergency_fund');
//     setTargetAmount('');
//     setCurrentAmount('');
//     setPriority('medium');
//     setDescription('');
//     setAiSuggestion('');
//     setEnableAutoSave(false);
//     setAutoSavePercentage(5);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 visible opacity-100 backdrop-blur-sm">
//       <div
//         ref={modalRef}
//         className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
//       >
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
//               {editGoal ? 'Edit Goal' : 'Create New Goal'}
//             </h3>
//             <button
//               onClick={handleClose}
//               disabled={isSubmitting}
//               className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400 disabled:opacity-50"
//             >
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//           </div>

//           {/* Nigerian Templates */}
//           <div className="mb-6">
//             <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
//               Quick Start Templates
//             </h4>
//             <div className="grid grid-cols-2 gap-2">
//               {nigerianTemplates.slice(0, 4).map((template) => (
//                 <button
//                   key={template.category}
//                   type="button"
//                   onClick={() => applyTemplate(template)}
//                   className="text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
//                 >
//                   <div className="font-medium text-sm text-gray-900 dark:text-gray-200">
//                     {template.title}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     ₦{template.defaultAmount.toLocaleString()}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Left Column */}
//               <div className="space-y-4">
//                 {/* Goal Name */}
//                 <div>
//                   <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Goal Name *
//                   </label>
//                   <input
//                     type="text"
//                     id="goalName"
//                     value={goalName}
//                     onChange={(e) => setGoalName(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="e.g. Emergency Fund, School Fees"
//                     required
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Category *
//                   </label>
//                   <select
//                     id="category"
//                     value={selectedCategory}
//                     onChange={(e) => setSelectedCategory(e.target.value as CreateGoalRequest['category'])}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                     required
//                   >
//                     <option value="emergency_fund">Emergency Fund</option>
//                     <option value="school_fees">School Fees</option>
//                     <option value="rent_advance">Rent Advance</option>
//                     <option value="vacation">Vacation</option>
//                     <option value="wedding">Wedding</option>
//                     <option value="business_capital">Business Capital</option>
//                     <option value="gadget_purchase">Gadget Purchase</option>
//                     <option value="house_deposit">House Deposit</option>
//                     <option value="car_purchase">Car Purchase</option>
//                     <option value="medical_emergency">Medical Emergency</option>
//                     <option value="custom">Custom</option>
//                   </select>
//                 </div>

//                 {/* Target Amount */}
//                 <div>
//                   <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Target Amount (₦) *
//                   </label>
//                   <input
//                     type="number"
//                     id="targetAmount"
//                     value={targetAmount}
//                     onChange={(e) => setTargetAmount(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="100,000"
//                     min="1000"
//                     required
//                   />
//                 </div>

//                 {/* Current Amount */}
//                 <div>
//                   <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Already Saved (₦)
//                   </label>
//                   <input
//                     type="number"
//                     id="currentAmount"
//                     value={currentAmount}
//                     onChange={(e) => setCurrentAmount(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="0"
//                     min="0"
//                   />
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-4">
//                 {/* Target Date */}
//                 <div>
//                   <label htmlFor="goalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Target Date
//                   </label>
//                   <input
//                     type="date"
//                     id="goalDate"
//                     value={goalDate}
//                     onChange={(e) => setGoalDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>

//                 {/* Priority */}
//                 <div>
//                   <label htmlFor="goalPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Priority
//                   </label>
//                   <select
//                     id="goalPriority"
//                     value={priority}
//                     onChange={(e) => setPriority(e.target.value as CreateGoalRequest['priority'])}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                     <option value="urgent">Urgent</option>
//                   </select>
//                 </div>

//                 {/* Auto-save Settings */}
//                 <div>
//                   <div className="flex items-center mb-2">
//                     <input
//                       type="checkbox"
//                       id="enableAutoSave"
//                       checked={enableAutoSave}
//                       onChange={(e) => setEnableAutoSave(e.target.checked)}
//                       className="mr-2"
//                     />
//                     <label htmlFor="enableAutoSave" className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       Enable Auto-Save
//                     </label>
//                   </div>
//                   {enableAutoSave && (
//                     <div>
//                       <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
//                         Auto-save percentage
//                       </label>
//                       <input
//                         type="number"
//                         value={autoSavePercentage}
//                         onChange={(e) => setAutoSavePercentage(Math.min(50, Math.max(0.1, parseFloat(e.target.value))))}
//                         className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                         min="0.1"
//                         max="50"
//                         step="0.1"
//                       />
//                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                         {autoSavePercentage}% of eligible transactions will be automatically saved
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Goal Image Selector */}
//             <div className="mt-6">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Goal Image</label>
//               <div className="grid grid-cols-4 gap-3">
//                 {goalIcons.map((icon) => (
//                   <Image
//                     key={icon.file}
//                     src={`/assets/icons/${icon.file}`}
//                     alt={icon.category}
//                     width={60}
//                     height={60}
//                     onClick={() => {
//                       setSelectedImage(icon.file);
//                       setSelectedCategory(icon.category as CreateGoalRequest['category']);
//                     }}
//                     className={`w-full h-16 object-contain p-2 rounded-lg border cursor-pointer transition-all ${selectedImage === icon.file
//                       ? 'border-primary ring-2 ring-primary bg-primary/5'
//                       : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
//                       }`}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Description */}
//             <div className="mt-6">
//               <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Description (Optional)
//               </label>
//               <textarea
//                 id="goalDescription"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Any additional details about your goal"
//                 maxLength={500}
//               />
//             </div>

//             {/* AI Suggestion */}
//             {aiSuggestion && (
//               <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
//                 <div className="flex items-start">
//                   <div className="flex-shrink-0 pt-1">
//                     <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-blue-800 dark:text-blue-200">{aiSuggestion}</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex justify-end space-x-3 mt-8">
//               <button
//                 type="button"
//                 onClick={handleClose}
//                 disabled={isSubmitting}
//                 className="px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//               >

//                 {isSubmitting ? (
//                   <>
//                     <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
//                     {editGoal ? 'Updating...' : 'Creating...'}
//                   </>
//                 ) : (
//                   editGoal ? 'Update Goal' : 'Create Goal'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/components/NewGoalModal.tsx - Enhanced with proper API integration
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faTimes, faSpinner, faRobot } from '@fortawesome/free-solid-svg-icons';
import { GoalsService, CreateGoalRequest } from '@/services/goalsService';
import { Goal } from '@/services/goalsService';
import { toast } from 'sonner';

const goalIcons = [
  { file: 'emergency.png', category: 'emergency_fund', label: 'Emergency Fund' },
  { file: 'graduation-cap.png', category: 'school_fees', label: 'School Fees' },
  { file: 'home.png', category: 'rent_advance', label: 'Rent Advance' },
  { file: 'beach.png', category: 'vacation', label: 'Vacation' },
  { file: 'wedding.png', category: 'wedding', label: 'Wedding' },
  { file: 'money-bag.png', category: 'business_capital', label: 'Business' },
  { file: 'gift.png', category: 'gadget_purchase', label: 'Gadget' },
  { file: 'car.png', category: 'car_purchase', label: 'Car' },
];

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: (goal: Goal) => void;
  editGoal?: Goal;
}

export default function NewGoalModal({ isOpen, onClose, onGoalCreated, editGoal }: NewGoalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    category: 'emergency_fund' as CreateGoalRequest['category'],
    deadline: '',
    priority: 'medium' as CreateGoalRequest['priority'],
    enableAutoSave: false,
    autoSavePercentage: 5
  });

  const [selectedIcon, setSelectedIcon] = useState('emergency.png');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Load Nigerian templates on mount
  useEffect(() => {
    if (isOpen) {
      loadNigerianTemplates();
      
      // Set default deadline to 3 months from now
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 3);
      setFormData(prev => ({
        ...prev,
        deadline: defaultDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  // Populate form for editing
  useEffect(() => {
    if (isOpen && editGoal) {
      setFormData({
        title: editGoal.title,
        description: editGoal.description || '',
        targetAmount: editGoal.targetAmount.toString(),
        currentAmount: editGoal.currentAmount.toString(),
        category: editGoal.category,
        deadline: editGoal.deadline ? new Date(editGoal.deadline).toISOString().split('T')[0] : '',
        priority: editGoal.priority,
        enableAutoSave: editGoal.autoSaveRules?.enabled || false,
        autoSavePercentage: editGoal.autoSaveRules?.percentage || 5
      });

      // Find matching icon
      const matchingIcon = goalIcons.find(icon => icon.category === editGoal.category);
      if (matchingIcon) {
        setSelectedIcon(matchingIcon.file);
      }
    } else if (isOpen && !editGoal) {
      // Reset form for new goal
      resetForm();
    }
  }, [isOpen, editGoal]);

  // Generate AI suggestions based on form data
  useEffect(() => {
    if (formData.targetAmount && formData.deadline) {
      generateAISuggestion();
    }
  }, [formData.targetAmount, formData.deadline, formData.category]);

  // Handle click outside modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!isSubmitting) {
          handleClose();
        }
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isSubmitting]);

  const loadNigerianTemplates = async () => {
    try {
      setLoadingTemplates(true);
      // Use the static templates for now - you can enhance this to call /api/goals/templates
      const nigerianTemplates = GoalsService.getNigerianTemplates();
      setTemplates(nigerianTemplates.slice(0, 4)); // Show top 4 templates
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Failed to load goal templates');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const generateAISuggestion = () => {
    const amount = parseFloat(formData.targetAmount) || 0;
    const targetDate = new Date(formData.deadline);
    const currentDate = new Date();
    const monthsToGoal = Math.max(1, (targetDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    const monthlyAmount = amount / monthsToGoal;

    // Nigerian salary cycle context
    const isEndOfMonth = currentDate.getDate() >= 25;
    const salaryAdvice = isEndOfMonth
      ? "Perfect timing! Consider contributing now during salary season."
      : "Plan to contribute around month-end when salaries are typically paid.";

    let categoryAdvice = '';
    switch (formData.category) {
      case 'emergency_fund':
        categoryAdvice = "Emergency funds are crucial for Nigerian economic stability. ";
        break;
      case 'school_fees':
        categoryAdvice = "School fees are due in January and September. ";
        break;
      case 'rent_advance':
        categoryAdvice = "Many Nigerian landlords require annual rent payments. ";
        break;
      default:
        categoryAdvice = "This is a great financial goal for building wealth. ";
    }

    setAiSuggestion(
      `${categoryAdvice}Save ₦${Math.round(monthlyAmount).toLocaleString()} monthly over ${Math.round(monthsToGoal)} months. ${salaryAdvice}`
    );
  };

  const applyTemplate = (template: any) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      targetAmount: template.targetAmount.toString(),
      category: template.category,
      priority: template.priority
    }));

    // Find matching icon
    const matchingIcon = goalIcons.find(icon => icon.category === template.category);
    if (matchingIcon) {
      setSelectedIcon(matchingIcon.file);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleIconSelect = (icon: typeof goalIcons[0]) => {
    setSelectedIcon(icon.file);
    setFormData(prev => ({
      ...prev,
      category: icon.category as CreateGoalRequest['category']
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Goal name is required';
    if (!formData.targetAmount || isNaN(parseFloat(formData.targetAmount))) return 'Please enter a valid target amount';
    
    const targetAmountNum = parseFloat(formData.targetAmount);
    if (targetAmountNum < 1000) return 'Minimum goal amount is ₦1,000';
    
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) return 'Deadline must be in the future';
    }

    const currentAmountNum = parseFloat(formData.currentAmount) || 0;
    if (currentAmountNum >= targetAmountNum) return 'Current amount cannot be greater than or equal to target amount';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const goalData: CreateGoalRequest = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        category: formData.category,
        deadline: formData.deadline || undefined,
        priority: formData.priority || 'medium',
        autoSaveRules: formData.enableAutoSave ? {
          enabled: true,
          percentage: formData.autoSavePercentage,
          frequency: 'monthly' as const,
          minTransactionAmount: 1000
        } : undefined,
        nigerianContext: {
          isSchoolFeesGoal: formData.category === 'school_fees',
          isEmergencyFund: formData.category === 'emergency_fund',
          isSalaryLinked: ['emergency_fund', 'school_fees', 'rent_advance'].includes(formData.category),
          festiveSeasonBuffer: formData.category === 'emergency_fund'
        }
      };

      if (editGoal) {
        // Update existing goal
        const updatedGoal = await GoalsService.updateGoal(editGoal._id, goalData);
        onGoalCreated(updatedGoal);
        toast.success('Goal updated successfully!');
      } else {
        // Create new goal
        const response = await GoalsService.createGoal(goalData);
        onGoalCreated(response.goal);
        toast.success(response.message);
        
        // Show AI insights
        if (response.insights && response.insights.length > 0) {
          response.insights.forEach(insight => {
            toast.info(insight.message, { duration: 5000 });
          });
        }
      }

      handleClose();
    } catch (error) {
      console.error('Error saving goal:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save goal';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      category: 'emergency_fund',
      deadline: '',
      priority: 'medium',
      enableAutoSave: false,
      autoSavePercentage: 5
    });
    setSelectedIcon('emergency.png');
    setAiSuggestion('');
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 visible opacity-100 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
              {editGoal ? 'Edit Goal' : 'Create New Goal'}
            </h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Nigerian Templates */}
          {!editGoal && templates.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                <FontAwesomeIcon icon={faRobot} className="mr-2 text-primary" />
                Quick Start Templates
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.category}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className="text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                  >
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-200">
                      {template.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ₦{template.targetAmount.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Goal Name *
                  </label>
                  <input
                    type="text"
                    id="goalName"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Emergency Fund, School Fees"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange('category')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="emergency_fund">Emergency Fund</option>
                    <option value="school_fees">School Fees</option>
                    <option value="rent_advance">Rent Advance</option>
                    <option value="vacation">Vacation</option>
                    <option value="wedding">Wedding</option>
                    <option value="business_capital">Business Capital</option>
                    <option value="gadget_purchase">Gadget Purchase</option>
                    <option value="house_deposit">House Deposit</option>
                    <option value="car_purchase">Car Purchase</option>
                    <option value="medical_emergency">Medical Emergency</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Amount (₦) *
                  </label>
                  <input
                    type="number"
                    id="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleInputChange('targetAmount')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="100,000"
                    min="1000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Already Saved (₦)
                  </label>
                  <input
                    type="number"
                    id="currentAmount"
                    value={formData.currentAmount}
                    onChange={handleInputChange('currentAmount')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="goalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    id="goalDate"
                    value={formData.deadline}
                    onChange={handleInputChange('deadline')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="goalPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="goalPriority"
                    value={formData.priority}
                    onChange={handleInputChange('priority')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {/* Auto-save Settings */}
                <div>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="enableAutoSave"
                      checked={formData.enableAutoSave}
                      onChange={(e) => setFormData(prev => ({ ...prev, enableAutoSave: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="enableAutoSave" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Auto-Save
                    </label>
                  </div>
                  {formData.enableAutoSave && (
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Auto-save percentage
                      </label>
                      <input
                        type="number"
                        value={formData.autoSavePercentage}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          autoSavePercentage: Math.min(50, Math.max(0.1, parseFloat(e.target.value))) 
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        min="0.1"
                        max="50"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formData.autoSavePercentage}% of eligible transactions will be automatically saved
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Goal Image Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Goal Image</label>
              <div className="grid grid-cols-4 gap-3">
                {goalIcons.map((icon) => (
                  <div
                    key={icon.file}
                    onClick={() => handleIconSelect(icon)}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      selectedIcon === icon.file
                        ? 'border-primary ring-2 ring-primary bg-primary/5'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 flex items-center justify-center mb-1">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {icon.label.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                      {icon.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="goalDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="goalDescription"
                value={formData.description}
                onChange={handleInputChange('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Any additional details about your goal"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* AI Suggestion */}
            {aiSuggestion && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Nigerian Financial AI Suggestion
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{aiSuggestion}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loadingTemplates && (
              <div className="mt-4 flex items-center justify-center py-2">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2 text-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Loading Nigerian templates...</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.targetAmount}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    {editGoal ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editGoal ? 'Update Goal' : 'Create Goal'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}