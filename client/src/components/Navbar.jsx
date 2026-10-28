
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
        setOpen(false);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <nav className="relative z-50 flex items-center justify-between border-b border-gray-300 bg-white px-4 py-4 sm:px-6 md:px-16 lg:px-24 xl:px-32">
      <Link to="/" onClick={closeMenu}>
        <h2 className="text-2xl font-bold text-primary">
          Grocery App
        </h2>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden items-center gap-8 sm:flex">
        <Link to="/">Home</Link>
        <Link to="/products">All Products</Link>

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-full border border-gray-300 px-3 text-sm lg:flex">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-1.5 outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Desktop Cart */}
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
          aria-label="Shopping cart"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-xs text-white">
            {cartCount()}
          </span>
        </button>

        {/* Desktop User */}
        {user ? (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              alt="Profile"
              className="w-10"
            />
            <ul className="absolute right-0 top-10 z-50 hidden w-32 rounded-md border border-gray-200 bg-white py-2 text-sm shadow-lg group-hover:block">
              <li
                onClick={() => navigate("/my-orders")}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                Logout
              </li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setShowUserLogin(true)}
            className="rounded-full bg-indigo-500 px-8 py-2 text-white hover:bg-indigo-600"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Cart and Menu Button */}
      <div className="flex items-center gap-5 sm:hidden">
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
          aria-label="Shopping cart"
        >
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-xs text-white">
            {cartCount()}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="#426287"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="22" height="18" viewBox="0 0 21 15" fill="none">
              <rect width="21" height="1.5" rx=".75" fill="#426287" />
              <rect x="0" y="6" width="21" height="1.5" rx=".75" fill="#426287" />
              <rect x="0" y="13" width="21" height="1.5" rx=".75" fill="#426287" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-[55] flex w-full flex-col gap-1 border-b border-gray-200 bg-white px-5 py-3 text-sm shadow-xl sm:hidden">
          <Link
            onClick={closeMenu}
            to="/"
            className="rounded-md px-3 py-3 hover:bg-gray-100"
          >
            Home
          </Link>

          <Link
            onClick={closeMenu}
            to="/products"
            className="rounded-md px-3 py-3 hover:bg-gray-100"
          >
            All Products
          </Link>

          {user ? (
            <>
              <Link
                onClick={closeMenu}
                to="/my-orders"
                className="rounded-md px-3 py-3 hover:bg-gray-100"
              >
                My Orders
              </Link>
              <button
                onClick={logout}
                className="rounded-md px-3 py-3 text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                closeMenu();
                setShowUserLogin(true);
              }}
              className="rounded-md px-3 py-3 text-left hover:bg-gray-100"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
