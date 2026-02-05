"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Phone, MessageSquare, Mail } from "lucide-react";
import supabase from "@/lib/supabase/client";

type PropertyDetails = {
  user_id: string;
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  rent_amount: number | null;
  deposit_amount: number | null;
  price: number | null;
  image_urls: string[] | null;
  location: string | null;
  contact_number: string | null;
  created_at: string;
  post_type: "rent" | "sell";
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const onRequest = async () => {
    // You can implement the request info functionality here
    // For example, open a modal or navigate to a request form

    try {
      if (confirm("Are you sure you want to request info for this property?")) {
        // TODO: Implement request info functionality
        alert("Requesting info for property: " + params.id);
        const { data, error } = await supabase.from("rent_requests").insert({
          product_id: Number(params.id),
          request_by: (await supabase.auth.getUser()).data.user?.id,
          status: "pending",
        });

        if (error) {
          console.log(error);
        }
      }
    } catch (err) {
      console.error("Error requesting info:", err);
      alert("Failed to request info. Please try again.");
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("rent_posts")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          // Try sell_posts if not found in rent_posts
          const { data: sellData, error: sellError } = await supabase
            .from("sell_posts")
            .select("*")
            .eq("id", params.id)
            .single();

          if (sellError) throw sellError;
          setProperty({ ...sellData, post_type: "sell" });
        } else {
          setProperty({ ...data, post_type: "rent" });
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">{error || "Property not found"}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Listings</span>
        </button>
      </div>
    );
  }

  const displayPrice =
    property.post_type === "rent"
      ? `₹${property.rent_amount?.toLocaleString()}/month`
      : `₹${property.price?.toLocaleString()}`;

  const images = property.image_urls?.length
    ? property.image_urls
    : ["/placeholder-property.jpg"];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Listings</span>
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Image Gallery */}
        <div className="relative h-96 bg-gray-100">
          <Image
            src={images[currentImageIndex]}
            alt={property.title}
            fill
            className="object-cover"
            priority
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {property.title}
              </h1>
              <p className="text-gray-600 mt-1">{property.location}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {property.post_type === "rent" ? "Rent" : "Price"}
              </p>
              <p className="text-2xl font-bold text-blue-600">{displayPrice}</p>
              {property.post_type === "rent" && property.deposit_amount && (
                <p className="text-sm text-gray-600">
                  Deposit:{" "}
                  <span className="font-medium">
                    ₹{property.deposit_amount.toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {property.description || "No description provided."}
            </p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="flex items-center space-x-4 mt-6 flex-wrap gap-2">
              <a
                href={`tel:${property.contact_number}`}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1 sm:flex-none text-sm sm:text-base"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Call Now
              </a>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  router.push(`/chat?conversation=${params.id}`);
                }}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 sm:flex-none text-sm sm:text-base"
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Message
              </button>
              <button
                onClick={onRequest}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-1 sm:flex-none text-sm sm:text-base"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                Request
              </button>
            </div>
            {property.contact_number && (
              <p className="mt-2 text-sm text-gray-500 text-center">
                Contact: {property.contact_number}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
