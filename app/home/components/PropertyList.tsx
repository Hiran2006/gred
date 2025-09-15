"use client";
import { useEffect, useState, useCallback } from "react";
import PropertyCard from "./PropertyCard";
import supabase from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PropertyPost = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  rent_amount?: number;
  deposit_amount?: number;
  price?: number;
  image_urls: string[] | null;
  location: string | null;
  contact_number: string | null;
  created_at: string;
  post_type?: "rent" | "sell";
};

type PropertyListProps = {
  type: "rent" | "sell";
};

// Row shapes from Supabase for each table (minimal fields used here)
type RentPostRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  rent_amount: number | null;
  deposit_amount: number | null;
  image_urls: string[] | null;
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
  image_urls: string[] | null;
  location: string | null;
  contact_number: string | null;
  created_at: string;
};

export default function PropertyList({ type }: PropertyListProps) {
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
      setError(null);
      console.log(`Loading ${type} posts, page ${currentPage + 1}`);

      let data: RentPostRow[] | SellPostRow[] | null = null;
      let count: number | null = null;
      let error: unknown = null;
      let response;

      // Get current user ID if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      if (type === "rent") {
        let query = supabase
          .from("rent_posts")
          .select(
            "id, title, description, category, rent_amount, deposit_amount, image_urls, location, contact_number, created_at",
            { count: "exact" }
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(
            currentPage * postsPerPage,
            (currentPage + 1) * postsPerPage - 1
          );

        // Only add user_id filter if user is authenticated
        if (userId) {
          query = query.neq("user_id", userId);
        }

        response = await query;
      } else {
        let query = supabase
          .from("sell_posts")
          .select(
            "id, title, description, category, price, image_urls, location, contact_number, created_at",
            { count: "exact" }
          )
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .range(
            currentPage * postsPerPage,
            (currentPage + 1) * postsPerPage - 1
          );

        // Only add user_id filter if user is authenticated
        if (userId) {
          query = query.neq("user_id", userId);
        }

        response = await query;
      }

      data = response?.data || [];
      count = response?.count || 0;
      error = response?.error;

      console.log("Database response:", {
        data: data ? `Received ${data.length} items` : "No data",
        count,
        error: error ? "Error occurred" : "No error",
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      });

      if (error) {
        console.error("Database query error:", {
          message: error instanceof Error ? error.message : "Unknown error",
          name: error instanceof Error ? error.name : "No error name",
          stack: error instanceof Error ? error.stack : "No stack trace",
        });
        throw error;
      }

      console.log("Fetched data:", data);

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
          image_urls: row.image_urls,
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
          image_urls: row.image_urls,
          location: row.location,
          contact_number: row.contact_number,
          created_at: row.created_at,
          post_type: "sell",
        }));
      }

      setPosts(postsWithType);
      setTotalPages(Math.ceil((count || 0) / postsPerPage));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error in loadPosts:", {
        message: errorMessage,
        name: error instanceof Error ? error.name : "No error name",
        stack: error instanceof Error ? error.stack : "No stack trace",
        type,
        currentPage,
        postsPerPage,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      });

      setError(`Failed to load properties. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, postsPerPage, type]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

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
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${type}`}
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
            imageUrl={post.image_urls?.[0] || "/placeholder-property.jpg"}
            createdAt={post.created_at}
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
