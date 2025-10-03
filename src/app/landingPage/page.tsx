'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import '../../lib/fontawesome'
import { faFacebookF, faInstagram, faLinkedinIn, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import { useEffect, useState } from "react"
import Link from "next/link"
// import { useRouter } from "next/navigation"

const LandingPage = () => {
  // const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get saved theme or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const currentTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(currentTheme);
    document.documentElement.classList.toggle("dark", currentTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const menuBtn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    const toggleMenu = () => menu?.classList.toggle('hidden');
    menuBtn?.addEventListener('click', toggleMenu);

    // Smooth scroll handler
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const handleSmoothScroll = (e: Event) => {
      e.preventDefault();
      const anchor = e.currentTarget as HTMLAnchorElement;
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });

        // Close mobile menu if open
        if (menu && !menu.classList.contains('hidden')) {
          menu.classList.add('hidden');
        }
      }
    };

    anchorLinks.forEach((a) => a.addEventListener('click', handleSmoothScroll));

    // Cleanup
    return () => {
      menuBtn?.removeEventListener('click', toggleMenu);
      anchorLinks.forEach((a) => a.removeEventListener('click', handleSmoothScroll));
    };
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
        className="sticky top-0 z-50 glass-card shadow-sm">

        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Image src="/assets/main.png" width={100} height={100} className="w-10 h-10" alt="logo" />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CashNova
              </span>
              <span className="text-xs ml-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">by Infinity</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-700 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Features</Link>
              <Link href="#pricing" className="text-slate-700 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Pricing</Link>
              <Link href="#ai-coach" className="text-slate-700 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition">AI Coach</Link>
              <Link href="#about" className="text-slate-700 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition">About</Link>
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-slate-700 dark:text-slate-100 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">Login</Link>
                <Link href="#cta" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg">Get Started</Link>
              </div>
            </div>

            {/* Mobile Toggle Button */}
            <div className="md:hidden">
              <button id="mobile-menu-button" className="text-gray-800 dark:text-gray-200 hover:text-indigo-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div id="mobile-menu" className="hidden md:hidden mt-4">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">Features</Link>
              <Link href="#pricing" className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">Pricing</Link>
              <Link href="#ai-coach" className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">AI Coach</Link>
              <Link href="#about" className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">About</Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Link href="#" className="block px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">Login</Link>
                <Link href="#cta" className="block px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-center">Get Started</Link>
              </div>
            </div>
          </div>
        </nav>
      </header >
      {/* <!-- Hero Section --> */}
      <section className="container mx-auto px-6 py-16 md:py-24" >
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1
              className="text-slate-700 dark:text-slate-100 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Take Control of Your Finances with
              <span
                className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              > Smart Budgeting.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Plan, track, and optimize your money effortlessly - powered by AI
              insights. Your finances, reimagined.
            </p>
            <div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                href="#cta"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg text-center"
              >
                Get Started Free
              </Link>
              <Link
                href="#how-it-works"
                className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg text-lg font-semibold hover:bg-indigo-100 dark:hover:bg-gray-800 transition text-center"
              >
                See How It Works
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="dashboard-preview relative max-w-md lg:max-w-lg">
              <div
                className="absolute -top-6 -left-6 w-24 h-24 bg-purple-200 dark:bg-purple-900 rounded-full opacity-30 blur-xl"
              ></div>
              <div
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-30 blur-xl"
              ></div>
              <picture>
                {/* For screens 480px and below */}
                <source
                  media="(max-width: 480px)"
                  srcSet="/assets/mobile_preview.png"
                />

                {/* For tablets (between 481px and 1023px) */}
                <source
                  media="(max-width: 1023px)"
                  srcSet="/assets/tablet_preview.png"
                />

                {/* Default for larger screens */}
                <Image
                  src="/assets/desktop_preview.png"
                  alt="CashNova Dashboard Preview"
                  width={1280}
                  height={720}
                  className="w-full h-auto rounded-xl"
                />
              </picture>
            </div>
          </div>
        </div>
      </section >
      {/* <!-- Features Section --> */}
      < section id="features" className="bg-gray-100 dark:bg-gray-800 py-16 md:py-24" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-slate-700 dark:text-slate-100 text-3xl md:text-4xl font-bold mb-4">
              Powerful Features to Transform Your Finances
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              CashNova combines cutting-edge technology with intuitive design to
              give you complete financial control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* <!-- Feature 1 --> */}
            <div
              className="feature-card bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md transition duration-300"
            >
              <div
                className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-6"
              >
                {/* <i
                  className="fas fa-robot text-2xl text-indigo-600 dark:text-indigo-400"
                ></i> */}
                <FontAwesomeIcon icon={'robot'} className="text-2xl text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Budget Smarter with AI</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your spending patterns and suggests personalized
                budgets to maximize savings.
              </p>
            </div>

            {/* <!-- Feature 2 --> */}
            <div
              className="feature-card bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md transition duration-300"
            >
              <div
                className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6"
              >
                {/* <i
                  className="fas fa-chart-pie text-2xl text-purple-600 dark:text-purple-400"
                ></i> */}
                <FontAwesomeIcon icon={'chart-pie'} className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Visual Financial Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Beautiful, interactive charts help you understand your finances at
                a glance.
              </p>
            </div>

            {/* <!-- Feature 3 --> */}
            <div
              className="feature-card bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md transition duration-300"
            >
              <div
                className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-6"
              >
                {/* <i
                  className="fas fa-bullseye text-2xl text-emerald-600 dark:text-emerald-400"
                ></i> */}
                <FontAwesomeIcon icon={'bullseye'} className="text-2xl text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Set & Track Savings Goals</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Define clear financial goals and track your progress with
                milestone celebrations.
              </p>
            </div>

            {/* <!-- Feature 4 --> */}
            <div
              className="feature-card bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md transition duration-300"
            >
              <div
                className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6"
              >
                {/* <i
                  className="fas fa-tags text-2xl text-blue-600 dark:text-blue-400"
                ></i> */}
                <FontAwesomeIcon icon={'tags'} className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Automatic Expense Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Transactions are automatically categorized so you always know
                where your money goes.
              </p>
            </div>
          </div>
        </div>
      </section >
      {/* <!-- How It Works Section --> */}
      < section id="how-it-works" className="py-16 md:py-24" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-slate-700 dark:text-slate-100 text-3xl md:text-4xl font-bold mb-4">
              How CashNova Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Getting started with smart financial management has never been
              easier.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* <!-- Step 1 --> */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="step-number">1</div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Create a Budget</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set up your monthly budget in minutes with our guided setup or let
                AI suggest one for you.
              </p>
            </div>

            {/* <!-- Step 2 --> */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="step-number">2</div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Add Goals</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Define what you&apos;re saving for - a vacation, emergency fund, or big
                purchase.
              </p>
            </div>

            {/* <!-- Step 3 --> */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="step-number">3</div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Track Spending</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect your accounts or add transactions manually. We&apos;ll
                categorize everything automatically.
              </p>
            </div>

            {/* <!-- Step 4 --> */}
            <div className="flex flex-col items-center text-center p-6">
              <div className="step-number">4</div>
              <h3 className="text-slate-700 dark:text-slate-100 text-xl font-bold mb-3">Get Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive weekly reports and AI-powered suggestions to optimize your
                finances.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="#cta"
              className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
            >
              Start Your Financial Journey
            </Link>
          </div>
        </div>
      </section >
      {/* <!-- AI Financial Coach Section --> */}
      < section id="ai-coach" className="bg-indigo-100 dark:bg-gray-800 py-16 md:py-24" >
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <h2 className="text-slate-700 dark:text-slate-100 text-3xl md:text-4xl font-bold mb-6">
                Your Personal AI Financial Coach
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Get 24/7 access to expert financial advice tailored to your unique
                situation. Our AI coach learns your habits and provides actionable
                recommendations.
              </p>

              <div
                className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg mb-8"
              >
                <div className="flex items-start mb-4">
                  <div
                    className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3"
                  >
                    {/* <i
                      className="fas fa-robot text-indigo-600 dark:text-indigo-400"
                    ></i> */}
                    <FontAwesomeIcon icon={'robot'} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div
                    className="ai-chat-bubble bg-indigo-100 dark:bg-indigo-900 p-4"
                  >
                    <p className="text-gray-800 dark:text-gray-100">
                      Based on your spending last month, you could save $120 by
                      reducing dining out. Would you like me to create a plan?
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-end">
                  <div className="user-chat-bubble bg-gray-200 dark:bg-gray-600 p-4">
                    <p className="text-gray-800 dark:text-gray-100">
                      Yes, please! I&apos;d love to save more.
                    </p>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center ml-3"
                  >
                    {/* <i className="fas fa-user text-gray-600 dark:text-gray-300"></i> */}
                    <FontAwesomeIcon icon={'user'} className="text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start">
                  {/* <i className="fas fa-check-circle text-emerald-500 mt-1 mr-3"></i> */}
                  <FontAwesomeIcon icon={'check-circle'} className="text-emerald-500 mt-1 mr-3" />
                  <span className="text-slate-700 dark:text-slate-100">Personalized savings recommendations</span>
                </li>
                <li className="flex items-start">
                  {/* <i className="fas fa-check-circle text-emerald-500 mt-1 mr-3"></i> */}
                  <FontAwesomeIcon icon={'check-circle'} className="text-emerald-500 mt-1 mr-3" />
                  <span className="text-slate-700 dark:text-slate-100">Debt payoff strategies</span>
                </li>
                <li className="flex items-start">
                  {/* <i className="fas fa-check-circle text-emerald-500 mt-1 mr-3"></i> */}
                  <FontAwesomeIcon icon={'check-circle'} className="text-emerald-500 mt-1 mr-3" />
                  <span className="text-slate-700 dark:text-slate-100">Investment guidance based on your goals</span>
                </li>
              </ul>
            </div>

            <div className="lg:w-1/2">
              <div>
                {/* <img
                  src="/assets/images/chatbot_preview.png"
                  alt="AI Financial Coach Interface"
                  className="rounded-lg"
                  /> */}
                <Image
                  src={'/assets/chatbot_preview.png'}
                  alt="AI Financial Coach Interface"
                  // className="rounded-lg"
                  width={1000}
                  height={100}
                />
              </div>
            </div>
          </div>
        </div>
      </section >
      {/* <!-- Testimonials Section --> */}
      < section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-800" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-slate-700 dark:text-slate-100 text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Join over 250,000 users who have transformed their financial lives
              with CashNova.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* <!-- Testimonial 1 --> */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4"
                >
                  <span
                    className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
                  >S</span>
                </div>
                <div>
                  <h4 className="text-slate-700 dark:text-slate-100 font-bold">Sarah J.</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                &quot;CashNova&apos;s AI coach helped me identify $300/month in unnecessary
                subscriptions I&apos;d forgotten about. In one year, that&apos;s $3,600
                saved!&quot;
              </p>
              <div className="mt-4 text-yellow-400">
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                {/* <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i> */}
              </div>
            </div>

            {/* <!-- Testimonial 2 --> */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4"
                >
                  <span
                    className="text-xl font-bold text-purple-600 dark:text-purple-400"
                  >M</span>
                </div>
                <div>
                  <h4 className="text-slate-700 dark:text-slate-100 font-bold">Michael T.</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                &quot;I paid off $15,000 in student loans 18 months early using
                CashNova&apos;s debt snowball calculator. The visual progress tracker
                kept me motivated.&quot;
              </p>
              <div className="mt-4 text-yellow-400">
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                {/* <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i> */}
              </div>
            </div>

            {/* <!-- Testimonial 3 --> */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md">
              <div className="flex items-center mb-6">
                <div
                  className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-4"
                >
                  <span
                    className="text-xl font-bold text-emerald-600 dark:text-emerald-400"
                  >A</span>
                </div>
                <div>
                  <h4 className="text-slate-700 dark:text-slate-100 font-bold">Aisha L.</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Freelance Designer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                &quot;As a freelancer with irregular income, CashNova&apos;s predictive
                budgeting has been a game-changer. I finally feel in control of my
                finances.&quot;
              </p>
              <div className="mt-4 text-yellow-400">
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star'} />
                <FontAwesomeIcon icon={'star-half-alt'} />
                {/* <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i> */}
              </div>
            </div>
          </div>
        </div>
      </section >
      {/* <!-- CTA Section --> */}
      < section
        id="cta"
        className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            {/* <!-- Logo Column --> */}
            <div className="md:w-1/2 mb-12 md:mb-0 flex justify-center">
              {/* <img
                src="/assets/images/main_logo_dark.png"
                alt="CashNova Logo"
                className="w-full max-w-xs md:max-w-md rounded-xl"
                /> */}
              <Image
                src={'/assets/main_logo_dark.png'}
                alt="CashNova Logo"
                className="w-full max-w-xs md:max-w-md rounded-xl"
                width={1000}
                height={100}
              />
            </div>

            {/* <!-- CTA Content Column --> */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to master your finances?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join CashNova today and take the first step toward financial
                freedom.
              </p>
              <Link
                href="/signup"
                className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-bold hover:bg-gray-100 transition shadow-xl mb-8"
              >
                Create a free account
              </Link>
              <p className="text-sm opacity-80">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section >
      {/* <!-- Footer --> */}
      < footer className="bg-gray-900 text-gray-300 py-12" >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* <!-- Logo and description --> */}
            <div>
              <div className="flex items-center mb-4">
                {/* <div
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl"
                >
                  CN
                </div> */}
                {/* <img src="/assets/images/main.png" className="w-20 h-20" alt="" /> */}
                <Image
                  src={'/assets/main.png'}
                  className="w-20 h-20"
                  width={100}
                  height={100}
                  alt="App Logo"
                />
                <span
                  className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                >CashNova</span>
              </div>
              <p className="mb-4">Your finances. Reimagined.</p>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                >
                  {/* <i className="fab fa-twitter"></i> */}
                  <FontAwesomeIcon icon={faXTwitter as any} />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                >
                  {/* <i className="fab fa-facebook-f"></i> */}
                  <FontAwesomeIcon icon={faFacebookF as any} />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                >
                  {/* <i className="fab fa-instagram"></i> */}
                  <FontAwesomeIcon icon={faInstagram as any} />
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                >
                  {/* <i className="fab fa-linkedin-in"></i> */}
                  <FontAwesomeIcon icon={faLinkedinIn as any} />
                </Link>
              </div>
            </div>

            {/* <!-- Links --> */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="hover:text-white transition"
                  >Features</Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-white transition"
                  >Pricing</Link>
                </li>
                <li>
                  <Link href="#ai-coach" className="hover:text-white transition"
                  >AI Coach</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">Integrations</Link>
                </li>
              </ul>
            </div>

            {/* <!-- Company --> */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="hover:text-white transition">About</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition">Careers</Link>
                </li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Press</Link></li>
              </ul>
            </div>

            {/* <!-- Legal --> */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition">Privacy</Link>
                </li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
                <li>
                  <Link href="#" className="hover:text-white transition">Security</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition"
                  >Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-sm mb-4 md:mb-0">
              &copy; 2025 CashNova by Infinity. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm hover:text-white transition"
              >Privacy Policy</Link>
              <Link href="#" className="text-sm hover:text-white transition"
              >Terms of Service</Link>
              <Link href="#" className="text-sm hover:text-white transition"
              >Contact Us</Link>
            </div>
          </div>
        </div>
      </footer >

      {/* <!-- Back to Top Button --> */}
      {/* < button
        id="back-to-top"
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition hidden"
      >
        <FontAwesomeIcon icon={'arrow-up'} />
      </button > */}
      <button
        id="back-to-top"
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition z-50 ${isVisible ? 'block' : 'hidden'
          }`}
        aria-label="Back to Top"
      >
        <FontAwesomeIcon icon="arrow-up" />
      </button>

      {/* <!-- Dark Mode Toggle --> */}
      {/* <button
        id="dark-mode-toggle"
        className="fixed bottom-8 left-8 w-12 h-12 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition flex items-center justify-center"
        >
        <FontAwesomeIcon icon={'moon'} />
        <FontAwesomeIcon icon={'sun'} className="hidden" />
        </button > */}
      {/* <ThemeToggle /> */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-8 left-8 w-12 h-12 rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition flex items-center justify-center"
      >
        <FontAwesomeIcon icon={theme === "light" ? 'moon' : 'sun'} />
      </button>
    </>
  )
}

export default LandingPage