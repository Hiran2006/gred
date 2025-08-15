"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../login/login.module.css";
import Image from "next/image";
import bgImage from "@/public/background.png";
import Link from "next/link";
import supabase from "@/lib/supabase";
import GoogleAuthButton from "@/components/GoogleAuthButton";

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
    <div className="flex items-center bg-amber-100">
      <div className={styles.wrapper}>
        <h1>Create an account</h1>
        {error && <p className={styles.errorMessage}>{error.message}</p>}
        <form className={styles.form} onSubmit={handleSignup}>
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
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240.168-120q12.832 0 21.832-9.068 9-9.069 9-21.932t-9.032-21.932q-9.033-9.068-21-9.068T480-343q-9 9-9 21.833 0 12.834 9 22.167 8.667 9 21.833 9Q516-280 528-289t12-22q0-13-9-22t-21.832-9q-12.833 0-21.833 9.05-9 9.05-9 21.95 0 12.9 9 22 9 9.05 21.832 9.05ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
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
          <div
            className={`${styles.formGroup} ${
              error?.field === "confirmPassword" ? styles.incorrect : ""
            }`}
          >
            <label htmlFor="confirm-password-input" className={styles.label}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240.168-120q12.832 0 21.832-9.068 9-9.069 9-21.932t-9.032-21.932q-9.033-9.068-21-9.068T480-343q-9 9-9 21.833 0 12.834 9 22.167 8.667 9 21.833 9Q516-280 528-289t12-22q0-13-9-22t-21.832-9q-12.833 0-21.833 9.05-9 9.05-9 21.95 0 12.9 9 22 9 9.05 21.832 9.05ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
              </svg>
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirm-password-input"
              placeholder="Confirm Password"
              className={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <GoogleAuthButton
          isLoading={isLoading}
          onSuccess={() => router.push("/home")}
          onError={(error) => setError(error)}
        />

        <p className={styles.signupLink}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </p>
      </div>
      <div className="lg:flex justify-center items-center hidden lg:w-1/2">
        <Image src={bgImage} alt="Background Image" width={400} />
      </div>
    </div>
  );
}
