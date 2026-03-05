"use client"
import { Logout, updateMessage, UpdateUserPassword } from "@/app/(admin)/actions";
import { useState, useEffect } from "react";
import AdminOrders from "./admin-orders";
import AdminNav from "./admin-nav";
import AddUser from "./add-user";

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
    userLimit: number;
    orders: Order[];
}
export default function AdminConsole({ currentUser, customMessage, users, orders, userLimit }: AdminConsoleProps) {
    const [alertMessage, setAlertMessage] = useState("");
    const [alert, setAlert] = useState(false);
    const [alertColor, setAlertColor] = useState("green");
    const [addingUser, ToggleAddingUser] = useState(false);

    useEffect(() => {
        if (alertMessage) {
            setAlert(true);
            const timer = setTimeout(() => {
                setAlert(false);
            }, 3000);
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

    async function handleAddUser(){
        if(users.length === userLimit){
            setAlertMessage("User limit is reached. Contact your web admin for upgrade options!")
            setAlertColor("red")
        } else if(users.length < userLimit){
            ToggleAddingUser(true);
        }
    }

    function childAlert(message: string, color: string){
        setAlertMessage(message);
        setAlertColor(color)
    }

    function HideUserModal(success: boolean){
        if(success){
            ToggleAddingUser(false);
            setTimeout(() => {
                window.location.reload()
            }, 3000);
        } else{
            ToggleAddingUser(false)
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
                    <p className="text-center md:text-3xl"><strong className="text-purple-500">Current Message:</strong> {customMessage}</p>
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
                <div className="border-b pb-2 border-(--primary-color) flex flex-nowrap justify-between">
                    <p><strong>Users: </strong> {users.length}/{userLimit}</p>
                    <h2 className="text-2xl text-center font-bold">User Management</h2>
                    <button className="text-center bg-(--primary-color) active:bg-(--secondary-color)
                     text-white px-3 rounded-2xl"
                     onClick={() => (handleAddUser())}>
                        Add User
                    </button>   
                </div>
                <div className="overflow-y-scroll inner-scrollbar">
                    {users.map((user) => (
                        <div key={user.id} className="h-fit flex flex-col items-center gap-15 border-gray-300 rounded-md p-4 m-4">
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
        {addingUser && <AddUser setAlert={childAlert} hideModal={HideUserModal}/>}
    </div>
    );
}