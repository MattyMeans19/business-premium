'use client';

import { AddNewUser } from "@/app/(admin)/actions";
import { useState } from "react";

interface ModalProps {
    setAlert: (message:string, color:string) => void;
    hideModal: (success: boolean) => void;
}

export default function AddUser(props: ModalProps){
    const [username, SetUsername] = useState("");
    const [password, setPassword] = useState("")

    async function SaveNewUser(username: string, password: string){
        if(username === "" || password === ""){
            props.setAlert("Please fill out all fields", "red")
        } else if(username != null && password != null && password.length < 6){
            props.setAlert("Password must be at least 6 characters long", "red")
        } else if(username != null && password != null && password.length >= 6){
            const addRequest = await AddNewUser(username, password);
            if(addRequest.success){
                props.setAlert("New User Added Successfully!", "green");
                props.hideModal(addRequest.success)
            }
        }
    }

    function Cancel(){
        props.hideModal(false)
    }

    return(
        <div className="fixed inset-0 w-full h-full bg-slate-500/40 content-center">
            <div className="place-self-center bg-white border-5 rounded-2xl
                border-(--primary-color) grid grid-cols-2 gap-15 md:text-3xl py-15 px-5 md:p-25 relative">
                <button className="absolute top-5 right-5 cursor-pointer w-fit"
                    onClick={() => (Cancel())}>
                    ❌
                </button>
                <label htmlFor="username">New Username:</label>
                <input type="text" name="username" maxLength={20} autoComplete="off" 
                    className="border border-(--secondary-color) rounded-2xl p-2 w-full"
                    onChange={(e) => (SetUsername(e.target.value))}/>
                <label htmlFor="username">New Password:</label>
                <input type="password" name="password" minLength={6} maxLength={20} 
                    autoComplete="off" className="border border-(--secondary-color) rounded-2xl p-2 w-full"
                    onChange={(e) => (setPassword(e.target.value))}/>
                <button className="col-span-full bg-(--primary-color) active:bg-(--secondary-color) 
                w-fit p-5 place-self-center rounded-2xl text-white"
                onClick={() => {
                    SaveNewUser(username, password)
                }}>
                    Save new user
                </button>
            </div>
        </div>
    )
}