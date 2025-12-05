import React from "react";
import { User, Mail, Phone, Lock, Plus, UtensilsCrossed } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { register } from '../redux/authSlice.js';
import { useState } from "react";

const Register = () => {

    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted (UI only):', formData);
        dispatch(register(formData))
        navigate('/login')
    };



    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

            {/* Background Restaurant Image Overlay */}
            <div
                className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1500&q=80')] 
                bg-cover bg-center opacity-20"
            />

            {/* Overlay Blur Layer */}
            <div className="absolute inset-0 backdrop-blur-sm" />

            {/* Main Card */}
            <div className="relative bg-black/60 border border-gray-800 backdrop-blur-xl shadow-2xl text-white 
                rounded-3xl p-10 w-full max-w-3xl">

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
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-lg">
                        Create an Account
                    </h2>
                    <p className="text-gray-300 mt-2">
                        Join our dining community & enjoy exclusive restaurant rewards.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">

                    {/* 2-column inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Full Name */}
                        <div>
                            <label className="block mb-1 font-semibold text-gray-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 
                                    rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 font-semibold text-gray-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 
                                    rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Row - Phone + Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Phone */}
                        <div>
                            <label className="block mb-1 font-semibold text-gray-300">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 
                                    rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
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
                                    placeholder="Enter your password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 
                                    rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Min. 6 characters</p>
                        </div>

                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-1 font-semibold text-gray-300">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 
                                rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
                            />
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 accent-yellow-400" />
                        <p className="text-sm text-gray-300">
                            I agree to the <span className="text-yellow-400 cursor-pointer">Terms</span>
                            & <span className="text-yellow-400 cursor-pointer">Privacy Policy</span>
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-xl 
                        hover:bg-yellow-300 transition-all flex items-center justify-center gap-2 text-lg shadow-md"
                    >
                        <Plus size={20} />
                        Create Account
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-gray-300 mt-4">
                        Already have an account?{" "}
                        <Link to="/login">
                            <span className="text-yellow-400 font-semibold cursor-pointer hover:underline">
                                Sign in →
                            </span>
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Register;
