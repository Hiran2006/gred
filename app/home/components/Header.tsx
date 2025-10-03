import Image from "next/image";
import { MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import ProfileDropdown from "../../../components/ui/ProfileDropdown";

export default function Header() {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white pb-16 md:pb-24">
      {/* Background Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-[url('/house.png')] bg-cover bg-center opacity-5"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-20">
        <div className="grid grid-cols-3 items-center w-full p-8">
          <div></div>
          <div className="flex justify-center">
            <Image src="/logo_white.png" alt="logo" width={180} height={50} />
          </div>
          <div className="flex justify-end">
            <ProfileDropdown />
          </div>
        </div>
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 pt-10 md:pt-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Find Your Dream Property
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-6">
              Discover the perfect property that matches your lifestyle and
              budget
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-2xl p-1 max-w-3xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by location, property, or address"
                    className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <button className="bg-black hover:bg-gray-800 text-white font-medium py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
