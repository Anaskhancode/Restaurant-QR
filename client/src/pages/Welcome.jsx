import React from "react";
import { LogIn, UserPlus, User } from "lucide-react";

const Welcome = () => {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

            {/* Background Restaurant Image */}
            <div 
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80')] 
                bg-cover bg-center opacity-20"
            />

            {/* Blur Layer */}
            <div className="absolute inset-0 backdrop-blur-sm" />

            {/* Welcome Card */}
            <div className="relative bg-black/60 backdrop-blur-xl text-white border border-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">

                {/* Heading */}
                <h2 className="text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-lg">
                    Welcome
                </h2>
                <p className="text-gray-300 mt-2 mb-10 text-lg">
                    Enjoy fine dining and exclusive offers 🍽️  
                </p>

                {/* Buttons */}
                <div className="space-y-5">

                    {/* Login */}
                    <button className="w-full flex items-center justify-center gap-3 bg-yellow-400 text-black py-3 rounded-xl text-lg font-semibold hover:bg-yellow-300 transition shadow-md">
                        <LogIn size={20} />
                        Login
                    </button>

                    {/* Register */}
                    <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl text-lg font-semibold hover:bg-gray-200 transition shadow-md">
                        <UserPlus size={20} />
                        Create Account
                    </button>

                    {/* Continue as Guest */}
                    <button className="w-full flex items-center justify-center gap-3 bg-gray-800 text-gray-200 py-3 rounded-xl text-lg font-semibold border border-gray-700 hover:bg-gray-700 transition">
                        <User size={20} />
                        Continue as Guest
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Welcome;
