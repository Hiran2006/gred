"use client";
import { useState } from "react";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Image from "next/image";
import bgImage from "@/public/background.png";
import { FcGoogle } from "react-icons/fc";
import supabase from "@/lib/supabase";

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

  const handleOAuth = async (provider: Provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "http://localhost:3000/home",
        },
      });
      if (error) {
        setError({
          message: error.message,
          field: error.code === "PGRST116" ? "email" : "provider",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="flex items-center bg-amber-100">
      <div className={styles.wrapper}>
        <h1>Login to GRED.</h1>
        {error && <p className={styles.errorMessage}>{error.message}</p>}
        <form className={styles.form} onSubmit={handleLogin}>
          <div
            className={`${styles.formGroup} ${
              error?.field === "email" ? styles.incorrect : ""
            }`}
          >
            <label htmlFor="email-input" className={styles.label}>
              <span>@</span>
            </label>
            <input
              type="email"
              name="email"
              id="email-input"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div
            className={`${styles.formGroup} ${
              error?.field === "password" ? styles.incorrect : ""
            }`}
          >
            <label htmlFor="password-input" className={styles.label}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path
                  d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"
                  fill="currentColor"
                />
              </svg>
            </label>
            <input
              type="password"
              name="password"
              id="password-input"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button
          className={`${styles.button} ${styles.googleButton}`}
          type="button"
          onClick={() => handleOAuth("google")}
        >
          <FcGoogle className={styles.googleIcon} />
          Continue with Google
        </button>

        <p className={styles.signupLink}>
          New here?{" "}
          <a href="/signup" className={styles.link}>
            Create an Account
          </a>
        </p>
      </div>
      <div className="lg:flex justify-center items-center hidden lg:w-1/2">
        <Image src={bgImage} alt="Background Image" width={400} />
      </div>
    </div>
  );
}
