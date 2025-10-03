// import { redirect } from "next/navigation";
// import { getAuthSession } from "@/utils/getSession";
// import MainNavigation from "../components/MainNavigation";
// import Dashboard from "../index/page";
// import '../../lib/fontawesome'

// const page = async () => {
//   const session = await getAuthSession();
    
//   if (!session) redirect("/login");
  
//   return (
//     <>
//       <MainNavigation />
//       <p className="text-blue-300">Welcome, {session.user?.name}</p>
//       <Dashboard />
//     </>
//   )
// }

// export default page

// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getAuthSession } from "@/utils/getSession";

const DashboardPage = async () => {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  // Redirect authenticated users to home page which has the dashboard
  redirect("/");
}

export default DashboardPage;