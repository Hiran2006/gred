"use client";
import Header from "@/components/nav bar/Header";
import BottomNavbar from "@/components/nav bar/BottomNavigation";
import PropertyList from "@/components/card/PropertyList";

export default function Home() {
  const handleRequestProperty = (id: number) => {
    console.log("Request property:", id);
    // Add your request logic here
  };

  return (
    <div className="flex flex-col items-center min-h-screen pb-20 overflow-scroll">
      <Header />
      <PropertyList onRequestProperty={handleRequestProperty} />
      <BottomNavbar />
    </div>
  );
}
