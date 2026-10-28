
import Product from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "grocery-products", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

// Add product: /api/product/add-product
export const addProduct = async (req, res) => {
  try {
    const { name, price, offerPrice, description, category } = req.body;
    const files = req.files || [];

    if (
      !name ||
      price === undefined ||
      offerPrice === undefined ||
      !description ||
      !category ||
      files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including images are required",
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary is not configured on the server",
      });
    }

    const image = await Promise.all(files.map(uploadToCloudinary));

    const product = await Product.create({
      name,
      price: Number(price),
      offerPrice: Number(offerPrice),
      description,
      category,
      image,
    });

    return res.status(201).json({
      success: true,
      product,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add product or upload images",
    });
  }
};

// Get products: /api/product/list
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single product: /api/product/id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.query.id ? req.query : req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Change stock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Error in changeStock:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
