"use client";
import { useEffect, useState, useCallback } from "react";
import PropertyCard from "./PropertyCard";
import supabase from "@/lib/supabase";
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
  type: "rent" | "sell";
  onRequestProperty?: (id: number) => void;
};

// Row shapes from Supabase for each table (minimal fields used here)
type RentPostRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  rent_amount: number | null;
  deposit_amount: number | null;
  image_url: string | null;
  location: string | null;
  contact_number: string | null;
  created_at: string;
};

type SellPostRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number | null;
  image_url: string | null;
  location: string | null;
  contact_number: string | null;
  created_at: string;
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

      let data: RentPostRow[] | SellPostRow[] | null = null;
      let count: number | null = null;
      let error: unknown = null;

      if (type === "rent") {
        const res = await supabase
          .from("rent_posts")
          .select(
            "id, title, description, category, rent_amount, deposit_amount, image_url, location, contact_number, created_at",
            { count: "exact" }
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(
            currentPage * postsPerPage,
            (currentPage + 1) * postsPerPage - 1
          );
        data = res.data;
        count = res.count;
        error = res.error;
      } else {
        const res = await supabase
          .from("sell_posts")
          .select(
            "id, title, description, category, price, image_url, location, contact_number, created_at",
            { count: "exact" }
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(
            currentPage * postsPerPage,
            (currentPage + 1) * postsPerPage - 1
          );
        data = res.data;
        count = res.count;
        error = res.error;
      }

      if (error) throw error;

      // Normalize rows into PropertyPost and add post_type
      let postsWithType: PropertyPost[] = [];
      if (type === "rent") {
        const rows = (data ?? []) as RentPostRow[];
        postsWithType = rows.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          rent_amount: row.rent_amount ?? undefined,
          deposit_amount: row.deposit_amount ?? undefined,
          price: undefined,
          image_url: row.image_url,
          location: row.location,
          contact_number: row.contact_number,
          created_at: row.created_at,
          post_type: "rent",
        }));
      } else {
        const rows = (data ?? []) as SellPostRow[];
        postsWithType = rows.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          category: row.category,
          rent_amount: undefined,
          deposit_amount: undefined,
          price: row.price ?? undefined,
          image_url: row.image_url,
          location: row.location,
          contact_number: row.contact_number,
          created_at: row.created_at,
          post_type: "sell",
        }));
      }

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
            createdAt={post.created_at}
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
