"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type PropertyCardProps = {
  id: string;
  title: string;
  location: string;
  price?: number;
  postType: "rent" | "sell";
  depositAmount?: number;
  imageUrl: string;
  createdAt?: string;
};

export default function PropertyCard({
  id,
  title,
  location,
  price,
  postType,
  depositAmount,
  imageUrl,
  createdAt,
}: PropertyCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/property/${id}`);
  };
  const [imageError, setImageError] = useState(true);
  const [imageSrc, setImageSrc] = useState<string>("");

  // Handle image URL validation and fallback
  useEffect(() => {
    if (!imageUrl) {
      setImageError(true);
      return;
    }

    try {
      // Try to create a URL object to validate the URL
      new URL(imageUrl);
      setImageSrc(imageUrl);
      setImageError(false);
    } catch {
      // If URL is invalid, use a fallback image
      setImageError(true);
    }
  }, [imageUrl]);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  return (
    <div
      key={id}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleCardClick}
    >
      <div className="relative h-48 w-full bg-gray-100">
        {!imageError && imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">No image available</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{location}</p>
        {formattedDate && (
          <p className="text-gray-500 text-xs mt-1">
            Posted on {formattedDate}
          </p>
        )}
        <div className="mt-3 flex justify-between items-center">
          <div>
            <div>
              <span className="text-sm text-gray-500">
                {postType === "rent" ? "Rent" : "Price"}
              </span>
              <p className="text-lg font-bold text-blue-600">
                ₹{price?.toLocaleString()}
                {postType === "rent" && (
                  <span className="text-sm font-normal text-gray-500">
                    /month
                  </span>
                )}
              </p>
              {postType === "rent" && depositAmount && depositAmount > 0 && (
                <p className="text-sm text-gray-600">
                  Deposit:{" "}
                  <span className="font-medium">
                    ₹{depositAmount.toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>
          <a
            href={`/property/${id}`}
            onClick={(e) => {
              e.stopPropagation();
              // Let the default navigation handle the click
            }}
            className="px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            More Info
          </a>
        </div>
      </div>
    </div>
  );
}
