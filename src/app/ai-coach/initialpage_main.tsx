'use client'
import MainNavigation from "../components/MainNavigation"
import '../../lib/fontawesome'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState, useRef, useEffect } from "react";

const AIFinancialCoachPage = () => {
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
    if (msg.includes('netflix')) return 'Canceling Netflix saves ₦6,000/month - ₦72,000/year. Want me to redirect that to savings?';
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
      <div className="min-h-screen">
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Financial Coach
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your personalized assistant for money management
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="bg-white border border-gray-300 text-gray-700 dark:border-gray-500 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center"
              >
                {/* <i className="fas fa-history mr-2"></i> Past Conversations */}
                <FontAwesomeIcon icon={'history'} className="mr-2" /> Past Conversations
              </button>
              <button
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center"
              >
                {/* <i className="fas fa-lightbulb mr-2"></i> Insights */}
                <FontAwesomeIcon icon={'lightbulb'} className="mr-2" /> Insights
              </button>
            </div>
          </div>

          <div
            className="bg-white rounded-xl shadow-sm overflow-hidden card-shadow dark:bg-gray-800"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4">
              {/* <!-- Left sidebar with quick prompts --> */}
              <div
                className="hidden lg:block border-r border-gray-200 p-4 bg-white dark:bg-gray-800 dark:border-gray-400"
              >
                <h3 className="font-medium text-gray-900 mb-3 dark:text-gray-300">
                  Quick Prompts
                </h3>

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
                  {/* <div
                    className="prompt-card bg-white dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-500 p-3 rounded-lg border border-gray-200 cursor-pointer"
                  >
                    <p className="text-sm">How can I save more this month?</p>
                  </div>
                  <div
                    className="prompt-card bg-white dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-500 p-3 rounded-lg border border-gray-200 cursor-pointer"
                  >
                    <p className="text-sm">Where did I spend most last month?</p>
                  </div>
                  <div
                    className="prompt-card bg-white dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-500 p-3 rounded-lg border border-gray-200 cursor-pointer"
                  >
                    <p className="text-sm">Suggest cost-cutting ideas for me</p>
                  </div>
                  <div
                    className="prompt-card bg-white dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-500 p-3 rounded-lg border border-gray-200 cursor-pointer"
                  >
                    <p className="text-sm">
                      What&apos;s my savings forecast for this year?
                    </p>
                  </div>
                  <div
                    className="prompt-card bg-white dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-500 p-3 rounded-lg border border-gray-200 cursor-pointer"
                  >
                    <p className="text-sm">How much can I save by cutting Netflix?</p>
                  </div>
                  <div
                    className="prompt-card bg-white dark:bg-gray-600 text-gray-700 dark:text-white dark:border-gray-500 p-3 rounded-lg border border-gray-200 cursor-pointer"
                  >
                    <p className="text-sm">Create a budget plan for me</p>
                  </div> */}
                </div>

                <h3
                  className="font-medium text-gray-900 dark:text-gray-300 mt-6 mb-3"
                >
                  Recent Topics
                </h3>
                <div className="space-y-2">
                  <div
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {/* <i className="fas fa-tag text-purple-500 mr-2"></i> */}
                    <FontAwesomeIcon icon={'tag'} className="text-purple-500 mr-2" />
                    <span>Emergency fund</span>
                  </div>
                  <div
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    {/* <i className="fas fa-tag text-blue-500 mr-2"></i> */}
                    <FontAwesomeIcon icon={'tag'} className="text-blue-500 mr-2" />
                    <span>Subscription review</span>
                  </div>
                  <div
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    {/* <i className="fas fa-tag text-green-500 mr-2"></i> */}
                    <FontAwesomeIcon icon={'tag'} className="text-green-500 mr-2" />
                    <span>Vacation savings</span>
                  </div>
                  <div
                    className="flex items-center text-sm text-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    {/* <i className="fas fa-tag text-yellow-500 mr-2"></i> */}
                    <FontAwesomeIcon icon={'tag'} className="text-yellow-500 mr-2" />
                    <span>Debt repayment</span>
                  </div>
                </div>
              </div>

              {/* <!-- Main chat area --> */}
              <div className="lg:col-span-3">
                <div className="chat-container flex flex-col">
                  {/* <!-- Chat header --> */}
                  <div
                    className="border-b border-gray-200 dark:border-gray-400 p-4 flex items-center"
                  >
                    <div
                      className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"
                    >
                      {/* <i className="fas fa-robot text-purple-600"></i> */}
                      <FontAwesomeIcon icon={'robot'} className="text-purple-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-200">
                        Nova AI
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your financial assistant
                      </p>
                    </div>
                    <div className="ml-auto flex space-x-2">
                      {/* <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        <FontAwesomeIcon icon={'phone'} />
                      </button>
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        <FontAwesomeIcon icon={'video'} />
                      </button> */}
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 dark:text-gray-200 dark:hover:bg-gray-600"
                      >
                        {/* <i className="fas fa-ellipsis-v"></i> */}
                        <FontAwesomeIcon icon={'ellipsis-v'} />
                      </button>
                    </div>
                  </div>

                  {/* <!-- Chat messages --> */}
                  <div className="chat-messages overflow-y-auto p-4 space-y-4">
                    {/* <!-- AI welcome message --> */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
                        >
                          {/* <i className="fas fa-robot text-purple-600 text-sm"></i> */}
                          <FontAwesomeIcon icon={'robot'} className="text-purple-600 text-sm" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-3xl"
                        >
                          <p className="text-sm text-gray-800 dark:text-gray-100">
                            Hello! I&apos;m Nova, your AI financial coach. I can help
                            you with budgeting, saving, and making smarter money
                            decisions. What would you like to know today?
                          </p>
                        </div>
                        <div
                          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Today, 10:42 AM
                        </div>
                      </div>
                    </div>

                    {/* <!-- User message --> */}
                    <div className="flex items-start justify-end">
                      <div className="mr-3 text-right">
                        <div
                          className="bg-primary text-white rounded-lg p-3 max-w-3xl"
                        >
                          <p className="text-sm">How can I save more this month?</p>
                        </div>
                        <div
                          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Today, 10:43 AM
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
                        >
                          {/* <i className="fas fa-user text-gray-600 text-sm"></i> */}
                          <FontAwesomeIcon icon={'user'} className="text-gray-600 text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* <!-- AI response --> */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
                        >
                          {/* <i className="fas fa-robot text-purple-600 text-sm"></i> */}
                          <FontAwesomeIcon icon={'robot'} className="text-purple-600 text-sm" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-3xl"
                        >
                          <p className="text-sm text-gray-800 dark:text-gray-100">
                            Based on your spending patterns, here are 3 ways to
                            save more this month:
                          </p>
                          <ol
                            className="list-decimal pl-5 mt-2 space-y-1 text-gray-800 dark:text-gray-100"
                          >
                            <li>
                              <span className="font-medium">Reduce dining out:</span>
                              You spent ₦45,000 last month. Cutting by 50% could
                              save ₦22,500.
                            </li>
                            <li>
                              <span className="font-medium"
                              >Review subscriptions:</span
                              >
                              You have 7 active subscriptions totaling ₦18,500.
                              Canceling 2 could save ₦5,000.
                            </li>
                            <li>
                              <span className="font-medium"
                              >Optimize transportation:</span
                              >
                              Car pooling 2 days/week could save ₦8,000 in fuel.
                            </li>
                          </ol>
                          <p
                            className="mt-2 text-sm text-gray-800 dark:text-gray-200"
                          >
                            Would you like me to create a customized savings plan
                            for you?
                          </p>
                        </div>
                        <div
                          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Today, 10:44 AM
                        </div>
                      </div>
                    </div>

                    {/* <!-- User message --> */}
                    <div className="flex items-start justify-end">
                      <div className="mr-3 text-right">
                        <div
                          className="bg-primary text-white rounded-lg p-3 max-w-3xl"
                        >
                          <p className="text-sm">
                            How much can I save by cutting Netflix?
                          </p>
                        </div>
                        <div
                          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Today, 10:45 AM
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
                        >
                          {/* <i className="fas fa-user text-gray-600 text-sm"></i> */}
                          <FontAwesomeIcon icon={'user'} className="text-gray-600 text-sm" />
                        </div>
                      </div>
                    </div>

                    {/* <!-- AI response --> */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
                        >
                          {/* <i className="fas fa-robot text-purple-600 text-sm"></i> */}
                          <FontAwesomeIcon icon={'robot'} className="text-purple-600 text-sm" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-3xl"
                        >
                          <p className="text-sm text-gray-800 dark:text-gray-100">
                            Your Netflix subscription costs ₦6,000/month. If you
                            cancel it:
                          </p>
                          <ul
                            className="list-disc pl-5 mt-2 space-y-1 text-gray-800 dark:text-gray-100"
                          >
                            <li>
                              You&apos;ll save
                              <span className="font-medium">₦6,000/month</span> or
                              <span className="font-medium">₦72,000/year</span>
                            </li>
                            <li>
                              Your entertainment budget would decrease by 35%
                            </li>
                            <li>
                              Your projected savings by year-end would increase to
                              ₦120,000
                            </li>
                          </ul>
                          <div
                            className="mt-3 bg-blue-50 rounded-lg p-2 text-xs text-blue-800"
                          >
                            <p>
                              Would you like me to automatically transfer these
                              savings to your emergency fund?
                            </p>
                          </div>
                        </div>
                        <div
                          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Today, 10:46 AM
                        </div>
                      </div>
                    </div>

                    {/* <!-- AI forecast message --> */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
                        >
                          {/* <i className="fas fa-robot text-purple-600 text-sm"></i> */}
                          <FontAwesomeIcon icon={'robot'} className="text-purple-600 text-sm" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className="bg-gray-100 dark:bg-gray-200 rounded-lg p-3 max-w-3xl"
                        >
                          <div className="flex items-center">
                            {/* <i className="fas fa-chart-line text-green-500 mr-2"></i> */}
                            <FontAwesomeIcon icon={'chart-line'} className="text-green-500 mr-2" />
                            <p className="text-sm font-medium text-gray-800">
                              Savings Forecast
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-800">
                            If you implement these changes and maintain your
                            current income:
                          </p>
                          <div
                            className="mt-2 bg-white border border-gray-200 dark:border-gray-300 rounded-lg p-3"
                          >
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-600"
                              >By August:</span
                              >
                              <span className="font-medium text-green-600"
                              >₦100,000 saved</span
                              >
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500 dark:text-gray-600"
                              >By December:</span
                              >
                              <span className="font-medium text-green-600"
                              >₦250,000 saved</span
                              >
                            </div>
                          </div>
                          <p
                            className="mt-2 text-xs text-gray-600 dark:text-gray-700"
                          >
                            This projection assumes no major unexpected expenses.
                          </p>
                        </div>
                        <div
                          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                        >
                          Today, 10:47 AM
                        </div>
                      </div>
                    </div>

                    {/* <!-- AI typing indicator --> */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div
                          className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center"
                        >
                          {/* <i className="fas fa-robot text-purple-600 text-sm"></i> */}
                          <FontAwesomeIcon icon={'robot'} className="text-purple-600 text-sm" />
                        </div>
                      </div>
                      <div className="ml-3">
                        <div
                          className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 max-w-xs"
                        >
                          <div className="typing-indicator flex space-x-1">
                            <span className="dark:bg-gray-200"></span>
                            <span className="dark:bg-gray-200"></span>
                            <span className="dark:bg-gray-200"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- Chat input --> */}
                  <div className="border-t border-gray-200 dark:border-gray-400 p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 dark:hover:bg-gray-700 dark:text-gray-300"
                      >
                        {/* <i className="fas fa-paperclip"></i> */}
                        <FontAwesomeIcon icon={'paperclip'} />
                      </button>
                      <div className="flex-grow relative">
                        <input
                          type="text"
                          placeholder="Ask Nova anything about your finances..."
                          className="w-full border border-gray-300 dark:border-gray-500 bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
                        >
                          {/* <i className="far fa-smile"></i> */}
                          <FontAwesomeIcon icon={'smile'} />
                        </button>
                      </div>
                      <button
                        className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark"
                      >
                        {/* <i className="fas fa-paper-plane"></i> */}
                        <FontAwesomeIcon icon={'paper-plane'} />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-200 dark:hover:bg-gray-100 px-2 py-1 rounded-md"
                        >
                          {/* <i className="fas fa-bolt mr-1"></i> Quick reply */}
                          <FontAwesomeIcon icon={'bolt'} className="mr-1" /> Quick reply
                        </button>
                        <button
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-200 dark:hover:bg-gray-100 px-2 py-1 rounded-md"
                        >
                          {/* <i className="fas fa-magic mr-1"></i> Suggest prompts */}
                          <FontAwesomeIcon icon={'magic'} className="mr-1" /> Suggest prompts
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {/* <i className="fas fa-lock"></i> End-to-end encrypted */}
                        <FontAwesomeIcon icon={'lock'} /> End-to-end encrypted
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <br /><br /><br /><br />
    </>
  )
}

export default AIFinancialCoachPage