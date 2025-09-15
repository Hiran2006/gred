"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_email: string;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
}

async function getConversations() {
  const { data, error } = await supabase.rpc("get_user_conversations");
  if (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
  return data;
}

export default function ChatClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const fetchConversations = useCallback(async () => {
    try {
      const conversationId = searchParams.get("conversation");
      const data: Conversation[] = await getConversations();
      setConversations(data);

      // If there's a conversation ID in the URL, select it
      if (conversationId) {
        const selected = data.find(
          (conversation: Conversation) => conversation.id === conversationId
        );
        if (selected) setSelectedConversation(selected);
      } else if (data.length > 0) {
        // Otherwise select the first conversation
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchConversations();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload: {
          new: Database["public"]["Tables"]["messages"]["Row"];
        }) => {
          // Refresh conversations to update last message
          await fetchConversations();

          // If the new message is in the current conversation, update the messages
          const currentConvId = selectedConversation?.id;
          if (currentConvId === payload.new.conversation_id) {
            // You might want to update the messages state here if you have one
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [fetchConversations, selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Update URL without page reload
    window.history.pushState({}, '', `?conversation=${conversation.id}`);
  };

  const handleNewConversation = () => {
    // Handle new conversation logic
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white">
      <ChatSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
      />

      {selectedConversation ? (
        <ChatWindow
          conversation={selectedConversation}
          key={selectedConversation.id}
          onBack={() => setSelectedConversation(null)}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No conversation selected
            </h2>
            <p className="text-gray-600 mb-6">
              Select a conversation or start a new one to begin messaging.
            </p>
            <button
              onClick={() => {
                const dialog = document.getElementById(
                  "new-chat-dialog"
                ) as HTMLDialogElement;
                dialog?.showModal();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
