
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/seller/login",
        { email: email.trim(), password },
        { withCredentials: true }
      );

      if (data.success) {
        setIsSeller(true);
        setPassword("");
        toast.success(data.message || "Seller login successful!");
        navigate("/seller");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (error) {
      console.error(
        "Seller login error:",
        error.response?.status,
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to log in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isSeller) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 text-gray-600">
      <form
        onSubmit={handleSubmit}
        className="m-auto flex w-full max-w-sm flex-col items-start gap-4 rounded-lg border border-gray-200 bg-white p-8 py-10 shadow-xl"
      >
        <p className="m-auto text-2xl font-medium">
          <span className="text-indigo-500">Seller</span> Login
        </p>

        <div className="w-full">
          <label htmlFor="seller-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="seller-email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter seller email"
            className="mt-1 w-full rounded border border-gray-200 p-2 outline-indigo-500"
            type="email"
            autoComplete="username"
            required
          />
        </div>

        <div className="w-full">
          <label htmlFor="seller-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="seller-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter password"
            className="mt-1 w-full rounded border border-gray-200 p-2 outline-indigo-500"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-md bg-indigo-500 py-2 text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SellerLogin;
