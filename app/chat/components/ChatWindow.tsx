"use client";

import { useEffect, useRef, useState } from "react";
import { Database } from "@/lib/supabase/database.types";
import supabase from "@/lib/supabase/client";

type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  sender_email?: string;
  is_current_user?: boolean;
};

type Conversation = {
  id: string;
  other_user_id: string;
  other_user_email: string;
  unread_count: number;
};

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
}

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for the current conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversation?.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: true });

        if (error) throw error;

        // Get sender emails for each message
        const messagesWithSenders = await Promise.all(
          data.map(async (msg) => {
            const { data: sender } = await supabase
              .from("profiles")
              .select("email")
              .eq("id", msg.sender_id)
              .single();

            return {
              ...msg,
              sender_email: sender?.email || "Unknown",
              is_current_user:
                msg.sender_id === (await supabase.auth.getUser()).data.user?.id,
            };
          })
        );

        setMessages(messagesWithSenders);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`messages:${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload: { new: Message }) => {
          const newMessage = payload.new as Message;

          // Get sender email
          const { data: sender } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", newMessage.sender_id)
            .single();

          // Get current user ID first
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const currentUserId = user?.id;

          setMessages((prev) => [
            ...prev,
            {
              ...newMessage,
              sender_email: sender?.email || "Unknown",
              is_current_user: newMessage.sender_id === currentUserId,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [conversation.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation?.id) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          conversation_id: conversation.id,
          content: messageContent,
          sender_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      if (error) throw error;

      // Update the conversation's updated_at timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversation.id);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally show error to user
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button
          onClick={onBack}
          className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
        >
          <svg
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {conversation.other_user_email.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <h2 className="text-lg font-medium text-gray-900">
            {conversation.other_user_email}
          </h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No messages
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Send a message to start the conversation with{" "}
                {conversation.other_user_email}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.is_current_user ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.is_current_user
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-900 rounded-bl-none"
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="text-xs font-medium">
                    {message.is_current_user ? "You" : message.sender_email}
                  </span>
                  <span className="text-xs opacity-75 ml-2">
                    {formatTime(message.created_at)}
                  </span>
                </div>
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={!newMessage.trim()}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span className="sr-only">Send message</span>
          </button>
        </form>
      </div>
    </div>
  );
}
