import React from "react";
import { LogIn, UserPlus, User, Star, Gift, Shield, Clock, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux"
import { session } from "../redux/guestSlice";
import { useToast } from "../context/ToastContext";

const Welcome = () => {

    console.log(useParams());
    // /?key=value
    const [searchParams] = useSearchParams();
    const qrSlug = searchParams.get('qr');

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const toast = useToast()
    const handleContinueAsGuest = () => {
        dispatch(session({
            deviceId: "434bjdhk",
            qrSlug
        }))
            .unwrap()
            .then(() => {
                toast.success('Continue as Guest');
                navigate('/');
            })
            .catch(() => toast.error("Scan Table QR for continue as Guest"));
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

            {/* Background Restaurant Image */}
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80')] 
                bg-cover bg-center opacity-20"
            />

            <div className="absolute inset-0 backdrop-blur-sm" />

            <div className="relative bg-black/60 backdrop-blur-xl text-white border border-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">

                <h2 className="text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-lg">
                    Welcome To
                    {/* logo section */}
                    <div className="flex items-center gap-3 justify-center mt-4 mb-4 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                            <UtensilsCrossed className="w-6 h-6 text-gray-200" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">ElegantBites</h2>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                                Restaurant Management
                            </p>
                        </div>
                    </div>
                </h2>
                <p className="text-gray-300 mt-2 mb-10 text-lg">
                    Enjoy fine dining and exclusive offers 🍽️
                </p>

                {/* Buttons */}
                <div className="space-y-5">
                    <Link to='/login' className="block">
                        <button className="w-full flex items-center justify-center gap-3 bg-yellow-400 text-black py-3 rounded-xl text-lg font-semibold hover:bg-yellow-300 transition shadow-md">
                            <LogIn size={20} />
                            Login
                        </button>
                    </Link>

                    <Link to='/register' className="block">
                        <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-xl text-lg font-semibold hover:bg-gray-200 transition shadow-md">
                            <UserPlus size={20} />
                            Create Account
                        </button>
                    </Link>

                    <button
                        onClick={handleContinueAsGuest}
                        className="w-full flex items-center justify-center gap-3 bg-gray-800 text-gray-200 py-3 rounded-xl text-lg font-semibold border border-gray-700 hover:bg-gray-700 transition">
                        <User size={20} />
                        Continue as Guest
                    </button>

                </div>

                {/* ⭐ Why Join Us Section */}
                <div className="mt-12 text-left">
                    <h3 className="text-2xl font-semibold text-yellow-400 mb-4 text-center">
                        Why Join Us?
                    </h3>

                    <div className="grid grid-cols-2 gap-6">

                        {/* Fast Booking */}
                        <div className="flex flex-col items-center text-center">
                            <Clock className="w-8 h-8 text-yellow-400 mb-2" />
                            <p className="text-sm text-gray-300">Fast Booking</p>
                        </div>

                        {/* Special Rewards */}
                        <div className="flex flex-col items-center text-center">
                            <Gift className="w-8 h-8 text-yellow-400 mb-2" />
                            <p className="text-sm text-gray-300">Special Rewards</p>
                        </div>

                        {/* Premium Quality */}
                        <div className="flex flex-col items-center text-center">
                            <Star className="w-8 h-8 text-yellow-400 mb-2" />
                            <p className="text-sm text-gray-300">Premium Quality</p>
                        </div>

                        {/* Secure Experience */}
                        <div className="flex flex-col items-center text-center">
                            <Shield className="w-8 h-8 text-yellow-400 mb-2" />
                            <p className="text-sm text-gray-300">Secure Experience</p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Welcome;
