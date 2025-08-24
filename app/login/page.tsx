"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bgImage from "@/public/background.png";
import supabase from "@/lib/supabase";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";

type LoginError = {
  message: string;
  field?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    console.log(window.location.origin + "/home");
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError({
        message: error.message,
        field: error.code === "PGRST116" ? "email" : "password",
      });
      setIsLoading(false);
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="flex min-h-screen bg-amber-100">
      <div className="box-border bg-white h-screen w-full max-w-[600px] p-2.5 rounded-r-[20px] flex flex-col items-center justify-center">
        <h1 className="text-5xl font-black uppercase text-gray-800 mb-8">
          Login to GRED.
        </h1>
        {error && (
          <p className="w-full max-w-[400px] text-red-500 text-sm mb-4 text-center">
            {error.message}
          </p>
        )}
        <form
          className="w-full max-w-[400px] my-5 mx-0 flex flex-col items-center gap-2.5"
          onSubmit={handleLogin}
        >
          <div
            className={`w-full flex justify-center ${
              error?.field === "email" ? "border-red-500" : ""
            }`}
          >
            <div className="flex-shrink-0 h-[50px] w-[50px] bg-amber-400 text-white rounded-l-[10px] flex justify-center items-center text-2xl font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1em"
                viewBox="0 0 512 512"
                className="fill-current"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="box-border flex-grow min-w-0 h-[50px] px-4 font-inherit rounded-r-[10px] border-2 border-gray-200 border-l-0 bg-gray-200 transition-[150ms] ease-in-out hover:border-amber-400 focus:outline-none focus:border-gray-800"
              placeholder="Email"
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
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2.5 border-none rounded-full py-[0.85em] px-16 bg-amber-400 text-white font-inherit font-semibold uppercase cursor-pointer transition-[150ms] ease-in-out hover:bg-gray-800 focus:outline-none disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
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
          New here?{" "}
          <a
            href="/signup"
            className="text-amber-500 font-semibold hover:underline"
          >
            Create an Account
          </a>
        </p>
      </div>
      <div className="hidden lg:flex justify-center items-center lg:w-1/2">
        <Image src={bgImage} alt="Background Image" width={400} />
      </div>
    </div>
  );
}
