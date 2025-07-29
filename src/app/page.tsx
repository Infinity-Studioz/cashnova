// import AuthButtons from "./components/AuthButtons";
import MainNavigation from "./components/MainNavigation";
import Dashboard from "./index/page";
import type { Metadata } from "next";
// import LandingPage from "./landingPage/page";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/utils/getSession";


import '../lib/fontawesome'

export const metadata: Metadata = {
  title: "CashNova by Infinity | Your AI-Powered Personal Finance Tracker",
  description: "A finance management app that categorizes expenses, tracks budgets, and provides AI-driven financial advice.",
};

export default async function Home() {
  const session = await getAuthSession();
  
  if (!session) redirect("/login");
  // const session = await getServerSession(authOptions);

  // if (!session) redirect('/login');

  return (
    <>
      <MainNavigation />
      <p className="text-blue-300">Welcome, {session.user.name}</p>
      <Dashboard />
      {/* <h1 className="text-blue-300">Welcome to CashNova, {session.user?.name}</h1> */}
      {/* <AuthButtons /> */}
      {/* <LandingPage /> */}
    </>
  );
}
