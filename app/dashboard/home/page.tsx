"use client";
import { useEffect } from "react";
import cookieStore from "js-cookie";
import queryString from "query-string";
import { useRouter } from "next/navigation";
import Image from "next/image";
import house from "@/public/house.png";
import BottomNavigation from "@/components/BottomNavigation";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const access_token = queryString.parse(window.location.hash)
        .access_token as string;
      if (access_token != "") {
        cookieStore.set("token", access_token);
      } else {
        router.push("/login");
      }
    })();
  }, [router]);
  return (
    <div className="flex flex-col items-center min-h-screen pb-20">
      <Header />
      <div className="w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Property Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={house}
                alt="House 1"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-emerald-500 text-white px-4 py-1 rounded-full">
                  FOR RENT
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-semibold mb-2">Property Name</h3>
              <div className="flex items-center text-gray-600 mb-4">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Location Name</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-4">
                $PRICE
              </div>
              <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                REQUEST
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
