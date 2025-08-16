"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import ImagePreview from "@/components/ImagePreview";

export default function AddProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    listingType: "rent", // 'rent' or 'sell'
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = Array.from(files).map((file) => {
      return URL.createObjectURL(file);
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Images
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG (MAX. 5MB)</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                ref={fileInputRef}
              />
            </label>
          </div>

          {/* Image preview */}
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
  );
}
