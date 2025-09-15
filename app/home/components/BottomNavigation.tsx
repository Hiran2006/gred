import Link from "next/link";
import {
  PlusCircleIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function BottomNavigation() {
  return (
    <div className="flex w-full justify-center">
      <div className="flex justify-between w-full items-center">
        <Link href="/chat" className="flex flex-col items-center">
          <ChatBubbleLeftIcon className="w-6 h-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Chat</span>
        </Link>

        <Link href="/add" className="flex flex-col items-center -mt-12">
          <div className="bg-white rounded-full p-3 border border-gray-300">
            <PlusCircleIcon className="w-8 h-8 text-black" />
          </div>
          <span className="text-xs mt-1 text-gray-500">Add</span>
        </Link>

        <Link href="/settings" className="flex flex-col items-center">
          <Cog6ToothIcon className="w-6 h-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Settings</span>
        </Link>
      </div>
    </div>
  );
}
