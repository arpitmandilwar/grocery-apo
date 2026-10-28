
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export const AppContext = createContext(null);

// Configure the backend URL for local development and Vercel.
const backendURL = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "");

axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = true;

const getErrorMessage = (error) => {
  if (error.response) {
    return (
      error.response.data?.message ||
      `Server error: ${error.response.status}`
    );
  }

  if (error.request) {
    return "Network error. Please check your connection and try again.";
  }

  return error.message || "Something went wrong.";
};

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Check seller authentication.
  const fetchSeller = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(Boolean(data.success));
    } catch (error) {
      console.error("Seller authentication error:", error);
      setIsSeller(false);
    }
  }, []);

  // Fetch user authentication and cart.
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user?.cart || {});
      } else {
        setUser(null);
        setCartItems({});
      }
    } catch (error) {
      console.error("User authentication error:", error);
      setUser(null);
      setCartItems({});
    }
  }, []);

  // Fetch products from the deployed backend.
  const fetchProducts = useCallback(async () => {
    if (!backendURL) {
      console.error(
        "VITE_BACKEND_URL is missing. Configure it in Vercel."
      );
      toast.error("Backend URL is not configured.");
      return;
    }

    try {
      const { data } = await axios.get("/api/product/list");

      if (data.success) {
        setProducts(data.products || []);
      } else {
        console.error("Product API returned an error:", data);
        toast.error(data.message || "Unable to load products.");
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error(getErrorMessage(error));
    }
  }, []);

  // Add product to cart.
  const addToCart = (itemId) => {
    setCartItems((previous) => {
      const updated = { ...previous };
      updated[itemId] = (updated[itemId] || 0) + 1;
      return updated;
    });

    toast.success("Added to cart");
  };

  // Update cart quantity.
  const updateCartItem = (itemId, quantity) => {
    const safeQuantity = Math.max(0, Number(quantity) || 0);

    setCartItems((previous) => {
      const updated = { ...previous };

      if (safeQuantity === 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = safeQuantity;
      }

      return updated;
    });

    toast.success("Cart updated");
  };

  // Remove one quantity of a product.
  const removeFromCart = (itemId) => {
    setCartItems((previous) => {
      const updated = { ...previous };

      if (updated[itemId]) {
        updated[itemId] -= 1;

        if (updated[itemId] <= 0) {
          delete updated[itemId];
        }
      }

      return updated;
    });
  };

  // Count total cart items.
  const cartCount = () => {
    return Object.values(cartItems).reduce(
      (total, quantity) => total + (Number(quantity) || 0),
      0
    );
  };

  // Calculate total cart amount safely.
  const totalCartAmount = () => {
    return Math.floor(
      Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
        const product = products.find((item) => item._id === itemId);

        if (product && quantity > 0) {
          return total + quantity * (Number(product.offerPrice) || 0);
        }

        return total;
      }, 0) * 100
    ) / 100;
  };

  // Load initial data.
  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, [fetchSeller, fetchProducts, fetchUser]);

  // Sync cart with backend when the user is authenticated.
  useEffect(() => {
    if (!user) return;

    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {
          cartItems,
        });

        if (!data.success) {
          console.error("Cart update failed:", data);
          toast.error(data.message || "Unable to update cart.");
        }
      } catch (error) {
        console.error("Cart update error:", error);
        toast.error(getErrorMessage(error));
      }
    };

    updateCart();
  }, [cartItems, user]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
