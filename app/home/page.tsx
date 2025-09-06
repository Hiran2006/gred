"use client";
import { useState } from "react";
import Header from "@/app/home/components/Header";
import BottomNavbar from "@/app/home/components/BottomNavigation";
import PropertyList from "@/app/home/components/PropertyList";

type TabType = "buy" | "rent";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("buy");

  const handleRequestProperty = (id: number) => {
    console.log("Request property:", id);
    // Add your request logic here
  };

  return (
    <div className="flex flex-col items-center min-h-screen pb-20">
      <Header />

      {/* Attractive Tab Navigation */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab("buy")}
              className={`relative px-6 py-4 font-medium text-sm transition-all duration-300 ${
                activeTab === "buy"
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Buy
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform transition-all duration-300 ${
                  activeTab === "buy" ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
            <button
              onClick={() => setActiveTab("rent")}
              className={`relative px-6 py-4 font-medium text-sm transition-all duration-300 ${
                activeTab === "rent"
                  ? "text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Rent
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transform transition-all duration-300 ${
                  activeTab === "rent" ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "buy" ? (
          <PropertyList type="sell" onRequestProperty={handleRequestProperty} />
        ) : (
          <PropertyList type="rent" onRequestProperty={handleRequestProperty} />
        )}
      </div>

      <BottomNavbar />
    </div>
  );
}
