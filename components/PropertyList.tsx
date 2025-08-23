"use client";
import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  location: string;
  price: number;
  image_url: string;
  created_at: string;
};

type PropertyListProps = {
  className?: string;
  onRequestProperty?: (id: string) => void;
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
          .from("post")
          .select("*")
          .order("created_at", { ascending: false });

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

  const handleRequest = (id: string) => {
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
            key={post.id}
            id={post.id}
            title={post.title}
            location={post.location}
            price={post.price}
            imageUrl={post.image_url}
            onRequest={() => handleRequest(post.id)}
          />
        ))}
      </div>
    </div>
  );
}
