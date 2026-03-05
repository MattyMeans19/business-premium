
import { cookies } from "next/headers";
import {decrypt} from "@/lib/session";
import LoginForm from "@/components/login-form";
import AdminConsole from "@/components/admin-console";
import { db } from "@/db";
import { AdminCredentials, CustomMessage, Orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPortal() {
    const cookie = (await cookies()).get('session')?.value;
    let sessionInfo = await decrypt(cookie);
    let currentUser = sessionInfo?.username as string;
    const customMessage = await db.select().from(CustomMessage);
    const users = await db.select().from(AdminCredentials);
    const orders = await db.select().from(Orders).orderBy(desc(Orders.createdAt)).limit(10);
    const userLimit = parseInt(process.env.USER_LIMIT!);



  return (
    <div className="w-full px-6 max-h-screen flex flex-col gap-10">
<h1 className="text-3xl md:text-5xl font-bold text-center w-full border-b-10 
        border-double rounded-3xl border-(--primary-color) pb-5 shadow-xl shadow-slate-600/50">
          Business Admin Portal
        </h1>
        {currentUser ?
         <AdminConsole 
            currentUser={currentUser} 
            customMessage={customMessage[0]?.message || "No custom message set"}
            users={users}
            userLimit={userLimit}
            orders={orders}
         /> 
         : <LoginForm />}
    </div>
    );
}