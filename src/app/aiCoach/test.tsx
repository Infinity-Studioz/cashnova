'use client';

import { useEffect, useRef, useState } from 'react';
import '@/app/globals.css'; // Import your Tailwind CSS
import MainNavigation from '../components/MainNavigation';

export default function AICoachPage() {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai'; time: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    // Add initial AI welcome message
    addMessage(
      "Hello! I'm Nova, your AI financial coach. I can help you with budgeting, saving, and making smarter money decisions. What would you like to know today?",
      'ai'
    );
  }, []);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages((prev) => [...prev, { text, sender, time: getTime() }]);
    setTimeout(scrollToBottom, 100);
  };

  const showTypingThenRespond = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = getAIResponse(text);
      addMessage(reply, 'ai');
    }, 1500);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    addMessage(text, 'user');
    setInputValue('');
    showTypingThenRespond(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  const getAIResponse = (text: string): string => {
    const msg = text.toLowerCase();
    if (msg.includes('netflix')) return 'Canceling Netflix saves ₦6,000/month — ₦72,000/year. Want me to redirect that to savings?';
    if (msg.includes('save more') || msg.includes('cut cost'))
      return 'Try reducing dining out, cancelling unused subscriptions, and carpooling. That could save ₦30,000+/month.';
    if (msg.includes('spend'))
      return 'Top spendings last month:\n1. Dining: ₦45,000\n2. Transport: ₦32,000\n3. Entertainment: ₦25,000';
    if (msg.includes('forecast'))
      return 'Savings forecast:\n- 3 months: ₦90,000\n- 6 months: ₦180,000\n- 12 months: ₦360,000';
    return "I'm analyzing your spending. Hang tight...";
  };

  const prompts = [
    'How can I save more this month?',
    'Where did I spend most last month?',
    'Suggest cost-cutting ideas for me',
    "What's my savings forecast for this year?",
    'How much can I save by cutting Netflix?',
    'Create a budget plan for me',
  ];

  return (
    <>
      <MainNavigation />
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Financial Coach</h2>
          <p className="text-gray-600 dark:text-gray-400">Your personalized assistant for money management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {/* Sidebar */}
          <div className="hidden lg:block border-r border-gray-200 dark:border-gray-400 p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium text-gray-900 mb-3 dark:text-gray-300">Quick Prompts</h3>
            <div className="space-y-3">
              {prompts.map((prompt, i) => (
                <div
                  key={i}
                  className="cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-600 text-sm dark:text-white hover:shadow"
                  onClick={() => {
                    addMessage(prompt, 'user');
                    showTypingThenRespond(prompt);
                  }}
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-400 p-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="fas fa-robot text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 dark:text-gray-200">Nova AI</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your financial assistant</p>
              </div>
            </div>

            <div ref={chatRef} className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                  {msg.sender === 'ai' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <i className="fas fa-robot text-purple-600 text-sm" />
                      </div>
                    </div>
                  )}
                  <div className={msg.sender === 'user' ? 'mr-3 text-right' : 'ml-3'}>
                    <div
                      className={`rounded-lg p-3 max-w-3xl whitespace-pre-line ${msg.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-white'
                        }`}
                    >
                      {msg.text}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Today, {msg.time}</div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <i className="fas fa-user text-gray-600 text-sm" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <i className="fas fa-robot text-purple-600 text-sm" />
                    </div>
                  </div>
                  <div className="ml-3 bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-xs">
                    <div className="typing-indicator flex space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-400 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Nova anything about your finances..."
                  className="flex-grow border border-gray-300 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button onClick={handleSend} className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark">
                  <i className="fas fa-paper-plane" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <br /><br /><br /><br />
    </>
  );
}
