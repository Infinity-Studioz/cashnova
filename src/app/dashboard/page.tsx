import { redirect } from "next/navigation";
import { getAuthSession } from "@/utils/getSession";
import MainNavigation from "../components/MainNavigation";
import Dashboard from "../index/page";
import '../../lib/fontawesome'

const page = async () => {
  const session = await getAuthSession();
    
  if (!session) redirect("/login");
  
  return (
    <>
      <MainNavigation />
      <p className="text-blue-300">Welcome, {session.user?.name}</p>
      <Dashboard />
    </>
  )
}

export default page