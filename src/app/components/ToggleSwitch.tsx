// src/app/components/ToggleSwitch.tsx
'use client';
import { useEffect } from 'react';

interface ToggleSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ checked = false, onChange, disabled = false }: ToggleSwitchProps) => {
  const classNames = `w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500 dark:peer-focus:ring-primary-dark rounded-full peer ${checked ? 'bg-primary' : 'dark:bg-gray-500'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

  useEffect(() => {
    if (checked) {
      console.log('Switch turned ON');
      // trigger dark mode, make API call, show element, etc.
    } else {
      console.log('Switch turned OFF');
      // reverse actions here
    }
  }, [checked]);

  const handleChange = () => {
    if (onChange && !disabled) {
      onChange(!checked);
    }
  };

  return (
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <div
        className={classNames}
        // className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"
      ></div>
    </label>
  );
};

export default ToggleSwitch;