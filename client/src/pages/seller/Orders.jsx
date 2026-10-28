```jsx
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { axios } = useContext(AppContext);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        toast.error(data.message || "Unable to fetch orders");
      }
    } catch (error) {
      console.error("Fetch seller orders error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load orders"
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order) => {
          const firstItem = order.items?.[0];

          const firstProduct =
            firstItem?.product &&
            typeof firstItem.product === "object"
              ? firstItem.product
              : null;

          const rawImage = firstProduct?.image?.[0];

          const imageUrl =
            typeof rawImage === "string" &&
            /^https?:\/\//i.test(rawImage)
              ? rawImage
              : "";

          return (
            <div
              key={order._id}
              className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
            >
              <div className="flex gap-5">
                {imageUrl ? (
                  <img
                    className="w-12 h-12 object-cover opacity-80 rounded"
                    src={imageUrl}
                    alt={firstProduct?.name || "Product"}
                    onError={(event) => {
                      console.error("Product image failed:", imageUrl);
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}

                <div className="flex flex-col justify-center gap-2">
                  {order.items?.map((item, index) => {
                    const product =
                      item.product &&
                      typeof item.product === "object"
                        ? item.product
                        : null;

                    return (
                      <p
                        key={item._id || `${order._id}-${index}`}
                        className="font-medium"
                      >
                        {product?.name || "Product unavailable"}{" "}
                        {item.quantity > 1 && (
                          <span className="text-indigo-500">
                            x {item.quantity}
                          </span>
                        )}
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="text-sm">
                <p className="font-medium mb-1">
                  {order.address?.firstName || ""}{" "}
                  {order.address?.lastName || ""}
                </p>
                <p>
                  {order.address?.street || ""},{" "}
                  {order.address?.city || ""},{" "}
                  {order.address?.state || ""},{" "}
                  {order.address?.zipcode || ""},{" "}
                  {order.address?.country || ""}
                </p>
              </div>

              <p className="font-medium text-base my-auto text-black/70">
                ₹{order.amount}
              </p>

              <div className="flex flex-col text-sm">
                <p>Method: {order.paymentType}</p>
                <p>
                  Date:{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
```