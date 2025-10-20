"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/app/home/components/Header";
import BottomNavbar from "@/app/home/components/BottomNavigation";
import PropertyList from "@/app/home/components/PropertyList";

type TabType = "sell" | "rent";

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("sell");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Tab Navigation */}
      <div
        className={`sticky top-0 z-20 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center -mt-4 mb-4">
            <div className="inline-flex bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              {["sell", "rent"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as TabType)}
                  className={`relative px-6 py-3 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "text-white bg-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Property List */}
      <main className="max-w-7xl mx-auto px-6 py-8 min-h-70 bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <PropertyList type={activeTab} />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNavbar />
    </div>
  );
}
