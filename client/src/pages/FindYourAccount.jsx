import React, { useState } from "react";
import { Mail, ArrowRight, Loader2, UtensilsCrossed } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const FindYourAccount = () => {
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/forgot-password",
        { email }
      );

      toast.success(res.data.message);
      setEmail("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black p-6">

      {/* Background */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1500&q=80')]
        bg-cover bg-center opacity-20"
      />
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-black/60 backdrop-blur-xl text-white border border-gray-800 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-gray-200" />
          </div>
          <div>
            <h2 className="text-xl font-bold">ElegantBites</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Restaurant Management
            </p>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-yellow-400">
          Find Your Account
        </h2>
        <p className="text-center text-gray-300 mt-2 mb-8">
          Enter your registered email 📧
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-semibold text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-gray-700 rounded-xl 
                focus:ring-2 focus:ring-yellow-400 outline-none text-gray-200"
              />
            </div>
          </div>

          {/* Button */}
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
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-300 mt-6">
          Remember your password?{" "}
          <Link to="/login" className="text-yellow-400 font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default FindYourAccount;
