"use client";
import BottomNavbar from "@/components/BottomNavigation";
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col">
      <main className="overflow-y-scroll scrollbar-hide pb-24">{children}</main>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-gray-200">
        <BottomNavbar />
      </div>
    </div>
  );
}
