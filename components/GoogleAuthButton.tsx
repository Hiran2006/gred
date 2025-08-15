"use client";

import { FcGoogle } from "react-icons/fc";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "@/app/login/login.module.css";
import supabase from "@/lib/supabase";

type GoogleAuthButtonProps = {
  isLoading?: boolean;
  onSuccess?: () => void;
  onError?: (error: { message: string; field?: string }) => void;
};

export default function GoogleAuthButton({
  isLoading = false,
  onSuccess,
  onError,
}: GoogleAuthButtonProps) {
  const [isButtonLoading, setButtonLoading] = useState(false);
  const router = useRouter();

  const handleOAuth = async (provider: Provider) => {
    setButtonLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + "/home",
        },
      });

      if (error) {
        const errorData = {
          message: error.message,
          field: error.status === 400 ? "email" : "provider",
        };
        onError?.(errorData);
      }
    } catch (error) {
      console.error("Google auth error:", error);
      onError?.({
        message: "An error occurred during authentication. Please try again.",
        field: "provider",
      });
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <button
      className={`${styles.button} ${styles.googleButton}`}
      type="button"
      onClick={() => handleOAuth("google")}
      disabled={isLoading || isButtonLoading}
    >
      <FcGoogle className={styles.googleIcon} />
      {isLoading || isButtonLoading ? "Please wait..." : "Continue with Google"}
    </button>
  );
}
