"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo_black.png";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const actionWords = ["RENT", "SELL", "BUY", "REQUEST"];
  const barCount = 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 relative overflow-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full py-4 px-[9%] bg-white bg-opacity-80 backdrop-blur-sm shadow-sm flex justify-between items-center z-50 transition-opacity duration-500 ${
          isMounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-800">GRED.</h2>
        <ul className="flex gap-9">
          <li>
            <Link
              href="/login"
              className="text-lg font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-lg font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
        {/* Image Section */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mb-12 lg:mb-0 lg:mr-12">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto">
            <div className="absolute inset-0 rounded-full p-1 bg-white shadow-md">
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate-200 bg-white flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 animate-spin-slow"></div>
                <Image
                  src={logo}
                  alt="GRED"
                  width={300}
                  height={300}
                  className="relative z-10 w-4/5 h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-2xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-emerald-600">GRED</span>
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 h-12">
            You Can{" "}
            <span className="inline-block min-w-[120px] text-green-600">
              {actionWords.map((word, index) => (
                <span
                  key={index}
                  className={`absolute animate-typing text-emerald-700 font-semibold`}
                  style={{
                    animationDelay: `${index * 2}s`,
                    animationDuration: "8s",
                    animationIterationCount: "infinite",
                    opacity: 0,
                  }}
                >
                  {word}
                </span>
              ))}
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
            GRED is a dynamic online platform where anyone can buy, sell, or
            rent products with ease. Whether you're an individual with unused
            items or a creator looking to launch a store without any technical
            background, GRED gives you the freedom to build your own market,
            your own way.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <Link
              href="/login"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 text-lg shadow-md hover:shadow-lg"
            >
              GET STARTED
            </Link>

            <div className="flex space-x-4">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=storegred@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="Email"
              >
                <i className="bx bxl-gmail" />
              </a>
              <a
                href="https://www.instagram.com/gredstore.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="Instagram"
              >
                <i className="bx bxl-instagram" />
              </a>
              <a
                href="https://x.com/GREDSTORE?t=1qAPkm1wsQYn9kGo02I8VA&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="Twitter"
              >
                <i className="bx bxl-twitter" />
              </a>
              <a
                href="https://www.linkedin.com/company/gredstore/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-slate-600 hover:text-emerald-600 transition-colors"
                aria-label="LinkedIn"
              >
                <i className="bx bxl-linkedin" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
