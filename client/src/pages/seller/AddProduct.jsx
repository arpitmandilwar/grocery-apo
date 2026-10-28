
import { useContext, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(AppContext);

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (index, file) => {
    setFiles((previous) => {
      const updatedFiles = [...previous];
      updatedFiles[index] = file || null;
      return updatedFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.some(Boolean)) {
      toast.error("Please upload at least one product image.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    if (Number(price) <= 0 || Number(offerPrice) <= 0) {
      toast.error("Please enter valid prices.");
      return;
    }

    if (Number(offerPrice) > Number(price)) {
      toast.error("Offer price cannot exceed product price.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);

    files.filter(Boolean).forEach((file) => {
      formData.append("image", file);
    });

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/product/add-product",
        formData
      );

      if (!data.success) {
        toast.error(data.message || "Could not add product.");
        return;
      }

      toast.success(data.message || "Product added successfully!");

      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setOfferPrice("");
      setFiles([]);
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      console.error("Add product failed:", {
        status,
        message,
      });

      if (status === 401) {
        toast.error(
          message ||
            "Seller authentication failed. Please log in again."
        );
      } else if (status === 403) {
        toast.error(
          message || "You do not have permission to add products."
        );
      } else {
        toast.error(
          message ||
            error.message ||
            "Failed to add product. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 md:py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-5 md:p-6"
      >
        <h1 className="text-xl font-semibold text-gray-800">
          Add New Product
        </h1>

        {/* Product Images */}
        <div>
          <p className="text-base font-medium">Product Images</p>
          <p className="mt-1 text-xs text-gray-500">
            Upload at least one image. You can select up to four.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <label
                key={index}
                htmlFor={`product-image-${index}`}
                className="cursor-pointer"
              >
                <input
                  id={`product-image-${index}`}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    handleImageChange(index, e.target.files?.[0])
                  }
                />

                <img
                  className="h-20 w-20 rounded-lg border border-gray-200 object-cover sm:h-24 sm:w-24"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt={`Upload product image ${index + 1}`}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            htmlFor="product-name"
          >
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product"
            className="resize-none rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            htmlFor="product-category"
          >
            Category
          </label>
          <select
            id="product-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-indigo-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((item, index) => (
              <option value={item.path} key={item.path || index}>
                {item.path}
              </option>
            ))}
          </select>
        </div>

        {/* Prices */}
        <div className="flex flex-wrap gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <label
              className="text-sm font-medium"
              htmlFor="product-price"
            >
              Product Price (₹)
            </label>
            <input
              id="product-price"
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <label
              className="text-sm font-medium"
              htmlFor="offer-price"
            >
              Offer Price (₹)
            </label>
            <input
              id="offer-price"
              type="number"
              min="0.01"
              step="0.01"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0.00"
              className="w-full rounded border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-indigo-500 px-8 py-3 font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? "Adding Product..." : "ADD PRODUCT"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
