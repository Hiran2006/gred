"use client";

type PropertyTypeToggleProps = {
  listingType: string;
  onTypeChange: (type: "rent" | "sell") => void;
};

export const PropertyTypeToggle = ({ listingType, onTypeChange }: PropertyTypeToggleProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Listing Type
    </label>
    <div className="relative flex items-center justify-between w-48 h-12 bg-gray-100 rounded-full p-1">
      <span
        className={`absolute left-1 right-1/2 h-10 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
          listingType === "rent" ? "translate-x-0" : "translate-x-full"
        }`}
      />
      <button
        type="button"
        onClick={() => onTypeChange("rent")}
        className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
          listingType === "rent" ? "text-amber-600" : "text-gray-500"
        }`}
      >
        For Rent
      </button>
      <button
        type="button"
        onClick={() => onTypeChange("sell")}
        className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
          listingType === "sell" ? "text-amber-600" : "text-gray-500"
        }`}
      >
        For Sale
      </button>
    </div>
  </div>
);
