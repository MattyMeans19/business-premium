"use client"
import { Logout, updateMessage, UpdateUserPassword } from "@/app/(admin)/actions";
import { useState, useEffect } from "react";
import AdminOrders from "./admin-orders";
import AdminNav from "./admin-nav";

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: Date;
}


interface AdminConsoleProps {
    currentUser: string;
    customMessage: string;
    users: any[];
    orders: Order[];
}
export default function AdminConsole({ currentUser, customMessage, users, orders }: AdminConsoleProps) {
    const [alertMessage, setAlertMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertColor, setAlertColor] = useState("green");

    useEffect(() => {
        if (alertMessage) {
            setAlert(true);
            const timer = setTimeout(() => {
                setAlert(false);
            }, 3000);
            setTimeout(() => {
                window.location.reload();
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    async function handleUpdateMessage(newMessage: string) {
        const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
        const messageRequest = await updateMessage(newMessage);

        if (messageRequest.success) {
            setAlertMessage(messageRequest.message);
            setAlertColor("green");
        } else {
            setAlertMessage(messageRequest.message);
            setAlertColor("red");
        }
        textarea.value = "";
    }

    async function handleResetPassword(userId: number, newPassword: string) {
        const passwordRequest = await UpdateUserPassword(userId, newPassword);
        if (passwordRequest.success) {
            setAlertMessage(passwordRequest.message);
            setAlertColor("green");
        } else {
            setAlertMessage(passwordRequest.message);
            setAlertColor("red");
        }
    }

    return (
        <div className="w-full h-full md:px-6 py-2 max-h-screen flex flex-col gap-10 relative">
            <AdminNav />
            <span className="text-center text-3xl font-medium">
                Welcome back, {currentUser}!
            </span>

            <div className="grow w-full md:px-6 flex flex-col md:grid grid-cols-4 gap-10">
            <div className="ConsoleBox ">
                <h2 className="text-2xl text-center">Custom Message</h2>
                    <p className="text-center text-3xl"><strong className="text-purple-500">Current Message:</strong> {customMessage}</p>
                    <textarea className="w-full h-24 p-2 border border-gray-300 rounded-md mt-4 grow" placeholder="Enter new custom message..."></textarea>
                    <button className="mt-2 bg-(--primary-color)/75 hover:bg-(--primary-color) text-white px-4 py-2 rounded-md"
                    onClick={() => {
                        const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
                        handleUpdateMessage(textarea.value);
                    }}>
                        Update Message
                    </button>
            </div>
            <div className="ConsoleBox">
                <h2 className="text-2xl text-center">User Management</h2>
                <div className="grow">
                    {users.map((user) => (
                        <div key={user.id} className="h-full flex flex-col items-center gap-15 border-gray-300 rounded-md p-4 m-4">
                            <p className="text-center text-xl basis-1/3 md:max-h-fit"><strong>User Name: </strong> {user.username}</p>
                            <div className="flex flex-nowrap justify-around w-full">
                                <label htmlFor="newPassword" className="text-center text-lg basis-1/3 md:max-h-fit">New Password:</label>
                                <input type="password" id="newPassword" name="password" autoComplete="off" className="basis-1/2 max-h-fit bg-gray-100 border w-full border-gray-300 rounded-md p-2 col-span-2" />    
                            </div>
                            <button className=" bg-(--primary-color)/75 hover:bg-(--primary-color) text-white px-4 py-2 rounded-md w-full self-center"
                                onClick={() => {
                                    const passwordInput = document.querySelector(`input[name="password"]`) as HTMLInputElement;
                                    handleResetPassword(user.id, passwordInput.value);
                                }}>
                                Reset Password
                            </button>                               
                        </div>
                        
                    ))}
                </div>
            </div>
            <AdminOrders orders={orders} />

        </div>
        {alert && (
            <div className={`fixed top-15 self-center bg-${alertColor}-500 text-white text-4xl px-4 py-2 rounded-md shadow-lg animate-fade-down animate-once animate-ease-out animate-normal animate-fill-both`}>
                {alertMessage}
            </div>
        )}

    </div>
    );
}