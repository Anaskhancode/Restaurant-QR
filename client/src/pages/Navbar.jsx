import React from "react";
import { UtensilsCrossed } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Left Logo Section */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                        <UtensilsCrossed className="w-6 h-6 text-gray-200" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">ElegantBites</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                            Restaurant Management
                        </p>
                    </div>
                </div>

                {/* Right Links */}
                {/* <div className="hidden md:flex items-center gap-8">
                    <button className="text-gray-300 hover:text-white transition text-sm">
                        Home
                    </button>
                    <button className="text-gray-300 hover:text-white transition text-sm">
                        Menu
                    </button>
                    <button className="text-gray-300 hover:text-white transition text-sm">
                        Reservations
                    </button>
                    <button className="text-gray-300 hover:text-white transition text-sm">
                        Contact
                    </button>

                    {/* Login Button */}
                    {/* <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition">
                        Login
                    </button> */}
                {/* </div> */} 

                {/* Mobile Menu Icon */}
                {/* <div className="md:hidden">
                    <button className="text-white">
                        ☰
                    </button>
                </div> */}

            </div>
        </nav>
    );
};

export default Navbar;
