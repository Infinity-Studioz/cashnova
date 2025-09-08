'use client';

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV, faEdit, faPlus, faTrash, faPause,
  faPlay, faArchive, faShare, faCopy
} from '@fortawesome/free-solid-svg-icons';

// Define Goal interface locally since we might not have the service imported yet
interface Goal {
  _id: string;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  progressPercentage: number;
  targetAmount: number;
}

interface GoalDropdownProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onContribute: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onToggleActive: (goal: Goal) => void;
  onArchive?: (goal: Goal) => void;
  onShare?: (goal: Goal) => void;
}

export default function GoalDropdown({
  goal,
  onEdit,
  onContribute,
  onDelete,
  onToggleActive,
  onArchive,
  onShare
}: GoalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTimeout(() => setIsOpen(false), 0);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuClick = (action: () => void) => {
    console.log('Menu item clicked!');
    action();
    setIsOpen(false);
  };

  const copyGoalLink = () => {
    const goalUrl = `${window.location.origin}/smartGoals?goal=${goal._id}`;
    navigator.clipboard.writeText(goalUrl);
    console.log('Goal link copied to clipboard');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        aria-label="Goal options"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>

      {/* Simple dropdown without portal - let parent handle overflow */}
      {isOpen && (
        <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-600 py-1">
          {/* Add Funds */}
          <button
            onClick={() => {
              console.log('Add Funds button clicked');
              handleMenuClick(() => onContribute(goal));
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-3 w-4" />
            Add Funds
          </button>

          {/* Edit Goal */}
          <button
            onClick={() => {
              console.log('Edit button clicked');
              handleMenuClick(() => onEdit(goal));
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FontAwesomeIcon icon={faEdit} className="mr-3 w-4" />
            Edit Goal
          </button>

          {/* Pause/Resume Goal */}
          {!goal.isCompleted && (
            <button
              onClick={() => {
                console.log('Pause/Resume button clicked');
                handleMenuClick(() => onToggleActive(goal));
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <FontAwesomeIcon
                icon={goal.isActive ? faPause : faPlay}
                className="mr-3 w-4"
              />
              {goal.isActive ? 'Pause Goal' : 'Resume Goal'}
            </button>
          )}

          {/* Archive Goal (for completed goals) */}
          {goal.isCompleted && onArchive && (
            <button
              onClick={() => {
                console.log('Archive button clicked');
                handleMenuClick(() => onArchive(goal));
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <FontAwesomeIcon icon={faArchive} className="mr-3 w-4" />
              Archive Goal
            </button>
          )}

          <hr className="my-1 border-gray-200 dark:border-gray-600" />

          {/* Copy Link */}
          <button
            onClick={() => {
              console.log('Copy Link button clicked');
              handleMenuClick(copyGoalLink);
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
          >
            <FontAwesomeIcon icon={faCopy} className="mr-3 w-4" />
            Copy Link
          </button>

          {/* Share Goal */}
          {onShare && (
            <button
              onClick={() => {
                console.log('Share button clicked');
                handleMenuClick(() => onShare(goal));
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
            >
              <FontAwesomeIcon icon={faShare} className="mr-3 w-4" />
              Share Goal
            </button>
          )}

          <hr className="my-1 border-gray-200 dark:border-gray-600" />

          {/* Delete Goal */}
          <button
            onClick={() => {
              console.log('Delete button clicked');
              handleMenuClick(() => onDelete(goal));
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-3 w-4" />
            Delete Goal
          </button>
        </div>
      )}
    </div>
  );
}