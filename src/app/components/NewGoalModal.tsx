'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faTimes } from '@fortawesome/free-solid-svg-icons';

const goalIcons = [
  'beach.png',
  'car.png',
  'home.png',
  'wedding.png',
  'graduation-cap.png',
  'emergency.png',
  'gift.png',
  'money-bag.png',
];

export default function NewGoalModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  const [goalName, setGoalName] = useState('');
  const [selectedImage, setSelectedImage] = useState('beach.png');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');

  // Set default goal date 3 months from now
  useEffect(() => {
    if (isOpen) {
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 3);
      setGoalDate(defaultDate.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
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

  // Simulate AI suggestion logic
  useEffect(() => {
    const amount = parseFloat(targetAmount) || 0;
    const suggestion = amount * 1.2;
    setAiSuggestion(
      `AI Suggestion: Based on your savings rate, we recommend a target of ₦${suggestion.toLocaleString()} in 6 months`
    );
  }, [targetAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send form data to backend
    alert('Goal created successfully!');
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setGoalName('');
    setSelectedImage('beach.png');
    setTargetAmount('');
    setCurrentAmount('');
    setPriority('medium');
    setNotes('');
    setAiSuggestion('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">
              Create New Goal
            </h3>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-400">
              {/* <i className="fas fa-times"></i> */}
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Goal Name */}
            <div className="mb-4">
              <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                id="goalName"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g. Vacation Fund, New Car, etc."
              />
            </div>

            {/* Goal Image Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Image</label>
              <div className="goal-image-selector grid grid-cols-4 gap-3 mt-2">
                {goalIcons.map((icon) => (
                  <Image
                    key={icon}
                    src={`/assets/icons/${icon}`}
                    alt={icon}
                    width={100}
                    height={100}
                    onClick={() => setSelectedImage(icon)}
                    className={`w-full h-16 object-contain p-2 rounded-lg border cursor-pointer ${selectedImage === icon
                        ? 'border-primary ring-2 ring-primary'
                        : 'border-gray-200 dark:border-gray-300'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Amount (₦)
                </label>
                <input
                  type="number"
                  id="targetAmount"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="500,000"
                />
              </div>
              <div>
                <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Already Saved (₦)
                </label>
                <input
                  type="number"
                  id="currentAmount"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="50,000"
                />
              </div>
            </div>

            {/* Date and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="goalDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  id="goalDate"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="goalPriority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  id="goalPriority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="goalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="goalNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Any additional details about your goal"
              ></textarea>
            </div>

            {/* AI Suggestion */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  {/* <i className="fas fa-lightbulb text-blue-500"></i> */}
                  <FontAwesomeIcon icon={faLightbulb} className='text-blue-500' />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-blue-800 ai-suggestion">{aiSuggestion}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
