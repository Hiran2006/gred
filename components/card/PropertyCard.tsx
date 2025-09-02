"use client";
import Image from "next/image";
import { useState } from "react";

type PropertyCardProps = {
  id: string;
  title: string;
  location: string;
  price?: number;
  postType: 'rent' | 'sell';
  depositAmount?: number;
  imageUrl: string;
  onRequest?: () => void;
};

export default function PropertyCard({
  id,
  title,
  location,
  price,
  postType,
  depositAmount,
  imageUrl,
  onRequest,
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(!imageUrl);
  return (
    <div key={id} className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48 w-full bg-gray-100">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
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
        <div className="mt-3 flex justify-between items-center">
          <div>
            <div>
              <span className="text-sm text-gray-500">
                {postType === 'rent' ? 'Rent' : 'Price'}
              </span>
              <p className="text-lg font-bold text-blue-600">
                ₹{price?.toLocaleString()}
                {postType === 'rent' && (
                  <span className="text-sm font-normal text-gray-500">/month</span>
                )}
              </p>
              {postType === 'rent' && depositAmount && depositAmount > 0 && (
                <p className="text-sm text-gray-600">
                  Deposit: <span className="font-medium">₹{depositAmount.toLocaleString()}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onRequest}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
}
