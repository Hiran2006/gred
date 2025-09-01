"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavbar from "@/components/nav bar/BottomNavigation";
import { FormField, PropertyTypeToggle, ImageUploader } from "./components";

export default function AddProperty() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    listingType: "rent" as "rent" | "sell",
    price: "",
    images: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (files: FileList) => {
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    router.push("/home");
  };

  const handleTypeChange = (type: "rent" | "sell") => {
    setFormData((prev) => ({
      ...prev,
      listingType: type,
      price: "", // Reset price when changing listing type
    }));
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Add New Property
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-lg shadow-sm p-4 sm:p-6"
        >
          <FormField
            label="Property Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter property name"
            required
          />

          <PropertyTypeToggle
            listingType={formData.listingType}
            onTypeChange={handleTypeChange}
          />

          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter property description"
            rows={4}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.listingType === "rent"
                ? "Rent (Monthly)"
                : "Selling Price"}
            </label>
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
                placeholder={
                  formData.listingType === "rent"
                    ? "e.g. 15000"
                    : "e.g. 5000000"
                }
                required
                min="0"
              />
              {formData.listingType === "rent" && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-xs">/month</span>
                </div>
              )}
            </div>
          </div>

          <ImageUploader
            onImageChange={handleImageChange}
            onRemoveImage={handleRemoveImage}
            images={formData.images}
          />

          <div className="pt-4 border-t border-gray-200 mt-6">
            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 text-sm sm:text-base font-medium"
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
