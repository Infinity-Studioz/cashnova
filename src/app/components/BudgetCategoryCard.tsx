'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import '../../lib/fontawesome'

interface BudgetCategoryCardProps {
  icon: IconName;
  iconBgClass: string;
  iconTextClass: string;
  categoryTitle: string;
  categorySubtitle: string;
  crossedAmount: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
  disabled?: boolean;
  bottomTip?: {
    icon: IconName;
    text: string;
    className?: string;
  };
  onValueChange?: (value: number) => void;
}

// interface BudgetCategory {
//   icon: IconName;
//   iconBgClass: string;
//   iconTextClass: string;
//   categoryTitle: string;
//   categorySubtitle: string;
//   crossedAmount: string;
//   minValue: number;
//   maxValue: number;
//   defaultValue: number;
//   disabled?: boolean;
//   bottomTip?: {
//     icon: IconName;
//     text: string;
//     className?: string;
//   };
// }

// export const budgetCategories: BudgetCategory[] = [
//   {
//     icon: 'shopping-basket',
//     iconBgClass: 'bg-green-100',
//     iconTextClass: 'text-green-600',
//     categoryTitle: 'Groceries',
//     categorySubtitle: 'Monthly average: ₦30,000',
//     crossedAmount: '₦28,000',
//     minValue: 15000,
//     maxValue: 35000,
//     defaultValue: 25000,
//   },
//   {
//     icon: 'car',
//     iconBgClass: 'bg-blue-100',
//     iconTextClass: 'text-blue-600',
//     categoryTitle: 'Transport',
//     categorySubtitle: 'Monthly average: ₦15,000',
//     crossedAmount: '₦15,000',
//     minValue: 12000,
//     maxValue: 18000,
//     defaultValue: 13500,
//   },
//   {
//     icon: 'home',
//     iconBgClass: 'bg-purple-100',
//     iconTextClass: 'text-purple-600',
//     categoryTitle: 'Rent',
//     categorySubtitle: 'Fixed monthly expense',
//     crossedAmount: '₦50,000',
//     minValue: 50000,
//     maxValue: 50000,
//     defaultValue: 50000,
//     disabled: true,
//   },
//   {
//     icon: 'film',
//     iconBgClass: 'bg-pink-100',
//     iconTextClass: 'text-pink-600',
//     categoryTitle: 'Entertainment',
//     categorySubtitle: 'Monthly average: ₦12,000',
//     crossedAmount: '₦12,000',
//     minValue: 7000,
//     maxValue: 15000,
//     defaultValue: 9000,
//     bottomTip: {
//       icon: 'exclamation-circle',
//       text: 'Reducing this by ₦3,000 helps meet your savings goal',
//       className: 'text-red-500',
//     },
//   },
//   {
//     icon: 'dumbbell',
//     iconBgClass: 'bg-teal-100',
//     iconTextClass: 'text-teal-600',
//     categoryTitle: 'Fitness',
//     categorySubtitle: 'Monthly average: ₦8,000',
//     crossedAmount: '₦8,000',
//     minValue: 6000,
//     maxValue: 10000,
//     defaultValue: 7000,
//   },
// ];

export default function BudgetCategoryCard({
  icon,
  iconBgClass,
  iconTextClass,
  categoryTitle,
  categorySubtitle,
  crossedAmount,
  minValue,
  maxValue,
  defaultValue,
  disabled,
  onValueChange,
  bottomTip
}: BudgetCategoryCardProps) {
  const [value, setValue] = useState<number>(defaultValue);
  const [formattedValue, setFormattedValue] = useState<string>('₦0');
  const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace('NGN', '₦');

  useEffect(() => {
    setFormattedValue(formatCurrency(value));
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseInt(e.target.value);
    setValue(newVal);
    setFormattedValue(formatCurrency(newVal));
    if (onValueChange) onValueChange(newVal);
  };

  return (
    <div className="category-card bg-white dark:bg-slate-700 dark:border-slate-600 rounded-xl p-4 border-2 border-slate-100 hover:border-indigo-100 transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={clsx(iconBgClass, iconTextClass, 'p-2 rounded-lg mr-3')}>
            <FontAwesomeIcon icon={['fas', icon]} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-700 dark:text-slate-200">{categoryTitle}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-300">{categorySubtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-slate-500 line-through dark:text-slate-300">{crossedAmount}</span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-500">{formattedValue}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-slate-500 dark:text-slate-300">₦{minValue.toLocaleString()}</span>
        {/* <input
          type="range"
          min={minValue}
          max={maxValue}
          value={value}
          onChange={handleSliderChange}
          onMouseDown={() => setIsGrabbing(true)}
          onMouseUp={() => setIsGrabbing(false)}
          className={clsx(
            'budget-slider draggable-slider flex-1',
            isGrabbing && 'cursor-grabbing'
          )}
        /> */}
        <input
          type="range"
          min={minValue}
          max={maxValue}
          value={value}
          disabled={disabled}
          onChange={handleSliderChange}
          onMouseDown={() => setIsGrabbing(true)}
          onMouseUp={() => setIsGrabbing(false)}
          className={clsx(
            'budget-slider draggable-slider flex-1 cursor-grab',
            isGrabbing && 'cursor-grabbing'
          )}
        />


        <span className="text-sm text-slate-500 dark:text-slate-300">₦{maxValue.toLocaleString()}</span>
      </div>

      <div className="mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Min recommended</span>
        <span>Max recommended</span>
      </div>

      {bottomTip && (
        <div className={clsx("mt-3 text-xs flex items-center", bottomTip.className)}>
          <FontAwesomeIcon icon={['fas', bottomTip.icon]} className="mr-2" />
          <span>{bottomTip.text}</span>
        </div>
      )}

    </div>
  );
}
