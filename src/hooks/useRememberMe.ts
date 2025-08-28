import { useState, useEffect } from 'react';

const REMEMBER_ME_KEY = 'cashnova_remember_me';
const REMEMBER_ME_EMAIL_KEY = 'cashnova_remembered_email';

export function useRememberMe() {
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberedEmail, setRememberedEmail] = useState('');

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      const savedEmail = localStorage.getItem(REMEMBER_ME_EMAIL_KEY) || '';
      
      setRememberMe(savedRememberMe);
      setRememberedEmail(savedEmail);
    }
  }, []);

  const updateRememberMe = (remember: boolean, email?: string) => {
    setRememberMe(remember);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(REMEMBER_ME_KEY, remember.toString());
      
      if (remember && email) {
        localStorage.setItem(REMEMBER_ME_EMAIL_KEY, email);
        setRememberedEmail(email);
      } else if (!remember) {
        localStorage.removeItem(REMEMBER_ME_EMAIL_KEY);
        setRememberedEmail('');
      }
    }
  };

  const clearRememberedData = () => {
    setRememberMe(false);
    setRememberedEmail('');
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REMEMBER_ME_KEY);
      localStorage.removeItem(REMEMBER_ME_EMAIL_KEY);
    }
  };

  return {
    rememberMe,
    rememberedEmail,
    updateRememberMe,
    clearRememberedData,
  };
}