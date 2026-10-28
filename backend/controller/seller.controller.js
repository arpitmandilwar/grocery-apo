
import jwt from "jsonwebtoken";

// Seller login: /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email !== process.env.SELLER_EMAIL ||
      password !== process.env.SELLER_PASSWORD
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .cookie("sellerToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
      });
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Check seller authentication: /api/seller/is-auth
export const checkAuth = (req, res) => {
  return res.status(200).json({ success: true });
};

// Seller logout: /api/seller/logout
export const sellerLogout = (req, res) => {
  return res
    .clearCookie("sellerToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};
