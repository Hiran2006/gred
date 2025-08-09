"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./login.module.css";

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

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Save token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home page
      router.push("/");
      router.refresh();
    } catch (err) {
      setError({
        message:
          err instanceof Error ? err.message : "An error occurred during login",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
        <p>
          New here?{" "}
          <a href="/signup" className={styles.link}>
            Create an Account
          </a>
        </p>
      </div>
    </>
  );
}
