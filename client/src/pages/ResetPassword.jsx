import React, { useState } from "react";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/v1/auth/reset-password/${token}`,
        data
      );

      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="bg-black/60 border border-gray-800 rounded-3xl p-10 w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-yellow-400 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-yellow-400" />
            <input
              type="password"
              name="password"
              placeholder="New Password"
              onChange={handleChange}
              className="w-full pl-10 py-3 bg-black/40 border border-gray-700 rounded-xl"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-yellow-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              onChange={handleChange}
              className="w-full pl-10 py-3 bg-black/40 border border-gray-700 rounded-xl"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-xl flex justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Reset Password <ArrowRight />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
