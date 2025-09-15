"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ChatClient component with SSR disabled
const ChatClient = dynamic(() => import('./components/ChatClient'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <ChatClient />
    </Suspense>
  );
}
