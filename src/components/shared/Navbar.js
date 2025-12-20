"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold text-white tracking-wider">
              Learn<span className="text-yellow-400">R</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/courses" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Courses
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full hover:bg-yellow-300 transition-colors transform hover:scale-105">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-yellow-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-yellow-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-400">
              Home
            </Link>
            <Link href="/courses" className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-400">
              Courses
            </Link>
            <Link href="/about" className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-400">
              About Us
            </Link>
            <Link href="/contact" className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:text-yellow-400">
              Contact
            </Link>
            <button className="w-full text-left bg-yellow-400 text-black font-bold mt-4 px-3 py-2 rounded-md">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}