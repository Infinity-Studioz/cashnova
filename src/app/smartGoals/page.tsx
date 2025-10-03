// src/app/smartGoals/page.tsx - Enhanced with API Integration
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot, faPlus, faEllipsisV, faHome, faUmbrellaBeach,
  faCar, faHeart, faGraduationCap, faCheckCircle, faExclamationCircle,
  faBolt, faGem, faInfoCircle, faSpinner, faSliders, faShieldAlt,
  faLightbulb, faFire, faTrophy, faCalendar, faChartLine,
  faBullseye, faStar, faWallet, faArrowUp, faArrowDown, faEquals
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import MainNavigation from '../components/MainNavigation';
import AuthButtons from '../components/AuthButtons';
import NewGoalModal from '../components/NewGoalModal';
import ContributeModal from '../components/ContributeModal';
import GoalDropdown from '../components/GoalDropdown';
import { useGoals } from '@/hooks/useGoals';
import { Goal } from '@/services/goalsService';
import { toast } from 'sonner';

// Enhanced interfaces for Nigerian market integration
interface NigerianGoalTemplate {
  category: string;
  title: string;
  description: string;
  targetAmount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  monthlyContribution: number;
  estimatedMonths: number;
  badge?: string;
  nigerianContext: {
    isSchoolFeesGoal: boolean;
    isEmergencyFund: boolean;
    isSalaryLinked: boolean;
    festiveSeasonBuffer: boolean;
  };
  insights: string[];
}

interface NigerianMarketInsights {
  currentMonth: number;
  isSchoolFeeSeason: boolean;
  isSalaryCycle: boolean;
  isFestiveSeason: boolean;
  economicTips: string[];
  urgentActions: string[];
  seasonalAdvice: string[];
}

interface AIGoalSuggestion {
  category: string;
  title: string;
  description: string;
  targetAmount: number;
  timeframe: string;
  badge: 'Recommended' | 'New' | 'Adjustment' | 'Urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reasons: string[];
  monthlyContribution: number;
  nigerianContext: {
    timing: string;
    economicFactor: string;
    culturalRelevance: string;
  };
}

const SmartGoalsPage = () => {
  // State management
  const [selectedFilter, setSelectedFilter] = useState("active");
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AIGoalSuggestion[]>([]);
  const [nigerianInsights, setNigerianInsights] = useState<NigerianMarketInsights | null>(null);
  const [templates, setTemplates] = useState<NigerianGoalTemplate[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const { data: session, status } = useSession();

  // Enhanced useGoals hook with error handling
  const {
    goals,
    summary,
    nigerianInsights: hookInsights,
    loading,
    error,
    createGoal,
    contributeToGoal,
    updateGoal,
    deleteGoal,
    refreshGoals,
    setFilter,
    filter
  } = useGoals(selectedFilter);

  // Nigerian market intelligence functions
  const generateNigerianMarketInsights = useCallback((): NigerianMarketInsights => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const dayOfMonth = currentDate.getDate();

    const isSchoolFeeSeason = [1, 9].includes(currentMonth); // January, September
    const isSalaryCycle = dayOfMonth >= 25 && dayOfMonth <= 31; // End of month
    const isFestiveSeason = [12, 1].includes(currentMonth); // December, January

    const economicTips: string[] = [];
    const urgentActions: string[] = [];
    const seasonalAdvice: string[] = [];

    // School fees season insights
    if (isSchoolFeeSeason) {
      economicTips.push("School fees are due - prioritize education savings goals");
      urgentActions.push("Create or increase school fees goal contributions");
      seasonalAdvice.push("Many schools offer early payment discounts");
    }

    // Salary cycle insights
    if (isSalaryCycle) {
      economicTips.push("End-of-month salary period - optimal time for goal contributions");
      urgentActions.push("Set up automatic transfers from salary account");
      seasonalAdvice.push("Nigerian salaries typically paid 25th-30th of month");
    }

    // Festive season insights
    if (isFestiveSeason) {
      economicTips.push("Festive season - maintain emergency funds for increased spending");
      urgentActions.push("Create festive budget goal to avoid overspending");
      seasonalAdvice.push("December bonuses are common - allocate wisely");
    }

    // Economic volatility insights
    economicTips.push("Build emergency fund for naira volatility protection");
    economicTips.push("Inflation is high - prioritize goals over cash savings");

    // Market-specific insights based on current economic conditions
    if (currentMonth >= 3 && currentMonth <= 5) {
      seasonalAdvice.push("Post-festive season - good time to rebuild savings");
    }

    if (currentMonth >= 6 && currentMonth <= 8) {
      seasonalAdvice.push("Mid-year financial review - adjust goals based on income");
    }

    return {
      currentMonth,
      isSchoolFeeSeason,
      isSalaryCycle,
      isFestiveSeason,
      economicTips,
      urgentActions,
      seasonalAdvice
    };
  }, []);

  // Generate AI suggestions based on user data and Nigerian context
  const generateAISuggestions = useCallback((userGoals: Goal[], userSummary: any): AIGoalSuggestion[] => {
    const suggestions: AIGoalSuggestion[] = [];
    const currentDate = new Date();
    const insights = generateNigerianMarketInsights();

    // Emergency fund suggestion (always priority in Nigeria)
    const hasEmergencyFund = userGoals.some(goal => goal.category === 'emergency_fund');
    const emergencyFund = userGoals.find(g => g.category === 'emergency_fund');
    if (!hasEmergencyFund || (emergencyFund && emergencyFund.progressPercentage < 50)) {
      suggestions.push({
        category: 'emergency_fund',
        title: 'Emergency Fund',
        description: '3-6 months expenses for economic stability',
        targetAmount: 600000,
        timeframe: '12 months',
        badge: 'Recommended',
        priority: 'urgent',
        reasons: [
          'Nigerian economic volatility requires emergency protection',
          'Inflation makes cash savings less effective over time',
          'Provides security against job market uncertainty'
        ],
        monthlyContribution: 50000,
        nigerianContext: {
          timing: insights.isSalaryCycle ? 'Perfect timing with salary cycle' : 'Start immediately',
          economicFactor: 'High inflation makes this urgent',
          culturalRelevance: 'Essential for family financial security'
        }
      });
    }

    // School fees suggestion (seasonal)
    if (insights.isSchoolFeeSeason && !userGoals.some(g => g.category === 'school_fees')) {
      suggestions.push({
        category: 'school_fees',
        title: 'School Fees Fund',
        description: 'Next term school fees preparation',
        targetAmount: 150000,
        timeframe: '4 months',
        badge: 'Urgent',
        priority: 'high',
        reasons: [
          'School fees season is active',
          'Avoid borrowing or financial stress',
          'Early payments often get discounts'
        ],
        monthlyContribution: 37500,
        nigerianContext: {
          timing: 'School fees season - urgent priority',
          economicFactor: 'Education costs rising with inflation',
          culturalRelevance: 'Education is top family priority'
        }
      });
    }

    // Vacation suggestion (if no leisure goals)
    const hasLeisureGoal = userGoals.some(g => ['vacation', 'entertainment'].includes(g.category));
    if (!hasLeisureGoal && userSummary?.averageProgress > 40) {
      suggestions.push({
        category: 'vacation',
        title: 'Nigerian Getaway',
        description: 'Explore Nigeria or international travel',
        targetAmount: 250000,
        timeframe: '8 months',
        badge: 'New',
        priority: 'medium',
        reasons: [
          'Reward your savings discipline',
          'Mental health and relaxation important',
          'Nigerian tourism destinations are beautiful'
        ],
        monthlyContribution: 31250,
        nigerianContext: {
          timing: 'Good progress on other goals allows this',
          economicFactor: 'Domestic travel more affordable',
          culturalRelevance: 'Family trips strengthen bonds'
        }
      });
    }

    // Business capital suggestion (entrepreneurship focus)
    if (!userGoals.some(g => g.category === 'business_capital') && userSummary?.totalSaved > 100000) {
      suggestions.push({
        category: 'business_capital',
        title: 'Business Investment',
        description: 'Start or expand your business',
        targetAmount: 500000,
        timeframe: '15 months',
        badge: 'Adjustment',
        priority: 'medium',
        reasons: [
          'Nigeria has growing entrepreneurship opportunities',
          'Multiple income streams provide security',
          'Your saving discipline shows business potential'
        ],
        monthlyContribution: 33333,
        nigerianContext: {
          timing: 'Your savings show readiness for investment',
          economicFactor: 'Business ownership hedges against inflation',
          culturalRelevance: 'Entrepreneurship is increasingly valued'
        }
      });
    }

    return suggestions;
  }, [generateNigerianMarketInsights]);

  // Load Nigerian goal templates
  const loadNigerianTemplates = useCallback(async () => {
    try {
      const response = await fetch('/api/goals/templates');
      const data = await response.json();

      if (data.success) {
        setTemplates(data.templates.map((template: any) => ({
          ...template,
          insights: data.nigerianInsights || []
        })));
      }
    } catch (error) {
      console.error('Error loading Nigerian templates:', error);
      // Fallback to static templates
      setTemplates([
        {
          category: 'emergency_fund',
          title: 'Emergency Fund',
          description: '3 months expenses for economic stability',
          targetAmount: 150000,
          priority: 'urgent',
          monthlyContribution: 12500,
          estimatedMonths: 12,
          badge: 'Recommended',
          nigerianContext: {
            isEmergencyFund: true,
            isSalaryLinked: true,
            festiveSeasonBuffer: false,
            isSchoolFeesGoal: false
          },
          insights: ['Essential for Nigerian economic volatility', 'Protects against unexpected expenses']
        }
      ]);
    }
  }, []);

  // Effect hooks for initialization
  useEffect(() => {
    if (session?.user) {
      const insights = generateNigerianMarketInsights();
      setNigerianInsights(insights);
      loadNigerianTemplates();
    }
  }, [session, generateNigerianMarketInsights, loadNigerianTemplates]);

  // Generate AI suggestions when goals or summary changes
  useEffect(() => {
    if (goals.length > 0 || summary) {
      const suggestions = generateAISuggestions(goals, summary);
      setAiSuggestions(suggestions);
    }
  }, [goals, summary, generateAISuggestions]);

  // Update filter when selectedFilter changes
  useEffect(() => {
    setFilter(selectedFilter);
  }, [selectedFilter, setFilter]);

  // Loading and authentication checks
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary mb-4" />
          <p className="text-white">Loading your Nigerian financial goals...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faBullseye} className="text-primary text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-white">Smart Goals Await</h2>
          <p className="text-gray-400 mb-6">Sign in to start your Nigerian financial journey</p>
          <AuthButtons />
        </div>
      </div>
    );
  }

  // Event handlers
  const handleGoalCreated = async (goal: Goal) => {
    try {
      await refreshGoals();
      setIsNewGoalModalOpen(false);
      setIsEditModalOpen(false);
      toast.success('Goal created successfully! 🎯');
    } catch (error) {
      console.error('Error after goal creation:', error);
      toast.error('Goal created but failed to refresh list');
    }
  };

  const handleContributeClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsContributeModalOpen(true);
  };

  const handleContribute = async (amount: number, source: string, note?: string) => {
    if (!selectedGoal) return;

    try {
      const result = await contributeToGoal(selectedGoal._id, amount, source, note);

      // Show milestone achievements if any
      if (result.achievements?.milestones && result.achievements.milestones.length > 0) {
        result.achievements.milestones.forEach(milestone => {
          toast.success(`🏆 Milestone reached! ${milestone.percentage}% complete!`, {
            duration: 8000
          });
        });
      }

      // Show completion celebration
      if (result.achievements?.completed) {
        toast.success(`🎉 Goal "${selectedGoal.title}" completed! Amazing work!`, {
          duration: 10000
        });
      }

      await refreshGoals();
    } catch (error) {
      console.error('Contribution error:', error);
    }
  };

  const handleCreateFromTemplate = async (template: NigerianGoalTemplate | AIGoalSuggestion) => {
    try {
      // Build the goal data exactly as your API expects
      const goalData = {
        title: template.title,
        description: template.description,
        targetAmount: Number(template.targetAmount), // Ensure it's a number
        currentAmount: 0, // Start with 0
        category: template.category as Goal['category'],
        priority: template.priority || 'medium',
        deadline: undefined, // Don't set deadline for templates initially
        autoSaveRules: {
          enabled: false,
          percentage: 5,
          frequency: 'monthly' as const,
          minTransactionAmount: 1000
        },
        nigerianContext: {
          isSchoolFeesGoal: template.category === 'school_fees',
          isEmergencyFund: template.category === 'emergency_fund',
          isSalaryLinked: ['emergency_fund', 'school_fees', 'rent_advance'].includes(template.category),
          festiveSeasonBuffer: template.category === 'emergency_fund'
        }
      };

      console.log('Creating goal with data:', goalData); // Debug log

      const result = await createGoal(goalData);
      console.log('Goal creation result:', result); // Debug log

      await refreshGoals();

      // Show Nigerian context message
      if (nigerianInsights) {
        if (nigerianInsights.isSchoolFeeSeason && template.category === 'school_fees') {
          toast.info('Perfect timing! School fees season is active');
        }
        if (nigerianInsights.isSalaryCycle) {
          toast.info('Great choice during salary period!');
        }
      }
    } catch (error) {
      console.error('Error creating goal from template:', error);

      // More detailed error handling
      if (error instanceof Error) {
        toast.error(`Failed to create goal: ${error.message}`);
      } else {
        toast.error('Failed to create goal from template');
      }
    }
  };

  const handleEditClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (goal: Goal) => {
    const confirmMessage = goal.currentAmount > 0
      ? `Are you sure you want to delete "${goal.title}"? You have ${goal.formattedCurrentAmount} saved that will be lost.`
      : `Are you sure you want to delete "${goal.title}"? This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      try {
        await deleteGoal(goal._id);
        await refreshGoals();
        toast.success('Goal deleted successfully');
      } catch (error) {
        console.error('Failed to delete goal:', error);
        toast.error('Failed to delete goal');
      }
    }
  };

  const handleToggleActive = async (goal: Goal) => {
    try {
      await updateGoal(goal._id, { isActive: !goal.isActive });
      await refreshGoals();
      toast.success(goal.isActive ? 'Goal paused' : 'Goal resumed');
    } catch (error) {
      console.error('Failed to update goal status:', error);
      toast.error('Failed to update goal status');
    }
  };

  const handleShareGoal = (goal: Goal) => {
    const shareText = `I'm saving ${goal.formattedTargetAmount} for my ${goal.title}! Currently ${goal.progressPercentage.toFixed(1)}% complete with CashNova. 🎯`;

    if (navigator.share) {
      navigator.share({
        title: `My ${goal.title} Goal`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Goal details copied to clipboard!');
    }
  };

  // Utility functions
  const getGoalIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      house_deposit: faHome,
      vacation: faUmbrellaBeach,
      car_purchase: faCar,
      wedding: faHeart,
      school_fees: faGraduationCap,
      emergency_fund: faShieldAlt,
      business_capital: faGem,
      rent_advance: faHome,
      gadget_purchase: faBolt,
      medical_emergency: faExclamationCircle,
      custom: faBullseye
    };
    return iconMap[category] || faBullseye;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    const colorMap: { [key: string]: string } = {
      urgent: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    };
    return colorMap[priority] || 'text-gray-500';
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      emergency_fund: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
      school_fees: { bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' },
      vacation: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400' },
      car_purchase: { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' },
      wedding: { bg: 'bg-pink-100 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400' },
      business_capital: { bg: 'bg-indigo-100 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
      house_deposit: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400' },
      rent_advance: { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400' },
      gadget_purchase: { bg: 'bg-gray-100 dark:bg-gray-700/20', text: 'text-gray-600 dark:text-gray-400' },
      medical_emergency: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' },
      custom: { bg: 'bg-gray-100 dark:bg-gray-700/20', text: 'text-gray-600 dark:text-gray-400' }
    };
    return colorMap[category] || { bg: 'bg-gray-100 dark:bg-gray-700/20', text: 'text-gray-600 dark:text-gray-400' };
  };

  const getTimeStatusIcon = (timeStatus: string, daysUntilDeadline: number | null) => {
    if (!daysUntilDeadline) return null;

    switch (timeStatus) {
      case 'overdue':
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />;
      case 'urgent':
        return <FontAwesomeIcon icon={faFire} className="text-orange-500" />;
      case 'approaching':
        return <FontAwesomeIcon icon={faCalendar} className="text-yellow-500" />;
      default:
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
    }
  };

  const formatNaira = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount).replace('NGN', '₦');
  };

  const getGoalProgressTrend = (goal: Goal) => {
    if (!goal.recentActivity || goal.recentActivity === 0) {
      return { icon: faEquals, color: 'text-gray-400', text: 'No recent activity' };
    }

    const hasRecentContributions = goal.contributions?.some(
      c => new Date(c.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    if (hasRecentContributions) {
      return { icon: faArrowUp, color: 'text-green-500', text: 'Growing' };
    }

    return { icon: faArrowDown, color: 'text-red-500', text: 'Stagnant' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <MainNavigation />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Enhanced Header with Nigerian Context */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center transition-colors">
              <FontAwesomeIcon icon={faBullseye} className="text-primary mr-3" />
              Smart Goals
              {nigerianInsights?.isSchoolFeeSeason && (
                <span className="ml-3 text-xs bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full transition-colors">
                  School Fees Season
                </span>
              )}
              {nigerianInsights?.isSalaryCycle && (
                <span className="ml-2 text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full transition-colors">
                  Salary Period
                </span>
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
              Create and track personalized savings goals with Nigerian market intelligence
            </p>
            {summary && (
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-500 transition-colors">
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faBullseye} className="mr-1" />
                  {summary.active} active goals
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faWallet} className="mr-1" />
                  {summary.formattedTotalSaved} saved
                </span>
                <span className="flex items-center">
                  <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                  {summary.averageProgress.toFixed(1)}% avg progress
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <Link href="/budget-planner/screen-1">
              <button className="text-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-primary dark:border-primary px-4 py-2 rounded-lg flex items-center transition-colors">
                <FontAwesomeIcon icon={faRobot} className="text-primary mr-2" />
                AI Budget Assistant
              </button>
            </Link>
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Goal
            </button>
          </div>
        </div>

        {/* Nigerian Market Intelligence Panel */}
        {nigerianInsights && (nigerianInsights.economicTips.length > 0 || nigerianInsights.urgentActions.length > 0) && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-500/30 rounded-lg p-6 mb-6 transition-colors">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center transition-colors">
                  <FontAwesomeIcon icon={faLightbulb} className="text-purple-600 dark:text-purple-400 transition-colors" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-purple-900 dark:text-purple-200 flex items-center transition-colors">
                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                  Nigerian Market Intelligence
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300/80 mb-4 transition-colors">
                  Real-time insights for your financial goals based on Nigerian economic patterns
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nigerianInsights.economicTips.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center transition-colors">
                        <FontAwesomeIcon icon={faBolt} className="mr-1" />
                        Economic Insights
                      </h4>
                      <div className="space-y-2">
                        {nigerianInsights.economicTips.slice(0, 3).map((tip, index) => (
                          <p key={index} className="text-xs text-purple-700 dark:text-purple-300/90 flex items-start transition-colors">
                            <span className="text-purple-500 dark:text-purple-400 mr-2">•</span>
                            {tip}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {nigerianInsights.urgentActions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2 flex items-center transition-colors">
                        <FontAwesomeIcon icon={faFire} className="mr-1" />
                        Recommended Actions
                      </h4>
                      <div className="space-y-2">
                        {nigerianInsights.urgentActions.slice(0, 3).map((action, index) => (
                          <div key={index} className="text-xs text-purple-700 dark:text-purple-300/90 flex items-start transition-colors">
                            <span className="text-orange-500 dark:text-orange-400 mr-2">→</span>
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {nigerianInsights.seasonalAdvice.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-md border border-blue-200 dark:border-blue-500/20 transition-colors">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2 transition-colors">Seasonal Context</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300/90 transition-colors">
                      {nigerianInsights.seasonalAdvice[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Goal Suggestions Section */}
        {aiSuggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center transition-colors">
                  <FontAwesomeIcon icon={faRobot} className="text-green-600 dark:text-green-400 transition-colors" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center transition-colors">
                  <FontAwesomeIcon icon={faStar} className="text-yellow-500 dark:text-yellow-400 mr-2" />
                  AI Goal Recommendations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
                  Personalized suggestions based on Nigerian financial patterns and your progress
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-primary/50 dark:hover:border-primary/50 transition-colors bg-white dark:bg-gray-700/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white flex items-center transition-colors">
                            <FontAwesomeIcon icon={getGoalIcon(suggestion.category)} className="mr-2 text-sm text-gray-600 dark:text-gray-400" />
                            {suggestion.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                            {suggestion.description}
                          </p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${suggestion.badge === 'Recommended' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                            suggestion.badge === 'Urgent' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' :
                              suggestion.badge === 'New' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
                                'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                          }`}>
                          {suggestion.badge}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 transition-colors">Target:</span>
                          <span className="font-medium text-gray-900 dark:text-white transition-colors">{formatNaira(suggestion.targetAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 transition-colors">Timeframe:</span>
                          <span className="font-medium text-gray-900 dark:text-white transition-colors">{suggestion.timeframe}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 transition-colors">Monthly:</span>
                          <span className="font-medium text-gray-900 dark:text-white transition-colors">{formatNaira(suggestion.monthlyContribution)}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">Why This Goal?</h5>
                        <div className="space-y-1">
                          {suggestion.reasons.slice(0, 2).map((reason, idx) => (
                            <p key={idx} className="text-xs text-gray-600 dark:text-gray-400 transition-colors">• {reason}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleCreateFromTemplate(suggestion)}
                          className="flex-1 text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark transition-colors"
                        >
                          Create Goal
                        </button>
                        <button
                          onClick={() => setIsNewGoalModalOpen(true)}
                          className="text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Filter and Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center transition-colors">
                <FontAwesomeIcon icon={faBullseye} className="mr-2 text-primary" />
                Your Goals
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                Track your progress towards financial milestones with Nigerian market intelligence
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 transition-colors">
                {[
                  { value: 'all', label: 'All', icon: faBullseye },
                  { value: 'active', label: 'Active', icon: faFire },
                  { value: 'completed', label: 'Done', icon: faTrophy },
                  { value: 'behind_schedule', label: 'Behind', icon: faExclamationCircle }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${selectedFilter === filter.value
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    <FontAwesomeIcon icon={filter.icon} className="mr-1" />
                    {filter.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => refreshGoals()}
                disabled={loading}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faSliders}
                  className={loading ? 'animate-pulse' : ''}
                />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">{summary.total}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors">Total Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 transition-colors">{summary.active}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors">{summary.completed}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors">{summary.averageProgress.toFixed(0)}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors">Avg Progress</div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary mb-4" />
              <p className="text-gray-600 dark:text-gray-400 transition-colors">Loading your financial goals...</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 transition-colors">Analyzing Nigerian market conditions</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4 mb-6 transition-colors">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 dark:text-red-400 mr-3 transition-colors" />
              <div>
                <h3 className="text-red-700 dark:text-red-400 font-medium transition-colors">Error Loading Goals</h3>
                <p className="text-red-600 dark:text-red-300/80 text-sm mt-1 transition-colors">{error}</p>
                <button
                  onClick={() => refreshGoals()}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 underline hover:text-red-500 dark:hover:text-red-300 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nigerian Context Insights for Empty/Filtered States */}
        {!loading && !error && goals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4 transition-colors">
              <FontAwesomeIcon icon={faBullseye} className="text-2xl text-gray-400 dark:text-gray-500 transition-colors" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">
              {selectedFilter === 'completed'
                ? "No completed goals yet"
                : selectedFilter === 'behind_schedule'
                  ? "No goals behind schedule"
                  : selectedFilter === 'active'
                    ? "No active goals found"
                    : "No goals created yet"
              }
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto transition-colors">
              {selectedFilter === 'completed'
                ? "Keep working towards your active goals! Every contribution brings you closer to success."
                : selectedFilter === 'behind_schedule'
                  ? "Excellent! All your goals are on track. Your Nigerian financial discipline is showing!"
                  : selectedFilter === 'active'
                    ? "Create your first goal to start your Nigerian financial journey with smart, culturally-aware planning."
                    : "Start your financial journey with goals designed for Nigerian economic conditions."
              }
            </p>

            {/* Nigerian Context Tips for Empty States */}
            {nigerianInsights && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 max-w-md mx-auto transition-colors">
                <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 transition-colors">Nigerian Financial Tip</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                  {nigerianInsights.isSchoolFeeSeason
                    ? "School fees season is active - consider creating an education savings goal"
                    : nigerianInsights.isSalaryCycle
                      ? "End of month salary period - perfect time to set up automatic goal contributions"
                      : nigerianInsights.isFestiveSeason
                        ? "Festive season - create goals to manage increased spending and maintain savings discipline"
                        : "Emergency funds are crucial in Nigeria's economic environment - start with a 3-month expense goal"
                  }
                </p>
              </div>
            )}

            {(selectedFilter === 'all' || selectedFilter === 'active') && (
              <div className="space-y-3">
                <button
                  onClick={() => setIsNewGoalModalOpen(true)}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Your First Goal
                </button>

                {templates.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2 transition-colors">Or choose a Nigerian template:</p>
                    <div className="flex justify-center space-x-2">
                      {templates.slice(0, 3).map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleCreateFromTemplate(template)}
                          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md transition-colors"
                        >
                          {template.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Goals Grid */}
        {!loading && !error && goals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const categoryColor = getCategoryColor(goal.category);
              const progressTrend = getGoalProgressTrend(goal);

              return (
                <div
                  key={goal._id}
                  className="goal-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-visible border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-xl"
                >
                  <div className="p-4">
                    {/* Goal Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center flex-1">
                        <div className={`w-12 h-12 rounded-lg ${categoryColor.bg} flex items-center justify-center transition-colors`}>
                          <FontAwesomeIcon
                            icon={getGoalIcon(goal.category)}
                            className={`${categoryColor.text} text-lg transition-colors`}
                          />
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm leading-tight transition-colors">
                            {goal.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 ${getPriorityColor(goal.priority)} transition-colors`}>
                              {goal.priority}
                            </span>
                            {goal.deadline && (
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 transition-colors">
                                {getTimeStatusIcon(goal.timeStatus, goal.daysUntilDeadline ?? null)}
                                <span className="ml-1">
                                  {goal.daysUntilDeadline !== null && goal.daysUntilDeadline !== undefined
                                    ? goal.daysUntilDeadline >= 0
                                      ? `${goal.daysUntilDeadline}d left`
                                      : `${Math.abs(goal.daysUntilDeadline)}d overdue`
                                    : 'No deadline'
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400 transition-colors">
                          <FontAwesomeIcon icon={progressTrend.icon} className={`${progressTrend.color} mr-1`} />
                          {progressTrend.text}
                        </div>
                        <GoalDropdown
                          goal={goal}
                          onEdit={handleEditClick as any}
                          onContribute={handleContributeClick as any}
                          onDelete={handleDeleteClick as any}
                          onToggleActive={handleToggleActive as any}
                          onShare={handleShareGoal as any}
                        />
                      </div>
                    </div>

                    {/* Goal Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400 transition-colors">Progress:</span>
                        <span className="font-medium text-gray-900 dark:text-white transition-colors">
                          {goal.formattedCurrentAmount} of {goal.formattedTargetAmount}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2 transition-colors">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(goal.progressPercentage)}`}
                          style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                          {goal.progressPercentage.toFixed(1)}% complete
                        </span>
                        <span>
                          {formatNaira(goal.remainingAmount)} remaining
                        </span>
                      </div>
                    </div>

                    {/* Milestone Indicators */}
                    {goal.milestones && goal.milestones.length > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors">Milestones</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                            {goal.milestones.filter(m => m.achievedAt).length}/{goal.milestones.length}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {goal.milestones.map((milestone, idx) => (
                            <div
                              key={idx}
                              className={`flex-1 h-1.5 rounded-full transition-colors ${milestone.achievedAt
                                  ? 'bg-green-500'
                                  : goal.progressPercentage >= milestone.percentage
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                              title={`${milestone.percentage}% - ${formatNaira(milestone.amount)}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nigerian Context Insights */}
                    {goal.nigerianInsights && goal.nigerianInsights.length > 0 && (
                      <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3 transition-colors">
                        <div className="flex items-start">
                          <FontAwesomeIcon icon={faLightbulb} className="text-blue-600 dark:text-blue-400 text-sm mt-0.5 mr-2 flex-shrink-0 transition-colors" />
                          <div>
                            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed transition-colors">
                              {goal.nigerianInsights[0]}
                            </p>
                            {goal.nigerianInsights.length > 1 && (
                              <p className="text-xs text-blue-700 dark:text-blue-300/80 mt-1 transition-colors">
                                {goal.nigerianInsights[1]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Goal Status Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {goal.isCompleted && (
                          <span className="flex items-center text-xs bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full transition-colors">
                            <FontAwesomeIcon icon={faTrophy} className="mr-1" />
                            Completed
                          </span>
                        )}
                        {!goal.isActive && !goal.isCompleted && (
                          <span className="flex items-center text-xs bg-gray-200 dark:bg-gray-600/50 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full transition-colors">
                            Paused
                          </span>
                        )}
                        {goal.autoSaveRules?.enabled && (
                          <span className="flex items-center text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full transition-colors">
                            <FontAwesomeIcon icon={faRobot} className="mr-1" />
                            Auto-save
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        Created: {new Date(goal.createdAt).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Goal Actions Footer */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-600 transition-colors">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 transition-colors">
                      {goal.recentActivity > 0 && (
                        <span className="flex items-center mr-3">
                          <FontAwesomeIcon icon={faFire} className="text-orange-500 dark:text-orange-400 mr-1 transition-colors" />
                          {goal.recentActivity} recent
                        </span>
                      )}
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faCalendar} className="mr-1" />
                        {goal.contributions?.length || 0} contributions
                      </span>
                    </div>

                    <button
                      onClick={() => handleContributeClick(goal)}
                      disabled={goal.isCompleted}
                      className={`text-xs px-4 py-1.5 rounded-md font-medium transition-colors ${goal.isCompleted
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary-dark text-white'
                        }`}
                    >
                      {goal.isCompleted ? 'Completed' : 'Add Funds'}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add New Goal Card */}
            <div
              className="goal-card bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-lg overflow-visible border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary flex items-center justify-center min-h-[320px] cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/70"
              onClick={() => setIsNewGoalModalOpen(true)}
            >
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 dark:bg-primary/20 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <FontAwesomeIcon icon={faPlus} className="text-primary text-xl" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2 transition-colors">
                  Create New Goal
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors">
                  Start saving for your dreams with Nigerian market intelligence
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 transition-colors">
                  {nigerianInsights?.isSchoolFeeSeason && "Perfect timing for school fees goal!"}
                  {nigerianInsights?.isSalaryCycle && !nigerianInsights?.isSchoolFeeSeason && "End-of-month - great for goal setup"}
                  {!nigerianInsights?.isSchoolFeeSeason && !nigerianInsights?.isSalaryCycle && "Click to get started"}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => {
          setIsNewGoalModalOpen(false);
          setSelectedGoal(null);
        }}
        onGoalCreated={handleGoalCreated}
      />

      {/* Edit Modal - reusing NewGoalModal with editGoal prop */}
      {selectedGoal && (
        <NewGoalModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGoal(null);
          }}
          onGoalCreated={async (goal) => {
            await handleGoalCreated(goal);
            setSelectedGoal(null);
          }}
          editGoal={selectedGoal}
        />
      )}

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => {
          setIsContributeModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onContribute={handleContribute}
      />

      {/* Bottom padding for mobile navigation */}
      <div className="pb-20" />
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-gray-900">
  //     <MainNavigation />
  //     <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
  //       {/* Enhanced Header with Nigerian Context */}
  //       <div className="flex justify-between items-center mb-6">
  //         <div>
  //           <h2 className="text-2xl font-bold text-white flex items-center">
  //             <FontAwesomeIcon icon={faBullseye} className="text-primary mr-3" />
  //             Smart Goals
  //             {nigerianInsights?.isSchoolFeeSeason && (
  //               <span className="ml-3 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
  //                 School Fees Season
  //               </span>
  //             )}
  //             {nigerianInsights?.isSalaryCycle && (
  //               <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
  //                 Salary Period
  //               </span>
  //             )}
  //           </h2>
  //           <p className="text-gray-400 mt-1">
  //             Create and track personalized savings goals with Nigerian market intelligence
  //           </p>
  //           {summary && (
  //             <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
  //               <span className="flex items-center">
  //                 <FontAwesomeIcon icon={faBullseye} className="mr-1" />
  //                 {summary.active} active goals
  //               </span>
  //               <span className="flex items-center">
  //                 <FontAwesomeIcon icon={faWallet} className="mr-1" />
  //                 {summary.formattedTotalSaved} saved
  //               </span>
  //               <span className="flex items-center">
  //                 <FontAwesomeIcon icon={faChartLine} className="mr-1" />
  //                 {summary.averageProgress.toFixed(1)}% avg progress
  //               </span>
  //             </div>
  //           )}
  //         </div>

  //         <div className="flex space-x-3">
  //           <Link href="/budget-planner/screen-1">
  //             <button className="text-primary bg-gray-800 hover:bg-gray-700 border border-primary px-4 py-2 rounded-lg flex items-center transition-colors">
  //               <FontAwesomeIcon icon={faRobot} className="text-primary mr-2" />
  //               AI Budget Assistant
  //             </button>
  //           </Link>
  //           <button
  //             onClick={() => setIsNewGoalModalOpen(true)}
  //             className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center transition-colors"
  //           >
  //             <FontAwesomeIcon icon={faPlus} className="mr-2" />
  //             New Goal
  //           </button>
  //         </div>
  //       </div>

  //       {/* Nigerian Market Intelligence Panel */}
  //       {nigerianInsights && (nigerianInsights.economicTips.length > 0 || nigerianInsights.urgentActions.length > 0) && (
  //         <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6 mb-6">
  //           <div className="flex items-start">
  //             <div className="flex-shrink-0 pt-1">
  //               <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
  //                 <FontAwesomeIcon icon={faLightbulb} className="text-purple-400" />
  //               </div>
  //             </div>
  //             <div className="ml-4 flex-1">
  //               <h3 className="text-lg font-medium text-purple-200 flex items-center">
  //                 <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
  //                 Nigerian Market Intelligence
  //               </h3>
  //               <p className="text-sm text-purple-300/80 mb-4">
  //                 Real-time insights for your financial goals based on Nigerian economic patterns
  //               </p>

  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 {nigerianInsights.economicTips.length > 0 && (
  //                   <div>
  //                     <h4 className="text-sm font-medium text-purple-200 mb-2 flex items-center">
  //                       <FontAwesomeIcon icon={faBolt} className="mr-1" />
  //                       Economic Insights
  //                     </h4>
  //                     <div className="space-y-2">
  //                       {nigerianInsights.economicTips.slice(0, 3).map((tip, index) => (
  //                         <p key={index} className="text-xs text-purple-300/90 flex items-start">
  //                           <span className="text-purple-400 mr-2">•</span>
  //                           {tip}
  //                         </p>
  //                       ))}
  //                     </div>
  //                   </div>
  //                 )}

  //                 {nigerianInsights.urgentActions.length > 0 && (
  //                   <div>
  //                     <h4 className="text-sm font-medium text-purple-200 mb-2 flex items-center">
  //                       <FontAwesomeIcon icon={faFire} className="mr-1" />
  //                       Recommended Actions
  //                     </h4>
  //                     <div className="space-y-2">
  //                       {nigerianInsights.urgentActions.slice(0, 3).map((action, index) => (
  //                         <div key={index} className="text-xs text-purple-300/90 flex items-start">
  //                           <span className="text-orange-400 mr-2">→</span>
  //                           {action}
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>
  //                 )}
  //               </div>

  //               {nigerianInsights.seasonalAdvice.length > 0 && (
  //                 <div className="mt-4 p-3 bg-blue-900/30 rounded-md border border-blue-500/20">
  //                   <h4 className="text-sm font-medium text-blue-200 mb-2">Seasonal Context</h4>
  //                   <p className="text-xs text-blue-300/90">
  //                     {nigerianInsights.seasonalAdvice[0]}
  //                   </p>
  //                 </div>
  //               )}
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* AI Goal Suggestions Section */}
  //       {aiSuggestions.length > 0 && (
  //         <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6 border border-gray-700">
  //           <div className="flex items-start">
  //             <div className="flex-shrink-0 pt-1">
  //               <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
  //                 <FontAwesomeIcon icon={faRobot} className="text-green-400" />
  //               </div>
  //             </div>
  //             <div className="ml-4 flex-1">
  //               <h3 className="text-lg font-medium text-white flex items-center">
  //                 <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-2" />
  //                 AI Goal Recommendations
  //               </h3>
  //               <p className="text-sm text-gray-400 mb-4">
  //                 Personalized suggestions based on Nigerian financial patterns and your progress
  //               </p>

  //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //                 {aiSuggestions.map((suggestion, index) => (
  //                   <div key={index} className="border border-gray-600 rounded-lg p-4 hover:border-primary/50 transition-colors">
  //                     <div className="flex justify-between items-start mb-3">
  //                       <div>
  //                         <h4 className="font-medium text-white flex items-center">
  //                           <FontAwesomeIcon icon={getGoalIcon(suggestion.category)} className="mr-2 text-sm" />
  //                           {suggestion.title}
  //                         </h4>
  //                         <p className="text-xs text-gray-400 mt-1">
  //                           {suggestion.description}
  //                         </p>
  //                       </div>
  //                       <span className={`text-xs font-medium px-2 py-1 rounded-full ${suggestion.badge === 'Recommended' ? 'bg-green-500/20 text-green-400' :
  //                         suggestion.badge === 'Urgent' ? 'bg-red-500/20 text-red-400' :
  //                           suggestion.badge === 'New' ? 'bg-blue-500/20 text-blue-400' :
  //                             'bg-yellow-500/20 text-yellow-400'
  //                         }`}>
  //                         {suggestion.badge}
  //                       </span>
  //                     </div>

  //                     <div className="space-y-2 mb-4">
  //                       <div className="flex justify-between text-sm">
  //                         <span className="text-gray-400">Target:</span>
  //                         <span className="font-medium text-white">{formatNaira(suggestion.targetAmount)}</span>
  //                       </div>
  //                       <div className="flex justify-between text-sm">
  //                         <span className="text-gray-400">Timeframe:</span>
  //                         <span className="font-medium text-white">{suggestion.timeframe}</span>
  //                       </div>
  //                       <div className="flex justify-between text-sm">
  //                         <span className="text-gray-400">Monthly:</span>
  //                         <span className="font-medium text-white">{formatNaira(suggestion.monthlyContribution)}</span>
  //                       </div>
  //                     </div>

  //                     <div className="mb-4">
  //                       <h5 className="text-xs font-medium text-gray-300 mb-2">Why This Goal?</h5>
  //                       <div className="space-y-1">
  //                         {suggestion.reasons.slice(0, 2).map((reason, idx) => (
  //                           <p key={idx} className="text-xs text-gray-400">• {reason}</p>
  //                         ))}
  //                       </div>
  //                     </div>

  //                     <div className="flex space-x-2">
  //                       <button
  //                         onClick={() => handleCreateFromTemplate(suggestion)}
  //                         className="flex-1 text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark transition-colors"
  //                       >
  //                         Create Goal
  //                       </button>
  //                       <button
  //                         onClick={() => setIsNewGoalModalOpen(true)}
  //                         className="text-xs border border-gray-600 text-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
  //                       >
  //                         Customize
  //                       </button>
  //                     </div>
  //                   </div>
  //                 ))}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //       {/* Goals Filter and Management */}
  //       <div className="bg-gray-800 rounded-lg shadow-sm p-4 mb-6 border border-gray-700">
  //         <div className="flex flex-col md:flex-row md:items-center md:justify-between">
  //           <div className="mb-4 md:mb-0">
  //             <h3 className="text-lg font-medium text-white flex items-center">
  //               <FontAwesomeIcon icon={faBullseye} className="mr-2 text-primary" />
  //               Your Goals
  //             </h3>
  //             <p className="text-sm text-gray-400">
  //               Track your progress towards financial milestones with Nigerian market intelligence
  //             </p>
  //           </div>

  //           <div className="flex items-center space-x-3">
  //             <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
  //               {[
  //                 { value: 'all', label: 'All', icon: faBullseye },
  //                 { value: 'active', label: 'Active', icon: faFire },
  //                 { value: 'completed', label: 'Done', icon: faTrophy },
  //                 { value: 'behind_schedule', label: 'Behind', icon: faExclamationCircle }
  //               ].map(filter => (
  //                 <button
  //                   key={filter.value}
  //                   onClick={() => setSelectedFilter(filter.value)}
  //                   className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center ${selectedFilter === filter.value
  //                     ? 'bg-primary text-white'
  //                     : 'text-gray-400 hover:text-white hover:bg-gray-600'
  //                     }`}
  //                 >
  //                   <FontAwesomeIcon icon={filter.icon} className="mr-1" />
  //                   {filter.label}
  //                 </button>
  //               ))}
  //             </div>

  //             <button
  //               onClick={() => refreshGoals()}
  //               disabled={loading}
  //               className="border border-gray-600 text-gray-300 px-3 py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
  //             >
  //               <FontAwesomeIcon
  //                 icon={faSliders}
  //                 className={loading ? 'animate-pulse' : ''}
  //               />
  //             </button>
  //           </div>
  //         </div>

  //         {/* Quick Stats */}
  //         {summary && (
  //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
  //             <div className="text-center">
  //               <div className="text-2xl font-bold text-white">{summary.total}</div>
  //               <div className="text-xs text-gray-400">Total Goals</div>
  //             </div>
  //             <div className="text-center">
  //               <div className="text-2xl font-bold text-green-400">{summary.active}</div>
  //               <div className="text-xs text-gray-400">Active</div>
  //             </div>
  //             <div className="text-center">
  //               <div className="text-2xl font-bold text-blue-400">{summary.completed}</div>
  //               <div className="text-xs text-gray-400">Completed</div>
  //             </div>
  //             <div className="text-center">
  //               <div className="text-2xl font-bold text-purple-400">{summary.averageProgress.toFixed(0)}%</div>
  //               <div className="text-xs text-gray-400">Avg Progress</div>
  //             </div>
  //           </div>
  //         )}
  //       </div>

  //       {/* Loading State */}
  //       {loading && (
  //         <div className="flex items-center justify-center py-12">
  //           <div className="text-center">
  //             <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl text-primary mb-4" />
  //             <p className="text-gray-400">Loading your financial goals...</p>
  //             <p className="text-xs text-gray-500 mt-1">Analyzing Nigerian market conditions</p>
  //           </div>
  //         </div>
  //       )}

  //       {/* Error State */}
  //       {error && (
  //         <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
  //           <div className="flex items-center">
  //             <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 mr-3" />
  //             <div>
  //               <h3 className="text-red-400 font-medium">Error Loading Goals</h3>
  //               <p className="text-red-300/80 text-sm mt-1">{error}</p>
  //               <button
  //                 onClick={() => refreshGoals()}
  //                 className="mt-2 text-sm text-red-400 underline hover:text-red-300"
  //               >
  //                 Try again
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* Nigerian Context Insights for Empty/Filtered States */}
  //       {!loading && !error && goals.length === 0 && (
  //         <div className="text-center py-12">
  //           <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
  //             <FontAwesomeIcon icon={faBullseye} className="text-2xl text-gray-400" />
  //           </div>
  //           <h3 className="text-lg font-medium text-white mb-2">
  //             {selectedFilter === 'completed'
  //               ? "No completed goals yet"
  //               : selectedFilter === 'behind_schedule'
  //                 ? "No goals behind schedule"
  //                 : selectedFilter === 'active'
  //                   ? "No active goals found"
  //                   : "No goals created yet"
  //             }
  //           </h3>

  //           <p className="text-gray-400 mb-4 max-w-md mx-auto">
  //             {selectedFilter === 'completed'
  //               ? "Keep working towards your active goals! Every contribution brings you closer to success."
  //               : selectedFilter === 'behind_schedule'
  //                 ? "Excellent! All your goals are on track. Your Nigerian financial discipline is showing!"
  //                 : selectedFilter === 'active'
  //                   ? "Create your first goal to start your Nigerian financial journey with smart, culturally-aware planning."
  //                   : "Start your financial journey with goals designed for Nigerian economic conditions."
  //             }
  //           </p>

  //           {/* Nigerian Context Tips for Empty States */}
  //           {nigerianInsights && (
  //             <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 max-w-md mx-auto">
  //               <h4 className="text-sm font-medium text-blue-400 mb-2">Nigerian Financial Tip</h4>
  //               <p className="text-xs text-gray-400">
  //                 {nigerianInsights.isSchoolFeeSeason
  //                   ? "School fees season is active - consider creating an education savings goal"
  //                   : nigerianInsights.isSalaryCycle
  //                     ? "End of month salary period - perfect time to set up automatic goal contributions"
  //                     : nigerianInsights.isFestiveSeason
  //                       ? "Festive season - create goals to manage increased spending and maintain savings discipline"
  //                       : "Emergency funds are crucial in Nigeria's economic environment - start with a 3-month expense goal"
  //                 }
  //               </p>
  //             </div>
  //           )}

  //           {(selectedFilter === 'all' || selectedFilter === 'active') && (
  //             <div className="space-y-3">
  //               <button
  //                 onClick={() => setIsNewGoalModalOpen(true)}
  //                 className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium"
  //               >
  //                 Create Your First Goal
  //               </button>

  //               {templates.length > 0 && (
  //                 <div>
  //                   <p className="text-xs text-gray-500 mb-2">Or choose a Nigerian template:</p>
  //                   <div className="flex justify-center space-x-2">
  //                     {templates.slice(0, 3).map((template, index) => (
  //                       <button
  //                         key={index}
  //                         onClick={() => handleCreateFromTemplate(template)}
  //                         className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md transition-colors"
  //                       >
  //                         {template.title}
  //                       </button>
  //                     ))}
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           )}
  //         </div>
  //       )}
  //       {/* Goals Grid */}
  //       {!loading && !error && goals.length > 0 && (
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {goals.map((goal) => {
  //             const categoryColor = getCategoryColor(goal.category);
  //             const progressTrend = getGoalProgressTrend(goal);

  //             return (
  //               <div
  //                 key={goal._id}
  //                 className="goal-card bg-gray-800 rounded-lg shadow-lg overflow-visible border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-xl"
  //               >
  //                 <div className="p-4">
  //                   {/* Goal Header */}
  //                   <div className="flex justify-between items-start mb-4">
  //                     <div className="flex items-center flex-1">
  //                       <div className={`w-12 h-12 rounded-lg ${categoryColor.bg} flex items-center justify-center`}>
  //                         <FontAwesomeIcon
  //                           icon={getGoalIcon(goal.category)}
  //                           className={`${categoryColor.text} text-lg`}
  //                         />
  //                       </div>
  //                       <div className="ml-3 flex-1">
  //                         <h3 className="font-medium text-white text-sm leading-tight">
  //                           {goal.title}
  //                         </h3>
  //                         <div className="flex items-center space-x-2 mt-1">
  //                           <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-700 ${getPriorityColor(goal.priority)}`}>
  //                             {goal.priority}
  //                           </span>
  //                           {goal.deadline && (
  //                             <div className="flex items-center text-xs text-gray-400">
  //                               {getTimeStatusIcon(goal.timeStatus, goal.daysUntilDeadline)}
  //                               <span className="ml-1">
  //                                 {goal.daysUntilDeadline !== null
  //                                   ? goal.daysUntilDeadline >= 0
  //                                     ? `${goal.daysUntilDeadline}d left`
  //                                     : `${Math.abs(goal.daysUntilDeadline)}d overdue`
  //                                   : 'No deadline'
  //                                 }
  //                               </span>
  //                             </div>
  //                           )}
  //                         </div>
  //                       </div>
  //                     </div>

  //                     <div className="flex items-center space-x-1">
  //                       <div className="text-right text-xs text-gray-400">
  //                         <FontAwesomeIcon icon={progressTrend.icon} className={`${progressTrend.color} mr-1`} />
  //                         {progressTrend.text}
  //                       </div>
  //                       <GoalDropdown
  //                         goal={goal}
  //                         onEdit={handleEditClick}
  //                         onContribute={handleContributeClick}
  //                         onDelete={handleDeleteClick}
  //                         onToggleActive={handleToggleActive}
  //                         onShare={handleShareGoal}
  //                       />
  //                     </div>
  //                   </div>

  //                   {/* Goal Progress */}
  //                   <div className="mb-4">
  //                     <div className="flex justify-between text-sm mb-2">
  //                       <span className="text-gray-400">Progress:</span>
  //                       <span className="font-medium text-white">
  //                         {goal.formattedCurrentAmount} of {goal.formattedTargetAmount}
  //                       </span>
  //                     </div>

  //                     <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
  //                       <div
  //                         className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(goal.progressPercentage)}`}
  //                         style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
  //                       />
  //                     </div>

  //                     <div className="flex justify-between text-xs text-gray-400">
  //                       <span className="flex items-center">
  //                         <FontAwesomeIcon icon={faChartLine} className="mr-1" />
  //                         {goal.progressPercentage.toFixed(1)}% complete
  //                       </span>
  //                       <span>
  //                         {formatNaira(goal.remainingAmount)} remaining
  //                       </span>
  //                     </div>
  //                   </div>

  //                   {/* Milestone Indicators */}
  //                   {goal.milestones && goal.milestones.length > 0 && (
  //                     <div className="mb-4">
  //                       <div className="flex justify-between items-center mb-2">
  //                         <span className="text-xs font-medium text-gray-300">Milestones</span>
  //                         <span className="text-xs text-gray-400">
  //                           {goal.milestones.filter(m => m.achievedAt).length}/{goal.milestones.length}
  //                         </span>
  //                       </div>
  //                       <div className="flex space-x-1">
  //                         {goal.milestones.map((milestone, idx) => (
  //                           <div
  //                             key={idx}
  //                             className={`flex-1 h-1.5 rounded-full ${milestone.achievedAt
  //                               ? 'bg-green-500'
  //                               : goal.progressPercentage >= milestone.percentage
  //                                 ? 'bg-yellow-500'
  //                                 : 'bg-gray-600'
  //                               }`}
  //                             title={`${milestone.percentage}% - ${formatNaira(milestone.amount)}`}
  //                           />
  //                         ))}
  //                       </div>
  //                     </div>
  //                   )}

  //                   {/* Nigerian Context Insights */}
  //                   {goal.nigerianInsights && goal.nigerianInsights.length > 0 && (
  //                     <div className="mb-4 bg-blue-900/20 border border-blue-500/20 rounded-lg p-3">
  //                       <div className="flex items-start">
  //                         <FontAwesomeIcon icon={faLightbulb} className="text-blue-400 text-sm mt-0.5 mr-2 flex-shrink-0" />
  //                         <div>
  //                           <p className="text-xs text-blue-300 leading-relaxed">
  //                             {goal.nigerianInsights[0]}
  //                           </p>
  //                           {goal.nigerianInsights.length > 1 && (
  //                             <p className="text-xs text-blue-300/80 mt-1">
  //                               {goal.nigerianInsights[1]}
  //                             </p>
  //                           )}
  //                         </div>
  //                       </div>
  //                     </div>
  //                   )}

  //                   {/* Goal Status Badges */}
  //                   <div className="flex items-center justify-between">
  //                     <div className="flex items-center space-x-2">
  //                       {goal.isCompleted && (
  //                         <span className="flex items-center text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
  //                           <FontAwesomeIcon icon={faTrophy} className="mr-1" />
  //                           Completed
  //                         </span>
  //                       )}
  //                       {!goal.isActive && !goal.isCompleted && (
  //                         <span className="flex items-center text-xs bg-gray-600/50 text-gray-400 px-2 py-1 rounded-full">
  //                           Paused
  //                         </span>
  //                       )}
  //                       {goal.autoSaveRules?.enabled && (
  //                         <span className="flex items-center text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
  //                           <FontAwesomeIcon icon={faRobot} className="mr-1" />
  //                           Auto-save
  //                         </span>
  //                       )}
  //                     </div>

  //                     <div className="text-xs text-gray-400">
  //                       Created: {new Date(goal.createdAt).toLocaleDateString('en-NG', {
  //                         month: 'short',
  //                         day: 'numeric'
  //                       })}
  //                     </div>
  //                   </div>
  //                 </div>

  //                 {/* Goal Actions Footer */}
  //                 <div className="bg-gray-700/50 px-4 py-3 flex justify-between items-center border-t border-gray-600">
  //                   <div className="flex items-center text-xs text-gray-400">
  //                     {goal.recentActivity > 0 && (
  //                       <span className="flex items-center mr-3">
  //                         <FontAwesomeIcon icon={faFire} className="text-orange-400 mr-1" />
  //                         {goal.recentActivity} recent
  //                       </span>
  //                     )}
  //                     <span className="flex items-center">
  //                       <FontAwesomeIcon icon={faCalendar} className="mr-1" />
  //                       {goal.contributions?.length || 0} contributions
  //                     </span>
  //                   </div>

  //                   <button
  //                     onClick={() => handleContributeClick(goal)}
  //                     disabled={goal.isCompleted}
  //                     className={`text-xs px-4 py-1.5 rounded-md font-medium transition-colors ${goal.isCompleted
  //                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
  //                       : 'bg-primary hover:bg-primary-dark text-white'
  //                       }`}
  //                   >
  //                     {goal.isCompleted ? 'Completed' : 'Add Funds'}
  //                   </button>
  //                 </div>
  //               </div>
  //             );
  //           })}

  //           {/* Add New Goal Card */}
  //           <div
  //             className="goal-card bg-gray-800/50 rounded-lg shadow-lg overflow-visible border-2 border-dashed border-gray-600 hover:border-primary dark:hover:border-primary flex items-center justify-center min-h-[320px] cursor-pointer transition-all duration-200 hover:bg-gray-800/70"
  //             onClick={() => setIsNewGoalModalOpen(true)}
  //           >
  //             <div className="text-center p-6">
  //               <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
  //                 <FontAwesomeIcon icon={faPlus} className="text-primary text-xl" />
  //               </div>
  //               <h3 className="font-medium text-white mb-2">
  //                 Create New Goal
  //               </h3>
  //               <p className="text-sm text-gray-400 mb-3">
  //                 Start saving for your dreams with Nigerian market intelligence
  //               </p>
  //               <div className="text-xs text-gray-500">
  //                 {nigerianInsights?.isSchoolFeeSeason && "Perfect timing for school fees goal!"}
  //                 {nigerianInsights?.isSalaryCycle && !nigerianInsights?.isSchoolFeeSeason && "End-of-month - great for goal setup"}
  //                 {!nigerianInsights?.isSchoolFeeSeason && !nigerianInsights?.isSalaryCycle && "Click to get started"}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </main>

  //     {/* Modals */}
  //     <NewGoalModal
  //       isOpen={isNewGoalModalOpen}
  //       onClose={() => {
  //         setIsNewGoalModalOpen(false);
  //         setSelectedGoal(null);
  //       }}
  //       onGoalCreated={handleGoalCreated}
  //     />

  //     {/* Edit Modal - reusing NewGoalModal with editGoal prop */}
  //     {selectedGoal && (
  //       <NewGoalModal
  //         isOpen={isEditModalOpen}
  //         onClose={() => {
  //           setIsEditModalOpen(false);
  //           setSelectedGoal(null);
  //         }}
  //         onGoalCreated={async (goal) => {
  //           await handleGoalCreated(goal);
  //           setSelectedGoal(null);
  //         }}
  //         editGoal={selectedGoal}
  //       />
  //     )}

  //     {/* Contribute Modal */}
  //     <ContributeModal
  //       isOpen={isContributeModalOpen}
  //       onClose={() => {
  //         setIsContributeModalOpen(false);
  //         setSelectedGoal(null);
  //       }}
  //       goal={selectedGoal}
  //       onContribute={handleContribute}
  //     />

  //     {/* Bottom padding for mobile navigation */}
  //     <div className="pb-20" />
  //   </div>
  // );
};

export default SmartGoalsPage;