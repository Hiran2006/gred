import Link from "next/link";
import {
  PlusCircleIcon,
  ChatBubbleLeftIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function BottomNavigation() {
  return (
    <div className="flex w-full justify-center fixed bottom-0">
      <div className="flex justify-between w-full items-center p-5 bg-white">
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

        <Link href="/products" className="flex flex-col items-center">
          <ShoppingBagIcon className="w-6 h-6 text-gray-500" />
          <span className="text-xs mt-1 text-gray-500">Products</span>
        </Link>
      </div>
    </div>
  );
}
