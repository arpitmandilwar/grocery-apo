
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } =
    useAppContext();

  if (!product) return null;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleProductClick = () => {
    navigate(
      `/product/${product.category.toLowerCase()}/${product._id}`
    );
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleProductClick}
      className="w-full min-w-0 max-w-none sm:max-w-64 border border-gray-500/20 rounded-lg px-3 sm:px-4 py-3 bg-white cursor-pointer overflow-hidden"
    >
      {/* Product image */}
      <div className="group flex w-full h-32 sm:h-40 md:h-44 items-center justify-center overflow-hidden">
        <img
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          src={`${backendUrl}/images/${product.image?.[0]}`}
          alt={product.name}
          loading="lazy"
        />
      </div>

      {/* Product details */}
      <div className="mt-3 text-gray-500/70 text-sm">
        <p className="text-xs sm:text-sm truncate">
          {product.category}
        </p>

        <p className="mt-1 text-gray-800 font-medium text-sm sm:text-base truncate">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <img
                key={index}
                src={
                  index < 4
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt=""
                className="w-3 sm:w-3.5"
              />
            ))}
          <span className="ml-1 text-xs">(4)</span>
        </div>

        {/* Price and cart button */}
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="min-w-0">
            <p className="text-indigo-500 font-semibold text-sm sm:text-base whitespace-nowrap">
              ${product.offerPrice}
            </p>

            <p className="text-gray-500/60 text-xs line-through whitespace-nowrap">
              ${product.price}
            </p>
          </div>

          <div
            className="shrink-0 text-indigo-500"
            onClick={(event) => event.stopPropagation()}
          >
            {!cartItems?.[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 w-[62px] sm:w-20 h-9 rounded-md text-indigo-600 text-xs sm:text-sm font-medium cursor-pointer"
              >
                <img
                  src={assets.cart_icon}
                  alt=""
                  className="w-4 h-4 object-contain"
                />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1 sm:gap-2 w-[76px] sm:w-20 h-9 bg-indigo-500/25 rounded-md select-none">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="cursor-pointer px-2 h-full"
                  aria-label="Remove one from cart"
                >
                  -
                </button>

                <span className="w-4 text-center text-sm">
                  {cartItems[product._id]}
                </span>

                <button
                  onClick={() => addToCart(product._id)}
                  className="cursor-pointer px-2 h-full"
                  aria-label="Add one to cart"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
