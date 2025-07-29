// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Extend withAuth to include custom logic
// export default withAuth(
//   function middleware(request: NextRequest) {
//     console.log("✅ Middleware triggered:", request.nextUrl.pathname);

//     // Example: You can add more custom checks here
//     // const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
//     // if (!isAdmin && isAdminRoute) return NextResponse.redirect(...);

//     return NextResponse.next();
//   },
//   {
//     pages: {
//       signIn: "/login", // Redirect here if unauthenticated
//     },
//   }
// );

// // Define where the middleware should run
// export const config = {
//   matcher: ["/settings", "/dashboard/:path*"], // Add other protected routes here
// };

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/settings", "/dashboard", "/profile"],
};
