"use client";
import Image from "next/image";

type PropertyCardProps = {
  id: number;
  title: string;
  location: string;
  post_type: 'rent' | 'sell';
  imageUrl: string;
  onRequest?: () => void;
};

export default function PropertyCard({
  id,
  title,
  location,
  post_type,
  imageUrl,
  onRequest,
}: PropertyCardProps) {
  return (
    <div key={id} className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center text-gray-600 mb-4">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>{location}</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-4">
          For {post_type === 'rent' ? 'Rent' : 'Sale'}
        </div>
        <button
          onClick={onRequest}
          className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          REQUEST
        </button>
      </div>
    </div>
  );
}
