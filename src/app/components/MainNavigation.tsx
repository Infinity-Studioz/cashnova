import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import ThemeToggle from "./ThemeToggle"
import Link from "next/link"

const MainNavigation = () => {

  return (
    <>
      {/* Header */}
      <header
        className="shadow-sm bg-white dark:bg-gray-800"
      >
        <div
          className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center"
        >
          <div className="flex items-center">
            <div
              className="w-20 h-10 rounded-full flex items-center justify-center"
            >
              <Image src="/assets/main.png" alt="Logo" width={100} height={100} />
            </div>
            <div>
              <h1
                className="text-xl font-bold text-yellow-600 dark:text-yellow-500"
              >
                CashNova
              </h1>
              {/* <p
                // className="text-xs text-gray-500 dark:text-gray-400"
              >
                by Infinity
              </p> */}
              <span className="text-xs ml-1 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">by Infinity</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <a href="/transactionHistory">
                <FontAwesomeIcon icon={"clock-rotate-left"}/>
              </a>
            </button>
            <div
              className="bg-gray-300 dark:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={"bell"}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav
        className="z-50 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-400 fixed bottom-0 w-full"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={"home"} className="text-xl" />
              <span className="text-xs mt-2">Home</span>
            </Link>
            <a
              href="/analytics&reports"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={"chart-pie"} className="text-xl" />
              <span className="text-xs mt-2">Analytics</span>
            </a>
            <a
              href="/addTransaction"
              // target="_blank"
              className="text-indigo-600 flex flex-col items-center"
            >
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center -mt-6 pulse"
                >
                  <FontAwesomeIcon icon={"plus"} className="text-white text-xl" />
                </div>
              </div>
            </a>
            <Link
              href="/smartGoals"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={"bullseye"} className="text-xl" />
              <span className="text-xs mt-2">Goals</span>
            </Link>
            <Link
              href="/settings"
              className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={'cog'} className="text-xl" />
              <span className="text-xs mt-2">Settings</span>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default MainNavigation