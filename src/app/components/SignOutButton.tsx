'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { signOut } from 'next-auth/react'

const SignOutButton = () => {
  return (
    <button
      onClick={() => signOut()}
      className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-800 dark:text-white py-2 px-4 rounded-lg text-sm font-medium"
    >
      <FontAwesomeIcon icon={'sign-out'} className='mr-2' /> Sign Out
    </button>
  )
}

export default SignOutButton