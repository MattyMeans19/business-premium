"use client"
import { DeleteUser, GetUserRole, updateMessage, UpdateUserPassword } from "@/app/(admin)/actions";
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
    const [userRole, setUserRole] = useState("");
    const [filteredUser, setFilteredUser] = useState<any>({
        userName: "",
        userRole: "",
        id: 0
    });

    useEffect(() => {
        if(userRole === ""){
                GetRole(currentUser);
            }
        if (alertMessage) {
            setAlert(true);
            const timer = setTimeout(() => {
                setAlert(false);
                setAlertMessage("")
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage, userRole]);

    async function GetRole(User: string){
        const roleRequest = await GetUserRole(User);
        setUserRole(roleRequest);
        if(roleRequest === "Employee"){
            const lock = users.filter(user => user.username === currentUser);
            setFilteredUser({userName:currentUser, userRole:lock[0].userRole, id: lock[0].id});
        }
    }

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

    async function HandleDelete(userToDelete: string){
        if(userToDelete === currentUser){
            setAlertMessage("Cannot delete self!")
            setAlertColor("red");
        } else{
            const deleteRequest = await DeleteUser(userToDelete);
            if (deleteRequest.success){
                setAlertMessage(deleteRequest.message)
                setAlertColor("green");
                setTimeout(() => {
                    window.location.reload()
                }, 3000);
            } else{
                setAlertMessage(deleteRequest.message)
                setAlertColor("red");
            }
        }
    }

    return (
        <div className="w-full h-full md:px-6 py-2 max-h-screen flex flex-col gap-10 relative">
            <AdminNav />
            <span className="text-center text-3xl font-medium">
                Welcome back, {currentUser}!
            </span>
            <div className="grow w-full md:px-6 flex flex-col md:grid grid-cols-4 gap-10">
            <div className="ConsoleBox relative">
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
                    {userRole == "Employee" &&
                        <span className="absolute top-0 left-0 w-full h-full content-center text-center text-5xl bg-slate-600/25">
                            🔒<br/><strong className="text-outline-black">Must Be Manager or Admin to Edit!</strong>
                        </span>
                    }
            </div>
            <div className="ConsoleBox">
                <div className="border-b pb-2 border-(--primary-color) flex flex-nowrap justify-between">
                    <p><strong>Users: </strong> {users.length}/{userLimit}</p>
                    <h2 className="text-2xl text-center font-bold">User Management</h2>
                    {filteredUser.userRole != "Employee" &&
                    <button className="text-center bg-(--primary-color) active:bg-(--secondary-color)
                     text-white px-3 rounded-2xl"
                     onClick={() => (handleAddUser())}>
                        Add User
                    </button>  } 
                </div>
                <div className="overflow-y-scroll inner-scrollbar">
                    {filteredUser.userRole == "Employee" ?
                    <div className="h-fit flex flex-col items-center gap-15 rounded-md p-2 m-8 border border-(--secondary-color)">
                            <div className="flex flex-nowrap justify-evenly w-full">
                                <p className="text-center text-xl basis-1/3 md:max-h-fit"><strong>User Name: </strong> {filteredUser.username}</p>
                                <p><strong>Role:</strong> {filteredUser.userRole}</p>
                            </div>
                            <div className="flex flex-nowrap justify-around w-full">
                                <label htmlFor="newPassword" className="text-center text-lg basis-1/3 md:max-h-fit">New Password:</label>
                                <input type="password" id="newPassword" name="password" autoComplete="off" className="basis-1/2 max-h-fit bg-gray-100 border w-full border-gray-300 rounded-md p-2 col-span-2" />    
                            </div>
                                <button className="bg-(--primary-color)/75 hover:bg-(--primary-color) text-white px-4 py-2 rounded-md"
                                    onClick={() => {
                                        const passwordInput = document.querySelector(`input[name="password"]`) as HTMLInputElement;
                                        handleResetPassword(filteredUser.id, passwordInput.value);
                                        passwordInput.value = "";
                                    }}>
                                    Reset Password
                                </button>                             
                        </div> :
                    <div>
                    {users.map((user) => (
                        <div key={user.id} className="h-fit flex flex-col items-center gap-15 rounded-md p-2 m-8 border border-(--secondary-color)">
                            <div className="flex flex-nowrap justify-evenly w-full">
                                <p className="text-center text-xl basis-1/3 md:max-h-fit"><strong>User Name: </strong> {user.username}</p>
                                <p><strong>Role:</strong> {user.userRole}</p>
                            </div>
                            {(userRole == "Admin" || user.username == currentUser) &&
                            <div className="flex flex-nowrap justify-around w-full">
                                <label htmlFor="newPassword" className="text-center text-lg basis-1/3 md:max-h-fit">New Password:</label>
                                <input type="password" id="newPassword" name="password" autoComplete="off" className="basis-1/2 max-h-fit bg-gray-100 border w-full border-gray-300 rounded-md p-2 col-span-2" />    
                            </div>
                            }
                            <div className="w-full flex flex-nowrap justify-evenly">
                                {(userRole == "Admin" || user.username == currentUser) &&
                                <button className="bg-(--primary-color)/75 hover:bg-(--primary-color) text-white px-4 py-2 rounded-md"
                                    onClick={() => {
                                        const passwordInput = document.querySelector(`input[name="password"]`) as HTMLInputElement;
                                        handleResetPassword(user.id, passwordInput.value);
                                        passwordInput.value = "";
                                    }}>
                                    Reset Password
                                </button> 
                                }
                                {(userRole !== 'Employee' && user.userRole != "Admin") &&
                                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                    onClick={() => (HandleDelete(user.username))}>
                                    Delete User    
                                </button>
                                }
                                
                            </div>                             
                        </div>
                        ))}
                    </div> }
                </div>
            </div>
            <AdminOrders orders={orders} />

        </div>
        {alert && (
            <div className={`fixed top-15 self-center bg-${alertColor}-500 text-white text-4xl px-4 py-2 rounded-md shadow-lg animate-fade-down animate-once animate-ease-out animate-normal animate-fill-both`}>
                {alertMessage}
            </div>
        )}
        {addingUser && <AddUser setAlert={childAlert} hideModal={HideUserModal} userRole={userRole}/>}
    </div>
    );
}