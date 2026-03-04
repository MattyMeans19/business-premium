'use client'
import { useActionState, useState } from "react";
import { login } from "@/app/(admin)/actions";
export default function LoginForm() {
    const [loggingIn, setLoggingIn] = useState(false)
    const [formState, setFormState] = useActionState(login, null)
    
    return (
      <div className="w-full px-6 py-30 max-h-screen flex flex-col gap-10">
          <form action={setFormState} className="w-full md:w-[50vw] place-self-center my-50 md:px-50 bg-fuchsia-200 p-6 rounded-lg shadow-lg flex flex-col gap-4">
              <input type="text" placeholder="User Name" name="username" autoComplete="off" className="w-full p-2 border border-slate-600 bg-white rounded mb-4" />
              <input type="password" placeholder="Password" name="password" autoComplete="off" className="w-full p-2 border border-slate-600 bg-white rounded mb-4" />
              <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded"
              onClick={() => {
                  setLoggingIn(true);
              }}>
                  {loggingIn ? "Logging in..." : "Login"}
              </button>
              {formState?.message && <p className="text-red-600">{formState?.message}</p>}
          </form>
          <p className="text-center text-red-600">This page is for administrators only. Any person(s) attempting unauthorized 
              access will be subject to disciplinary or legal action.</p>
      </div>
    );
}