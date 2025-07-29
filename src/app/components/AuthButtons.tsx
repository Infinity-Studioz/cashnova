'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p className="text-gray-200">Loading...</p>;

  return (
    <div className="text-gray-200 space-x-4">
      {session ? (
        <>
          <span>Welcome, {session.user?.name?.split(' ')[0]}</span>
          <button
            onClick={() => signOut()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
          >
            Sign Out
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn('google')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
