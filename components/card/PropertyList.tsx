"use client";
import { useEffect, useState, useCallback } from "react";
import PropertyCard from "./PropertyCard";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Post = {
  post_id: number;
  title: string;
  content: string;
  post_type: "rent" | "sell";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 6 items per page for 2x3 grid
  const [totalItems, setTotalItems] = useState(0);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      console.log('Fetching posts from Supabase...');
      
      // Get the count of all posts
      const { count, error: countError } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });

      if (countError) {
        console.error('Error counting posts:', countError);
        throw countError;
      }

      console.log('Total posts count:', count);
      setTotalItems(count || 0);

      // Get paginated posts
      console.log(`Fetching posts ${from} to ${to}...`);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .range(from, to)
        .order('created_at', { ascending: false })
        .order("post_date", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setPosts(data || []);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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
    <div className="w-full max-w-6xl px-4 py-8 space-y-8">
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
            imageUrl={post.picture_url + "/img1.jpeg"}
            onRequest={() => handleRequest(post.post_id)}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalItems > itemsPerPage && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage * itemsPerPage >= totalItems || loading}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
