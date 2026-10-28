
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    axios,
    user,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  // Prepare cart products safely
  useEffect(() => {
    if (!products.length || !cartItems) {
      setCartArray([]);
      return;
    }

    const tempArray = [];

    for (const key in cartItems) {
      const product = products.find((item) => item._id === key);

      if (product) {
        tempArray.push({
          ...product,
          quantity: cartItems[key],
        });
      }
    }

    setCartArray(tempArray);
  }, [products, cartItems]);

  // Get saved addresses
  useEffect(() => {
    const getAddress = async () => {
      try {
        const { data } = await axios.get("/api/address/get");

        if (data.success) {
          setAddress(data.addresses || []);

          if (data.addresses?.length > 0) {
            setSelectedAddress(data.addresses[0]);
          }
        } else {
          toast.error(data.message || "Unable to load addresses");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load addresses"
        );
      }
    };

    if (user) {
      getAddress();
    }
  }, [user, axios]);

  // Place order
  const placeOrder = async () => {
    try {
      if (!user) {
        toast.error("Please log in to place an order");
        return;
      }

      if (cartArray.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      if (!selectedAddress) {
        toast.error("Please select an address");
        return;
      }

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", {
          items: cartArray.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
          address: selectedAddress._id,
        });

        if (data.success) {
          toast.success(data.message || "Order placed successfully");
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message || "Unable to place order");
        }
      } else {
        toast.error("Online payment is not configured here yet");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to place order"
      );
    }
  };

  if (!products.length || !cartItems) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      {/* Cart items */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">
            {cartCount()} Items
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3 min-w-0">
              <div
                onClick={() => {
                  navigate(
                    `/product/${product.category.toLowerCase()}/${product._id}`
                  );
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer shrink-0 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
              >
                <img
                  className="w-full h-full object-contain"
                  src={product.image?.[0]}
                  alt={product.name}
                  loading="lazy"
                  onError={(event) => {
                    console.error(
                      "Cart product image failed to load:",
                      event.currentTarget.src
                    );
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>

              <div className="min-w-0">
                <p className="hidden md:block font-semibold truncate text-gray-800">
                  {product.name}
                </p>

                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>

                  <div className="flex items-center gap-1">
                    <p>Qty:</p>
                    <select
                      onChange={(event) =>
                        updateCartItem(
                          product._id,
                          Number(event.target.value)
                        )
                      }
                      value={cartItems[product._id] || 1}
                      className="outline-none bg-transparent"
                    >
                      {Array(
                        Math.max(9, cartItems[product._id] || 1)
                      )
                        .fill("")
                        .map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center">
              ${(product.offerPrice * product.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => removeFromCart(product._id)}
              className="cursor-pointer mx-auto"
              aria-label={`Remove ${product.name} from cart`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                  stroke="#FF532E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#615fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </button>
      </div>

      {/* Order summary */}
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase">
            Delivery Address
          </p>

          <div className="relative flex justify-between items-start mt-2 gap-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                : "No Address Found"}
            </p>

            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer shrink-0"
            >
              Change
            </button>

            {showAddress && (
              <div className="absolute top-12 z-10 py-1 bg-white border border-gray-300 text-sm w-full shadow-md">
                {address.map((item) => (
                  <p
                    key={item._id}
                    onClick={() => {
                      setSelectedAddress(item);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item.street}, {item.city}, {item.state},{" "}
                    {item.country}
                  </p>
                ))}

                <p
                  onClick={() => navigate("/add-address")}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase mt-6">
            Payment Method
          </p>

          <select
            value={paymentOption}
            onChange={(event) => setPaymentOption(event.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>${totalCartAmount().toFixed(2)}</span>
          </p>

          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>

          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>
              ${((totalCartAmount() * 2) / 100).toFixed(2)}
            </span>
          </p>

          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>
              ${(totalCartAmount() + (totalCartAmount() * 2) / 100).toFixed(2)}
            </span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
        >
          {paymentOption === "COD"
            ? "Place Order"
            : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Cart;
