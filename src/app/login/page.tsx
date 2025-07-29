// "use client";
// import { signIn, signOut, useSession } from "next-auth/react";
// // import MainNavigation from "../components/MainNavigation";
// import { redirect } from "next/navigation";
// export default function LoginPage() {
//   const { data: session } = useSession();
//   if (session) {
//     setTimeout(() => {
//       redirect('/');
//     }, 5000);
//   }
//   return (
//     <div>
//       <button className="p-1 bg-amber-500" onClick={() => signIn("google")}>Sign in with Google</button>
//       {session && <button onClick={() => signOut()}>Sign out</button>}
//     </div>
//   );
// }

// "use client";

// import { signIn, signOut, useSession } from "next-auth/react";

// export default function Login() {
//   const { data: session } = useSession();

//   return (
//     <div>
//       {!session ? (
//         <button className="p-1 bg-amber-500" onClick={() => signIn("google")}>
//           Sign in with Google
//         </button>
//       ) : (
//         <>
//           <p>Welcome, {session.user?.name}</p>
//           <button onClick={() => signOut()}>Sign out</button>
//         </>
//       )}
//     </div>
//   );
// }

'use client';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function TestGoogleLogin() {
  const { data: session } = useSession();
  return (
    <div>
      {!session ? (
        <button onClick={() => signIn('google')}>Sign in with Google</button>
      ) : (
        <>
          <p>Welcome, {session.user?.name}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
