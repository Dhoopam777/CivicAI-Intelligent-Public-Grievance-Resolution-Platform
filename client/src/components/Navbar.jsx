import React, { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="text-black w-full">
      {/* Top Offer Banner */}
      <div className="text-center font-semibold text-base md:text-lg py-2 bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-500">
        <p>
          Exclusive Price Drop! Hurry, <span className="underline underline-offset-2">Offer Ends Soon!</span>
        </p>
      </div>

      {/* Main Navbar */}
      <nav className="relative h-[70px] flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-transparent text-white transition-all shadow-none">
        {/* Logo */}
        <a href="/">
          <svg width="157" height="40" viewBox="0 0 157 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.904 28.28..." fill="#fff" />
            <path d="m8.75 11.3..." stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center text-lg font-medium space-x-14 md:pl-28">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Services</a></li>
          <li><a href="#" className="hover:underline">Portfolio</a></li>
          <li><a href="#" className="hover:underline">Pricing</a></li>
        </ul>

        {/* Desktop Button */}
        <button className="hidden md:inline border border-white text-white hover:bg-white hover:text-black ml-24 px-12 py-3 text-lg rounded-full active:scale-95 transition-all">
          Get started
        </button>

        {/* Mobile Menu Toggle */}
        <button
          aria-label="menu-btn"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="menu-btn inline-block md:hidden active:scale-90 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="white">
            <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-[70px] left-0 w-full bg-black bg-opacity-90 shadow-sm p-6 md:hidden">
            <ul className="flex flex-col space-y-5 text-lg font-medium">
              <li><a href="#" className="text-white">Home</a></li>
              <li><a href="#" className="text-white">Services</a></li>
              <li><a href="#" className="text-white">Portfolio</a></li>
              <li><a href="#" className="text-white">Pricing</a></li>
            </ul>

            <button type="button" className="border border-white text-white mt-6 text-lg font-medium hover:bg-white hover:text-black active:scale-95 transition-all w-44 h-12 rounded-full">
              Get started
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
