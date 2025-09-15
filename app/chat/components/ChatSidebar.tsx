"use client";

import { useState, useRef } from "react";
import supabase from "@/lib/supabase/client";

type Conversation = {
  id: string;
  other_user_id: string;
  other_user_email: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
};

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: (userId: string) => void;
}

export default function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  onNewConversation,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .ilike("email", `%${searchQuery}%`)
        .neq("id", (await supabase.auth.getUser()).data.user?.id)
        .limit(5);

      if (!error && data) {
        setSearchResults(data);
        dialogRef.current?.showModal();
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  interface User {
    id: string;
    email: string;
    full_name?: string;
  }

  const startNewConversation = (user: User) => {
    onNewConversation(user.id);
    dialogRef.current?.close();
    setSearchQuery("");
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatMessage = (message: string | null) => {
    if (!message) return "No messages yet";
    return message.length > 30 ? `${message.substring(0, 30)}...` : message;
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        <form onSubmit={handleSearch} className="mt-4 relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full p-2 pl-10 pr-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </form>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <svg
              className="h-16 w-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              No conversations yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start a new conversation to get started.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <li
                key={conversation.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : ""
                }`}
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {conversation.other_user_email.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.other_user_email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversation.last_message_at
                          ? formatTime(conversation.last_message_at)
                          : ""}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {formatMessage(conversation.last_message)}
                      </p>
                      {conversation.unread_count > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="rounded-lg shadow-xl w-full max-w-md p-0"
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Search Results</h3>
            <button
              onClick={() => dialogRef.current?.close()}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {searchResults.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {searchResults.map((user) => (
                <li key={user.id} className="py-2">
                  <button
                    onClick={() => startNewConversation(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md flex items-center"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 py-4 text-center">
              No users found matching your search.
            </p>
          )}
        </div>
      </dialog>
    </div>
  );
}
