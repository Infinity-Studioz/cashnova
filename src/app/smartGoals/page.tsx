'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot, faPlus, faEllipsisV, faHome, faUmbrellaBeach,
  faCar, faHeart, faGraduationCap, faCheckCircle, faExclamationCircle,
  faBolt, faGem, faInfoCircle, faSpinner, faSliders, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import MainNavigation from '../components/MainNavigation';
import AuthButtons from '../components/AuthButtons';
import NewGoalModal from '../components/NewGoalModal';
import ContributeModal from '../components/ContributeModal';
import { useGoals, useGoalTemplates } from '@/hooks/useGoals';
import { Goal } from '@/services/goalsService';
import GoalDropdown from '../components/GoalDropdown';

const SmartGoalsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("active");
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const { data: session, status } = useSession();
  const {
    goals,
    summary,
    nigerianInsights,
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

  // Add this right after your useGoals destructuring
  console.log('Debug - Goals hook methods:', {
    updateGoal: typeof updateGoal,
    deleteGoal: typeof deleteGoal,
    hasUpdateGoal: !!updateGoal,
    hasDeleteGoal: !!deleteGoal
  });

  const { aiSuggestions, templates } = useGoalTemplates();

  // Update filter when selectedFilter changes
  useEffect(() => {
    setFilter(selectedFilter);
  }, [selectedFilter, setFilter]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to manage your goals</h2>
          <AuthButtons />
        </div>
      </div>
    );
  }

  const handleGoalCreated = async (goal: Goal) => {
    await refreshGoals();
    setIsNewGoalModalOpen(false);
  };

  const handleContributeClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsContributeModalOpen(true);
  };

  const handleContribute = async (amount: number, source: string, note?: string) => {
    if (!selectedGoal) return;
    await contributeToGoal(selectedGoal._id, amount, source, note);
    await refreshGoals();
  };

  const handleCreateFromTemplate = async (template: any) => {
    const goalData = {
      title: template.title,
      description: template.description,
      targetAmount: template.targetAmount,
      category: template.category as Goal['category'],
      priority: 'medium' as Goal['priority'],
      nigerianContext: {
        isSchoolFeesGoal: template.category === 'school_fees',
        isEmergencyFund: template.category === 'emergency_fund',
        isSalaryLinked: ['emergency_fund', 'school_fees', 'rent_advance'].includes(template.category),
        festiveSeasonBuffer: template.category === 'emergency_fund'
      }
    };

    try {
      await createGoal(goalData);
      await refreshGoals();
    } catch (error) {
      console.error('Error creating goal from template:', error);
    }
  };

  const handleEditClick = (goal: Goal) => {
    console.log('Edit clicked for goal:', goal.title);
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (goal: Goal) => {
    console.log('Delete clicked for goal:', goal.title);
    if (window.confirm(`Are you sure you want to delete "${goal.title}"? This action cannot be undone.`)) {
      try {
        console.log('About to call deleteGoal with ID:', goal._id);
        await deleteGoal(goal._id);
        await refreshGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  const handleToggleActive = async (goal: Goal) => {
    try {
      await updateGoal(goal._id, { isActive: !goal.isActive });
      await refreshGoals();
    } catch (error) {
      console.error('Failed to update goal status:', error);
    }
  };

  const handleShareGoal = (goal: Goal) => {
    const shareText = `I'm saving ₦${goal.targetAmount.toLocaleString()} for my ${goal.title}! Currently ${goal.progressPercentage.toFixed(1)}% complete.`;

    if (navigator.share) {
      navigator.share({
        title: `My ${goal.title} Goal`,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Goal details copied to clipboard');
    }
  };

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
      gadget_purchase: faCheckCircle,
      medical_emergency: faExclamationCircle,
      custom: faCheckCircle
    };
    return iconMap[category] || faCheckCircle;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getInsightIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      milestone: faCheckCircle,
      warning: faExclamationCircle,
      progress: faBolt,
      completion: faGem,
      info: faInfoCircle,
    };
    return iconMap[type] || faInfoCircle;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      emergency_fund: { bg: 'bg-red-100', text: 'text-red-600' },
      school_fees: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
      vacation: { bg: 'bg-green-100', text: 'text-green-600' },
      car_purchase: { bg: 'bg-purple-100', text: 'text-purple-600' },
      wedding: { bg: 'bg-pink-100', text: 'text-pink-600' },
      business_capital: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
      house_deposit: { bg: 'bg-blue-100', text: 'text-blue-600' },
      rent_advance: { bg: 'bg-orange-100', text: 'text-orange-600' },
      gadget_purchase: { bg: 'bg-gray-100', text: 'text-gray-600' },
      medical_emergency: { bg: 'bg-red-100', text: 'text-red-600' },
      custom: { bg: 'bg-gray-100', text: 'text-gray-600' }
    };
    return colorMap[category] || { bg: 'bg-gray-100', text: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen">
      <MainNavigation />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Smart Goals
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create and track personalized savings or budgeting goals
            </p>
            {summary && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {summary.active} active goals • {summary.formattedTotalSaved} saved of {summary.formattedTotalTargets}
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            <Link href="/budget-planner/screen-1">
              <button className="text-primary bg-white hover:bg-gray-100 border border-primary dark:bg-gray-200 dark:text-primary dark:hover:bg-white px-4 py-2 rounded-lg flex items-center">
                <FontAwesomeIcon icon={faRobot} className="text-primary mr-2" />
                AI Budget Assistant
              </button>
            </Link>
            <button
              onClick={() => setIsNewGoalModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New Goal
            </button>
          </div>
        </div>

        {/* Nigerian Market Insights */}
        {nigerianInsights && nigerianInsights.length > 0 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <FontAwesomeIcon icon={faInfoCircle} className="text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-purple-900 dark:text-purple-200">
                  Nigerian Market Insights
                </h3>
                <div className="mt-2 space-y-1">
                  {nigerianInsights.map((insight, index) => (
                    <p key={index} className="text-sm text-purple-800 dark:text-purple-300">
                      • {insight}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggestions Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 dark:bg-gray-800">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} className="text-purple-600" />
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                AI Goal Suggestions
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on your spending patterns and savings rate
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Emergency Fund Suggestion */}
                <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-200">
                        Emergency Fund
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        3 months of expenses
                      </p>
                    </div>
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-300">Target:</span>
                      <span className="font-medium dark:text-white">₦600,000</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500 dark:text-gray-300">Timeframe:</span>
                      <span className="font-medium dark:text-white">12 months</span>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleCreateFromTemplate({
                        title: 'Emergency Fund',
                        description: '3 months of expenses for financial security',
                        targetAmount: 600000,
                        category: 'emergency_fund'
                      })}
                      className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark"
                    >
                      Create Goal
                    </button>
                    <button
                      onClick={() => setIsNewGoalModalOpen(true)}
                      className="text-xs border border-gray-300 text-gray-700 dark:border-gray-500 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Customize
                    </button>
                  </div>
                </div>

                {/* Vacation Fund Suggestion */}
                <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-200">
                        Vacation Fund
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Trip to Dubai
                      </p>
                    </div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-300">Target:</span>
                      <span className="font-medium dark:text-white">₦350,000</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500 dark:text-gray-300">Timeframe:</span>
                      <span className="font-medium dark:text-white">6 months</span>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleCreateFromTemplate({
                        title: 'Vacation Fund',
                        description: 'Trip to Dubai',
                        targetAmount: 350000,
                        category: 'vacation'
                      })}
                      className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark"
                    >
                      Create Goal
                    </button>
                    <button
                      onClick={() => setIsNewGoalModalOpen(true)}
                      className="text-xs border border-gray-300 text-gray-700 dark:border-gray-500 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Customize
                    </button>
                  </div>
                </div>

                {/* Car Down Payment Suggestion */}
                <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-200">
                        Car Down Payment
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Toyota Camry 2023
                      </p>
                    </div>
                    <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Adjustment
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-300">Target:</span>
                      <span className="font-medium dark:text-white">₦1,200,000</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500 dark:text-gray-300">Timeframe:</span>
                      <span className="font-medium dark:text-white">18 months</span>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleCreateFromTemplate({
                        title: 'Car Down Payment',
                        description: 'Toyota Camry 2023',
                        targetAmount: 1200000,
                        category: 'car_purchase'
                      })}
                      className="text-xs bg-primary text-white px-3 py-1 rounded-md hover:bg-primary-dark"
                    >
                      Create Goal
                    </button>
                    <button
                      onClick={() => setIsNewGoalModalOpen(true)}
                      className="text-xs border border-gray-300 text-gray-700 dark:border-gray-500 dark:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Filter */}
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                Your Goals
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your progress towards financial milestones
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Goals</option>
                <option value="active">Active Goals</option>
                <option value="completed">Completed Goals</option>
                <option value="behind_schedule">Behind Schedule</option>
              </select>

              <button className="border border-gray-300 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 rounded-md text-sm">
                <FontAwesomeIcon icon={faSliders} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-primary" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading goals...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={() => refreshGoals()}
              className="mt-2 text-sm text-red-600 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Goals Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => {
              const categoryColor = getCategoryColor(goal.category);
              return (
                <div
                  key={goal._id}
                  className="goal-card bg-white rounded-lg shadow-sm overflow-visible border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className={`w-12 h-12 rounded-lg ${categoryColor.bg} flex items-center justify-center`}>
                          <FontAwesomeIcon
                            icon={getGoalIcon(goal.category)}
                            className={`${categoryColor.text} text-xl`}
                          />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-900 dark:text-gray-200">
                            {goal.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-300">
                            {goal.deadline ? `Due: ${new Date(goal.deadline).toLocaleDateString()}` : 'No deadline'}
                          </p>
                        </div>
                      </div>
                      <GoalDropdown
                        goal={goal}
                        onEdit={handleEditClick}
                        onContribute={handleContributeClick}
                        onDelete={handleDeleteClick}
                        onToggleActive={handleToggleActive}
                        onShare={handleShareGoal}
                      />
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500 dark:text-gray-300">Saved:</span>
                        <span className="font-medium dark:text-gray-100">
                          {goal.formattedCurrentAmount} of {goal.formattedTargetAmount}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progressPercentage)}`}
                          style={{ width: `${Math.min(goal.progressPercentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300">
                        <span>{goal.progressPercentage.toFixed(1)}% complete</span>
                        <span>
                          {goal.daysUntilDeadline !== undefined
                            ? `${goal.daysUntilDeadline} days remaining`
                            : 'No deadline'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Nigerian Insights for this goal */}
                    {goal.nigerianInsights && goal.nigerianInsights.length > 0 && (
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-1">
                            <FontAwesomeIcon icon={getInsightIcon('info')} className="text-blue-500" />
                          </div>
                          <div className="ml-2">
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                              {goal.nigerianInsights[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t border-gray-200 dark:bg-gray-700 dark:border-gray-500">
                    <span className="text-xs text-gray-500 dark:text-gray-300">
                      Created: {new Date(goal.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleContributeClick(goal)}
                      className="text-xs bg-white border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white dark:bg-gray-200 dark:hover:bg-primary dark:hover:text-white transition-colors"
                    >
                      Add Funds
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Add New Goal Card */}
            <div
              className="goal-card bg-white rounded-lg shadow-sm overflow-visible border-2 border-dashed border-gray-300 hover:border-primary dark:hover:border-primary dark:border-gray-500 dark:bg-gray-800 flex items-center justify-center min-h-[300px] cursor-pointer transition-colors"
              onClick={() => setIsNewGoalModalOpen(true)}
            >
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-80 dark:bg-gray-50 flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faPlus} className="text-primary text-xl" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-200">
                  Create New Goal
                </h3>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                  Start saving for your dreams
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && goals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faRobot} className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">
              No goals found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {selectedFilter === 'completed'
                ? "You haven't completed any goals yet. Keep working towards your active goals!"
                : selectedFilter === 'behind_schedule'
                  ? "Great news! None of your goals are behind schedule."
                  : "Start your financial journey by creating your first goal."
              }
            </p>
            {selectedFilter === 'active' && (
              <button
                onClick={() => setIsNewGoalModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg"
              >
                Create Your First Goal
              </button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
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
            await refreshGoals();
            setIsEditModalOpen(false);
            setSelectedGoal(null);
          }}
          editGoal={selectedGoal}
        />
      )}

      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => {
          setIsContributeModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
        onContribute={handleContribute}
      />

      <div className="pb-20" />
    </div>
  );
};

export default SmartGoalsPage;