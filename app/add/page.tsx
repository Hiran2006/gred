"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import ImagePreview from "@/components/ImagePreview";
import BottomNavbar from "@/components/nav bar/BottomNavigation";

export default function AddProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    listingType: "rent", // 'rent' or 'sell'
    price: "",
    pricePerDay: "",
    images: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).map((file) => {
      return URL.createObjectURL(file);
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files);
    if (e.target) {
      e.target.value = ""; // Reset input to allow selecting the same file again
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to save the property
    console.log("Form submitted:", formData);
    // For now, just navigate back to home
    router.push("/home");
  };

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="mb-15">
        <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Property Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter property name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Type
            </label>
            <div className="relative flex items-center justify-between w-48 h-12 bg-gray-100 rounded-full p-1">
              <span
                className={`absolute left-1 right-1/2 h-10 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
                  formData.listingType === "rent"
                    ? "translate-x-0"
                    : "translate-x-full"
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, listingType: "rent" }))
                }
                className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  formData.listingType === "rent"
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                For Rent
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, listingType: "sell" }))
                }
                className={`relative z-10 w-1/2 h-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                  formData.listingType === "sell"
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                For Sale
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter property description"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.listingType === "rent"
                ? "Rent (Monthly/Daily)"
                : "Selling Price"}
            </label>
            {formData.listingType === "rent" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Monthly"
                    required
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-xs">/month</span>
                  </div>
                </div>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Daily (Optional)"
                    min="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-xs">/day</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g. 5000000"
                  required
                  min="0"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
              accept="image/*"
              multiple
            />
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
            >
              <svg
                className="w-8 h-8 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Click to upload or drag and drop</span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 10MB
              </span>
            </div>
            <ImagePreview images={formData.images} onRemove={removeImage} />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={formData.images.length === 0}
            >
              {formData.images.length === 0
                ? "Add at least one image"
                : "Add Property"}
            </button>
          </div>
        </form>
      </div>
      <BottomNavbar />
    </div>
  );
}
