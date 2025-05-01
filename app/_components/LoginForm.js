"use client";

import { useState } from "react";
import SpinnerMini from "./SpinnerMini";

function LoginForm({ children }) {
  const [email, setEmail] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  // const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    // login({ email, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
    >
      <div className="space-y-2">
        <label>Email address</label>
        <input
          name="email"
          type="email"
          required
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // disabled={isLoading}
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>
      <div className="space-y-2">
        <label>Password</label>
        <input
          name="password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // disabled={isLoading}
          required
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
        />
      </div>
      <div className="flex justify-end items-center gap-6">
        <button
          //  disabled={isLoading}
          className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
        >
          Login
          {/* {!isLoading ? "Login" : <SpinnerMini />}    */}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
