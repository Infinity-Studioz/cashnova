'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faWallet, faPiggyBank, faGift } from '@fortawesome/free-solid-svg-icons';
import { Goal } from '@/services/goalsService';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onContribute: (amount: number, source: string, note?: string) => Promise<void>;
}

const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

const contributionSources = [
  { value: 'manual', label: 'Manual Savings', icon: faWallet },
  { value: 'salary_bonus', label: 'Salary/Bonus', icon: faPiggyBank },
  { value: 'windfall', label: 'Unexpected Income', icon: faGift },
];

export default function ContributeModal({ isOpen, onClose, goal, onContribute }: ContributeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('manual');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
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
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !goal) return;

    const contributionAmount = parseFloat(amount);
    
    if (!contributionAmount || contributionAmount < 100) {
      alert('Minimum contribution is ₦100');
      return;
    }

    if (contributionAmount > 10000000) {
      alert('Maximum single contribution is ₦10,000,000');
      return;
    }

    setIsSubmitting(true);

    try {
      await onContribute(contributionAmount, source, note.trim() || undefined);
      handleClose();
    } catch (error) {
      console.error('Error contributing to goal:', error);
      alert(error instanceof Error ? error.message : 'Failed to add contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setAmount('');
    setSource('manual');
    setNote('');
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  if (!isOpen || !goal) return null;

  const remainingAmount = goal.remainingAmount || (goal.targetAmount - goal.currentAmount);
  const progressPercentage = goal.progressPercentage || ((goal.currentAmount / goal.targetAmount) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 visible opacity-100 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
              Add Funds to Goal
            </h3>
            <button 
              onClick={handleClose} 
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400 disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Goal Summary */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
              {goal.title}
            </h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Current:</span>
                <span className="font-medium">{goal.formattedCurrentAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="font-medium">{goal.formattedTargetAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className="font-medium text-primary">
                  ₦{remainingAmount.toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{progressPercentage.toFixed(1)}% complete</span>
                {goal.deadline && (
                  <span>
                    {goal.daysUntilDeadline 
                      ? `${goal.daysUntilDeadline} days left`
                      : 'No deadline'
                    }
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Quick Amount Buttons */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Amounts
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className={`p-2 text-xs border rounded-md transition-colors ${
                      amount === quickAmount.toString()
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    ₦{quickAmount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contribution Amount (₦) *
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter amount"
                min="100"
                max="10000000"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum: ₦100 • Maximum: ₦10,000,000
              </p>
            </div>

            {/* Contribution Source */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source of Funds
              </label>
              <div className="space-y-2">
                {contributionSources.map((sourceOption) => (
                  <label
                    key={sourceOption.value}
                    className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <input
                      type="radio"
                      name="source"
                      value={sourceOption.value}
                      checked={source === sourceOption.value}
                      onChange={(e) => setSource(e.target.value)}
                      className="mr-3"
                    />
                    <FontAwesomeIcon 
                      icon={sourceOption.icon} 
                      className="text-gray-400 mr-3"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {sourceOption.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Note (Optional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Add a note about this contribution"
                maxLength={200}
              />
            </div>

            {/* Nigerian Context Insights */}
            {goal.nigerianInsights && goal.nigerianInsights.length > 0 && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Timing Insights
                </h5>
                {goal.nigerianInsights.slice(0, 2).map((insight, index) => (
                  <p key={index} className="text-xs text-blue-700 dark:text-blue-300">
                    • {insight}
                  </p>
                ))}
              </div>
            )}

            {/* Contribution Impact Preview */}
            {amount && parseFloat(amount) > 0 && (
              <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h5 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                  Impact Preview
                </h5>
                <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <div>
                    New progress: {((goal.currentAmount + parseFloat(amount)) / goal.targetAmount * 100).toFixed(1)}%
                  </div>
                  <div>
                    Remaining after this: ₦{Math.max(0, remainingAmount - parseFloat(amount)).toLocaleString()}
                  </div>
                  {goal.currentAmount + parseFloat(amount) >= goal.targetAmount && (
                    <div className="font-semibold">
                      🎉 This contribution will complete your goal!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !amount || parseFloat(amount) < 100}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  `Add ₦${amount ? parseFloat(amount).toLocaleString() : '0'}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}