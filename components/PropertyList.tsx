"use client";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { supabase } from "@/lib/supabase";

type Post = {
  post_id: number;
  title: string;
  content: string;
  post_type: 'rent' | 'sell';
  post_date: string;
  location: string;
  picture_url: string;
  user_id: string;
};

type PropertyListProps = {
  className?: string;
  onRequestProperty?: (id: number) => void;
};

export default function PropertyList({
  className = "",
  onRequestProperty,
}: PropertyListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("post_date", { ascending: true });

        if (error) throw error;

        setPosts(data || []);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleRequest = (id: number) => {
    if (onRequestProperty) {
      onRequestProperty(id);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl px-4 py-8 text-center">
        <p>Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl px-4 py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="w-full max-w-6xl px-4 py-8 text-center text-gray-500">
        No properties found.
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl px-4 py-8">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}
      >
        {posts.map((post) => (
          <PropertyCard
            key={post.post_id}
            id={post.post_id}
            title={post.title}
            location={post.location}
            post_type={post.post_type}
            imageUrl={post.picture_url}
            onRequest={() => handleRequest(post.post_id)}
          />
        ))}
      </div>
    </div>
  );
}
