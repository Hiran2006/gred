import Image from "next/image";
import { MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <>
      <div className="flex justify-center items-center mt-8 mb-10">
        <Image src="/logo_black.png" alt="logo" width={180} height={50} />
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
    </>
  );
}
