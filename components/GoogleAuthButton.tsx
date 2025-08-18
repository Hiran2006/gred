"use client";

import { FcGoogle } from "react-icons/fc";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        throw error;
      }

      // The OAuth flow will handle the redirection
      // The middleware will take care of the rest
      onSuccess?.();
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
      className="w-full max-w-[400px] h-[50px] rounded-[10px] bg-white text-gray-800 font-medium flex items-center justify-center gap-3 border-2 border-gray-200 hover:border-amber-400 focus:outline-none focus:border-gray-800 transition-[150ms] ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
      type="button"
      onClick={() => handleOAuth("google")}
      disabled={isLoading || isButtonLoading}
    >
      <FcGoogle className="text-2xl" />
      <span>
        {isLoading || isButtonLoading
          ? "Please wait..."
          : "Continue with Google"}
      </span>
    </button>
  );
}
