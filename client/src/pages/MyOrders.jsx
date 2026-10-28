
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");

      if (data.success) {
        setMyOrders(data.orders || []);
      } else {
        toast.error(data.message || "Unable to fetch orders");
      }
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load orders"
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setMyOrders([]);
    }
  }, [user]);

  return (
    <div className="mt-12 pb-16 px-4 md:px-8">
      <div>
        <p className="text-2xl md:text-3xl font-medium">
          My Orders
        </p>
      </div>

      {myOrders.length === 0 ? (
        <p className="text-gray-500 mt-8">
          No orders found.
        </p>
      ) : (
        myOrders.map((order) => (
          <div
            key={order._id}
            className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
          >
            <div className="flex flex-col md:flex-row justify-between gap-2 mb-4 text-sm md:text-base">
              <span>
                Order ID: {order._id}
              </span>
              <span>
                Payment: {order.paymentType}
              </span>
              <span>
                Total Amount: ₹{order.amount}
              </span>
            </div>

            {order.items?.map((item, index) => {
              // Handle both populated product objects and missing products
              const product =
                item.product && typeof item.product === "object"
                  ? item.product
                  : null;

              const imageUrl = product?.image?.[0];

              return (
                <div
                  key={item._id || `${order._id}-${index}`}
                  className={`relative bg-white text-gray-800/70 ${
                    index !== order.items.length - 1
                      ? "border-b"
                      : ""
                  } border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 py-5 w-full`}
                >
                  <div className="flex items-center mb-2 md:mb-0">
                    <div className="p-2 rounded-lg">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product?.name || "Product"}
                          className="w-16 h-16 object-cover rounded"
                          onError={(event) => {
                            console.error(
                              "Order product image failed to load:",
                              imageUrl
                            );
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <h2 className="text-xl font-medium">
                        {product?.name || "Product unavailable"}
                      </h2>
                      <p>{product?.category || ""}</p>
                    </div>
                  </div>

                  <div className="text-base font-medium">
                    <p>Quantity: {item.quantity || 1}</p>
                    <p>Status: {order.status}</p>
                    <p>
                      Date:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <p className="text-lg">
                    Amount: ₹
                    {(
                      Number(product?.offerPrice || 0) *
                      Number(item.quantity || 1)
                    ).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
