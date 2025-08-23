"use client";
import Header from "@/components/Header";
import BottomNavbar from "@/components/BottomNavigation";
import PropertyList from "@/components/PropertyList";

export default function Home() {
  const handleRequestProperty = (id: string) => {
    console.log("Request property:", id);
    // Add your request logic here
  };

  return (
    <div className="flex flex-col items-center min-h-screen pb-20">
      <Header />
      <PropertyList onRequestProperty={handleRequestProperty} />
      <BottomNavbar />
    </div>
  );
}
