
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <section className="relative w-full overflow-hidden rounded-lg">
      {/* Desktop banner */}
      <img
        src={assets.main_banner_bg}
        alt="Fresh groceries and daily savings"
        className="hidden md:block w-full h-auto object-cover"
      />

      {/* Mobile banner */}
      <img
        src={assets.main_banner_bg_sm}
        alt="Fresh groceries and daily savings"
        className="block md:hidden w-full h-auto object-cover"
      />

      {/* Banner content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end md:items-start md:justify-center px-4 pb-6 sm:pb-8 md:pb-0 md:pl-12 lg:pl-24">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-center md:text-left max-w-[280px] sm:max-w-xs md:max-w-sm leading-tight">
          Freshness You Can Trust, Savings You Will Love!
        </h1>

        <div className="flex items-center justify-center gap-3 sm:gap-5 mt-4 sm:mt-5 md:mt-6 font-medium">
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 px-5 sm:px-6 md:px-7 py-2 sm:py-3 rounded-md text-white bg-primary text-sm sm:text-base"
          >
            Shop Now
            <img
              src={assets.white_arrow_icon}
              alt=""
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            to="/products"
            className="hidden md:flex items-center justify-center gap-2 px-7 py-3 rounded-md text-white bg-primary"
          >
            Explore Deals
            <img
              src={assets.white_arrow_icon}
              alt=""
              className="w-4 h-4"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Banner;
