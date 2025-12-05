import React, { useState } from "react";
import { UtensilsCrossed, LogOut, Menu, X } from "lucide-react";

const Navbar = () => {

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="w-full bg-black/80 backdrop-blur-xl border-b border-gray-800 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Left Logo Section */}
                <div className="flex items-center gap-3 cursor-pointer">
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

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <button className="text-gray-300 hover:text-white transition text-sm">Home</button>
                    <button className="text-gray-300 hover:text-white transition text-sm">Menu</button>
                    <button className="text-gray-300 hover:text-white transition text-sm">Reservations</button>
                    <button className="text-gray-300 hover:text-white transition text-sm">Contact</button>

                    {/* Logout Button */}
                    <button className="flex items-center gap-2 bg-gray-800 text-gray-200 px-4 py-2 rounded-lg 
hover:bg-gray-700 transition mx-auto border border-gray-700">
                        <LogOut className="w-4 h-4" />
                        Log out
                    </button>
                </div>

                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    <button
                        className="text-white"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

            </div>

            {/* Mobile Menu Drawer */}
            {mobileOpen && (
                <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-gray-700 mt-4 py-4 px-6 space-y-4 animate-fadeIn">
                    <button className="block text-left text-gray-300 hover:text-white transition text-base">Home</button>
                    <button className="block text-left text-gray-300 hover:text-white transition text-base">Menu</button>
                    <button className="block text-left text-gray-300 hover:text-white transition text-base">Reservations</button>
                    <button className="block text-left text-gray-300 hover:text-white transition text-base">Contact</button>

                    <div className="pt-2">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm w-fit">
                            <LogOut className="w-5 h-5" />
                            Log out
                        </button>
                    </div>
                </div>
            )}

        </nav>
    );
};

export default Navbar;
