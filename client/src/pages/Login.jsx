import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice.js";
import { Mail, Lock, ArrowRight, Loader2, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "../context/ToastContext.jsx";
const Login = () => {
    const dispatch = useDispatch();
    const toast=useToast()
    const { loading, error } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(data)).unwrap().then(() => {
            toast.success('Login successfully !')
            navigate('/')
        })
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

            {/* Background Restaurant Image */}
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1500&q=80')] 
                bg-cover bg-center opacity-20"
            />

            {/* Blur Layer */}
            <div className="absolute inset-0 backdrop-blur-sm" />

            {/* Login Card */}
            <div className="relative bg-black/60 backdrop-blur-xl text-white border border-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-md">
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
                {/* Heading */}
                <h2 className="text-3xl font-extrabold text-center tracking-wide text-yellow-400 drop-shadow-lg">
                    Welcome Back
                </h2>
                <p className="text-center text-gray-300 mt-2 mb-8">
                    Continue your dining experience 🍽️
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                            <span className="text-red-400 text-xs">!</span>
                        </div>
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-semibold text-gray-300">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-xl 
                                focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 font-semibold text-gray-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-xl 
                                focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
                            />
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-xl 
                        hover:bg-yellow-300 transition-all text-lg shadow-md
                        flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>


                </form>

                {/* Footer */}
                <p className="text-center text-gray-300 mt-6">
                    Don’t have an account?{" "}
                    <Link to="/register">
                        <span className="text-yellow-400 font-semibold cursor-pointer hover:underline">
                            Create one →
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
