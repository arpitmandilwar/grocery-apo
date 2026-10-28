
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
        message: "Invalid credentials",
        success: false,
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({
        message: "Server configuration error",
        success: false,
      });
    }

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).cookie("sellerToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
