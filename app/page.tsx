import Image from "next/image";
import logo from "@/public/logo.png";
import house from "@/public/house.png";
import Link from "next/link";
import {
  PlusCircleIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="flex justify-center items-center mt-8 mb-10">
        <Image src={logo} alt="logo" width={180} />
      </div>
      <div className="flex justify-center items-center w-full max-w-2xl px-4 mb-8 gap-4">
        <div className="flex-1">
          <div className="flex justify-between items-center rounded-3xl bg-amber-100 p-1 h-9 w-full">
            <input
              type="text"
              placeholder="Search"
              className="ml-3 placeholder:text-gray-500 bg-transparent outline-none w-full"
            />
            <MagnifyingGlassIcon className="w-6 text-gray-500 mr-1 flex-shrink-0" />
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="bg-gray-200 h-9 rounded-3xl flex items-center justify-center text-gray-500 px-4">
            <p>Location</p>
            <MapPinIcon className="w-5 h-5 ml-2 text-gray-500" />
          </div>
        </div>
      </div>
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
      <div className="fixed bottom-0 w-full bg-white border-t-4 border-gray-600 py-2 xl:hidden">
        <div className="max-w-screen-xl flex justify-evenly items-center">
          <Link href="/chat" className="flex flex-col items-center">
            <ChatBubbleLeftIcon className="w-15 text-black" />
          </Link>

          <Link href="/add" className="flex flex-col items-center">
            <PlusCircleIcon className="w-20 text-black" />
          </Link>

          <Link href="/settings" className="flex flex-col items-center">
            <Cog6ToothIcon className="w-15 text-black" />
          </Link>
        </div>
      </div>
    </div>
  );
}
