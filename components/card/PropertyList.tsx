"use client";
import { useEffect, useState, useCallback } from "react";
import PropertyCard from "./PropertyCard";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PropertyPost = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  rent_amount?: number;
  deposit_amount?: number;
  price?: number;
  image_url: string | null;
  location: string | null;
  contact_number: string | null;
  created_at: string;
  post_type?: "rent" | "sell";
};

type PropertyListProps = {
  className?: string;
  type: "buy" | "rent";
  onRequestProperty?: (id: number) => void;
};

export default function PropertyList({
  className = "",
  type,
  onRequestProperty,
}: PropertyListProps) {
  const [posts, setPosts] = useState<PropertyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const postsPerPage = 12;

  // Reset to first page when type changes
  useEffect(() => {
    setCurrentPage(0);
  }, [type]);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);

      const tableName = type === "rent" ? "rent_posts" : "sell_posts";
      const selectQuery =
        type === "rent"
          ? "id, title, description, category, rent_amount, deposit_amount, image_url, location, contact_number, created_at"
          : "id, title, description, category, price, image_url, location, contact_number, created_at";

      const { data, error, count } = await supabase
        .from(tableName)
        .select(selectQuery, { count: "exact" })
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(
          currentPage * postsPerPage,
          (currentPage + 1) * postsPerPage - 1
        );

      if (error) throw error;

      // Add post_type to each post for rendering
      const postsWithType = (data || []).map((post) => ({
        ...post,
        post_type: type,
      }));

      setPosts(postsWithType);
      setTotalPages(Math.ceil((count || 0) / postsPerPage));
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, postsPerPage, type]);

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
            key={post.id}
            id={post.id}
            title={post.title}
            location={post.location || "Location not specified"}
            price={type === "rent" ? post.rent_amount : post.price}
            postType={type}
            depositAmount={type === "rent" ? post.deposit_amount : undefined}
            imageUrl={post.image_url || "/placeholder-property.jpg"}
            onRequest={() => handleRequest(Number(post.id))}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {posts.length > 0 && (
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0 || loading}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {Math.max(1, totalPages)}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
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
