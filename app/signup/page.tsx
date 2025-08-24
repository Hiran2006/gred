"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/public/background.png";
import Link from "next/link";
import supabase from "@/lib/supabase";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

type SignupError = {
  message: string;
  field?: string;
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SignupError | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError({
        message: "Passwords do not match",
        field: "confirmPassword",
      });
      return;
    }

    setIsLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
      },
    });

    if (signUpError) {
      setError({
        message: signUpError.message,
        field: signUpError.status === 400 ? "email" : "password",
      });
      setIsLoading(false);
    } else {
      // Redirect to home page after successful signup
      // The user will receive a confirmation email
      router.push("/home");
    }
  };
  return (
    <div className="flex min-h-screen bg-amber-100">
      <div className="box-border bg-white h-screen w-full max-w-[600px] p-2.5 rounded-r-[20px] flex flex-col items-center justify-center">
        <h1 className="text-5xl font-black uppercase text-gray-800 mb-8">
          Create an account
        </h1>
        {error && (
          <p className="w-full max-w-[400px] text-red-500 text-sm mb-4 text-center">
            {error.message}
          </p>
        )}
        <form
          className="w-full max-w-[400px] my-5 mx-0 flex flex-col items-center gap-2.5"
          onSubmit={handleSignup}
        >
          <div
            className={`w-full flex justify-center ${
              error?.field === "email" ? "border-red-500" : ""
            }`}
          >
            <div className="flex-shrink-0 h-[50px] w-[50px] bg-amber-400 text-white rounded-l-[10px] flex justify-center items-center text-2xl font-medium">
              @
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="box-border flex-grow min-w-0 h-[50px] px-4 font-inherit rounded-r-[10px] border-2 border-gray-200 border-l-0 bg-gray-200 transition-[150ms] ease-in-out hover:border-amber-400 focus:outline-none focus:border-gray-800"
              placeholder="Email"
              disabled={isLoading}
              required
            />
          </div>

          <div
            className={`w-full flex justify-center ${
              error?.field === "password" ? "border-red-500" : ""
            }`}
          >
            <div className="flex-shrink-0 h-[50px] w-[50px] bg-amber-400 text-white rounded-l-[10px] flex justify-center items-center text-2xl font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 448 512"
                className="fill-current"
              >
                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
              </svg>
            </div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="box-border flex-grow min-w-0 h-[50px] px-4 font-inherit rounded-r-[10px] border-2 border-gray-200 border-l-0 bg-gray-200 transition-[150ms] ease-in-out hover:border-amber-400 focus:outline-none focus:border-gray-800"
              placeholder="Password"
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>

          <div
            className={`w-full flex justify-center ${
              error?.field === "confirmPassword" ? "border-red-500" : ""
            }`}
          >
            <div className="flex-shrink-0 h-[50px] w-[50px] bg-amber-400 text-white rounded-l-[10px] flex justify-center items-center text-2xl font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="fill-current"
              >
                <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
              </svg>
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="box-border flex-grow min-w-0 h-[50px] px-4 font-inherit rounded-r-[10px] border-2 border-gray-200 border-l-0 bg-gray-200 transition-[150ms] ease-in-out hover:border-amber-400 focus:outline-none focus:border-gray-800"
              placeholder="Confirm Password"
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full max-w-[400px] mt-2.5 border-none rounded-full py-[0.85em] px-16 bg-amber-400 text-white font-inherit font-semibold uppercase cursor-pointer transition-[150ms] ease-in-out hover:bg-gray-800 focus:outline-none disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="w-full max-w-[400px] my-5 mx-0 flex items-center before:content-[''] before:flex-1 before:h-px before:bg-gray-300 after:content-[''] after:flex-1 after:h-px after:bg-gray-300">
          <span className="px-4 text-gray-500">or</span>
        </div>

        <GoogleAuthButton
          isLoading={isLoading}
          onSuccess={() => router.push("/home")}
          onError={(error) => setError(error)}
        />

        <p className="mt-2.5 text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-500 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
      <div className="hidden lg:flex justify-center items-center lg:w-1/2">
        <Image src={bgImage} alt="Background Image" width={400} />
      </div>
    </div>
  );
}
