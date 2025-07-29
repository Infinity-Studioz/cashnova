'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import React, { useRef, useEffect } from 'react';
import clsx from 'clsx';

interface TransactionEntry {
  title: string;
  subtitle: string;
  amount: number;
  icon: IconName;
  category: string;
  method: string;
  tags?: string[];
}

interface DayDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  totalSpent: number;
  percentageUsed: number;
  transactions: TransactionEntry[];
  onAddTransaction: () => void;
}

export default function DayDetailsModal({
  visible,
  onClose,
  date,
  totalSpent,
  percentageUsed,
  transactions,
  onAddTransaction,
}: DayDetailsModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    };

    if (visible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [visible, onClose]);

  return (
    <div
      ref={overlayRef}
      className={clsx(
        'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300',
        visible ? 'opacity-100 visible' : 'opacity-0 invisible'
      )}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{date} Details</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <FontAwesomeIcon icon="times" />
            </button>
          </div>

          {/* Budget Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">Total Spent:</p>
              <p className="text-xl font-bold text-red-600">₦{totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${percentageUsed}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-1">{percentageUsed}% of monthly budget</p>
          </div>

          {/* Transaction List */}
          <div className="space-y-4">
            {transactions.map((entry, i) => (
              <div key={i} className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2">
                      <FontAwesomeIcon icon={entry.icon} />
                    </div>
                    <div>
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-xs text-slate-500">{entry.subtitle}</p>
                    </div>
                  </div>
                  <p className="font-medium text-red-600">-₦{entry.amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center text-xs text-slate-500 mt-2">
                  <FontAwesomeIcon icon="tags" className="mr-2" />
                  <span className="bg-slate-100 px-2 py-1 rounded-full mr-2">{entry.category}</span>
                  <FontAwesomeIcon icon="credit-card" className="mr-2" />
                  <span>{entry.method}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Transaction Button */}
          <div className="mt-6">
            <button
              onClick={onAddTransaction}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              <FontAwesomeIcon icon="plus" className="mr-2" /> Add Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
