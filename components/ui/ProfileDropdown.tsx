"use client";

import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/DropdownMenu";

export default function ProfileDropdown() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };

    getUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // Clear any local storage or state if needed
        localStorage.clear();

        // Redirect to home page after successful sign out
        window.location.href = "/";
      } else {
        console.error("Error signing out:", error.message);
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <DropdownMenu
      trigger={
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors cursor-pointer">
          <UserCircleIcon className="w-6 h-6 text-gray-700" />
        </div>
      }
      align="right"
      className="ml-4"
    >
      <DropdownMenuLabel>
        <p className="text-sm font-medium text-gray-700">Signed in as</p>
        <p className="text-sm text-gray-500 truncate">{userEmail || "User"}</p>
      </DropdownMenuLabel>

      <DropdownMenuItem
        href="/profile"
        icon={<UserCircleIcon className="w-5 h-5" />}
      >
        Your Profile
      </DropdownMenuItem>

      <DropdownMenuItem
        href="/settings"
        icon={<Cog6ToothIcon className="w-5 h-5" />}
      >
        Settings
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={handleSignOut}
        className="text-red-600"
        icon={<ArrowLeftOnRectangleIcon className="w-5 h-5" />}
      >
        Sign out
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
