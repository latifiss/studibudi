"use client";

import React from "react";
import { authClient } from "@/src/lib/auth/client";
import { Wordmark } from "@/public/icons/logo";
import Link from 'next/link';

const SignupPage = () => {
  const handleSocialLogin = async (provider: "google") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/auth/success",
      });
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-6 dark:bg-[#1a1a2e]">
      <div className="flex flex-col items-center justify-center gap-8 max-w-sm w-full">
        {/* Wordmark Logo */}
        <Link href="/" className="cursor-pointer hover:opacity-70 transition-opacity">
          <Wordmark className="text-black dark:text-white" />
        </Link>

        <div className="flex flex-col items-center justify-center gap-6 w-full">
          <h1 className="text-3xl font-bold text-black dark:text-white font-display">
            Create your account
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-center font-text">
            Sign up to get started with our platform
          </p>

          <div className="flex flex-col gap-3 w-full mt-4">
            {/* Google Button - Outline Variant Design */}
            <button
              onClick={() => handleSocialLogin("google")}
              className={`
                inline-flex items-center justify-center gap-3 w-full h-[42px] px-5
                font-text text-[13px] font-bold leading-[18px] tracking-normal
                rounded-[8px]
                bg-white text-black border border-[#D9D9D9]
                hover:bg-gray-50 active:bg-gray-100
                shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F4CF0]
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:bg-[#1a1a2e] dark:text-white dark:border-[#3a3a4e]
                dark:hover:bg-[#2a2a3e] dark:active:bg-[#3a3a4e]
                dark:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.3)]
              `}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 48 48"
                className="shrink-0"
              >
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-text">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black dark:text-white font-medium hover:underline"
            >
              Login instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;