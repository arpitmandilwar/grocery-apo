
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyAddress } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    products,
    navigate,
    totalCartAmount,
    cartItems,
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
  const [placingOrder, setPlacingOrder] = useState(false);

  // Build the cart from products and quantities in context
  useEffect(() => {
    if (!products.length || !cartItems) {
      setCartArray([]);
      return;
    }

    const items = [];

    for (const id in cartItems) {
      const product = products.find((item) => item._id === id);

      if (product && cartItems[id] > 0) {
        items.push({
          ...product,
          quantity: cartItems[id],
        });
      }
    }

    setCartArray(items);
  }, [products, cartItems]);

  // Get saved delivery addresses
  useEffect(() => {
    const getAddress = async () => {
      try {
        if (user) {
          const { data } = await axios.get("/api/address/get");

          if (data.success) {
            setAddress(data.addresses || []);
            if (data.addresses?.length > 0) {
              setSelectedAddress(data.addresses[0]);
            }
          }
        } else {
          setAddress([dummyAddress]);
          setSelectedAddress(dummyAddress);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddress([dummyAddress]);
        setSelectedAddress(dummyAddress);
      }
    };

    getAddress();
  }, [user, axios]);

  // Place a Cash on Delivery order
  const placeOrder = async () => {
    if (!cartArray.length) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      setShowAddress(true);
      return;
    }

    if (paymentOption !== "COD") {
      toast.error("Online payment is not configured yet");
      return;
    }

    try {
      setPlacingOrder(true);

      const { data } = await axios.post("/api/order/cod", {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
      });

      if (data.success) {
        toast.success(data.message || "Order placed successfully");
        navigate("/my-orders");
      } else {
        toast.error(data.message || "Unable to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(
        error.response?.data?.message || "Failed to place order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price || 0).toFixed(2)}`;

  return (
    <div className="mt-16 px-4 md:px-8 lg:px-16">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Cart Items */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium mb-6">
            Shopping Cart
            <span className="text-sm text-primary ml-2">
              ({cartArray.length} items)
            </span>
          </h1>

          {cartArray.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-500 mb-4">
                Your cart is empty.
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-primary text-white px-6 py-2 rounded"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartArray.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 border-b border-gray-200 pb-4"
                >
                  {/* Cloudinary image URL used directly */}
                  <img
                    className="w-20 h-20 object-cover rounded"
                    src={product.image?.[0]}
                    alt={product.name}
                    onError={(event) => {
                      console.error(
                        "Failed to load product image:",
                        product.image?.[0]
                      );
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <h2 className="font-medium truncate">
                      {product.name}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {formatPrice(product.offerPrice)}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateCartItem(
                            product._id,
                            Math.max(1, product.quantity - 1)
                          )
                        }
                        disabled={product.quantity <= 1}
                        className="border px-2 rounded disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>

                      <span>{product.quantity}</span>

                      <button
                        onClick={() =>
                          updateCartItem(
                            product._id,
                            product.quantity + 1
                          )
                        }
                        className="border px-2 rounded"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(
                        product.offerPrice * product.quantity
                      )}
                    </p>

                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-red-500 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-80 border border-gray-200 rounded p-5 h-fit">
          <h2 className="text-xl font-medium mb-4">
            Order Summary
          </h2>

          {/* Delivery Address */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Delivery Address</p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-primary text-sm"
              >
                {showAddress ? "Cancel" : "Change"}
              </button>
            </div>

            {showAddress ? (
              <div className="space-y-3">
                {address.map((item, index) => (
                  <label
                    key={item._id || index}
                    className="flex gap-2 items-start cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={
                        selectedAddress?._id
                          ? selectedAddress._id === item._id
                          : selectedAddress === item
                      }
                      onChange={() => {
                        setSelectedAddress(item);
                        setShowAddress(false);
                      }}
                    />

                    <span className="text-sm">
                      {item.firstName} {item.lastName}
                      <br />
                      {item.street}, {item.city}
                      <br />
                      {item.state} - {item.zipcode}
                      <br />
                      {item.phone}
                    </span>
                  </label>
                ))}

                <button
                  onClick={() => navigate("/add-address")}
                  className="text-primary text-sm"
                >
                  + Add New Address
                </button>
              </div>
            ) : selectedAddress ? (
              <div className="text-sm text-gray-600">
                <p>
                  {selectedAddress.firstName}{" "}
                  {selectedAddress.lastName}
                </p>
                <p>
                  {selectedAddress.street}, {selectedAddress.city}
                </p>
                <p>
                  {selectedAddress.state} -{" "}
                  {selectedAddress.zipcode}
                </p>
                <p>{selectedAddress.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Please select a delivery address.
              </p>
            )}
          </div>

          {/* Payment Option */}
          <div className="mb-5">
            <p className="font-medium mb-2">Payment Method</p>

            <label className="flex items-center gap-2 text-sm mb-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentOption === "COD"}
                onChange={() => setPaymentOption("COD")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="payment"
                value="Online"
                checked={paymentOption === "Online"}
                onChange={() => setPaymentOption("Online")}
              />
              Online Payment
            </label>
          </div>

          {/* Price Details */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(totalCartAmount)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="flex justify-between font-medium text-lg border-t pt-3">
              <span>Total</span>
              <span>{formatPrice(totalCartAmount)}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={placingOrder || cartArray.length === 0}
            className="w-full bg-primary text-white py-3 rounded mt-5 disabled:opacity-50"
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
