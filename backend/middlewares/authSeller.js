
import jwt from "jsonwebtoken";

export const authSeller = (req, res, next) => {
  try {
    const sellerToken = req.cookies?.sellerToken;

    if (!sellerToken) {
      return res.status(401).json({
        success: false,
        message: "Seller session not found. Please log in again.",
      });
    }

    if (!process.env.JWT_SECRET || !process.env.SELLER_EMAIL) {
      console.error(
        "Missing JWT_SECRET or SELLER_EMAIL in backend environment variables."
      );

      return res.status(500).json({
        success: false,
        message: "Seller authentication is not configured on the server.",
      });
    }

    const decoded = jwt.verify(
      sellerToken,
      process.env.JWT_SECRET
    );

    if (
      !decoded.email ||
      decoded.email !== process.env.SELLER_EMAIL
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have seller permissions.",
      });
    }

    return next();
  } catch (error) {
    console.error("Seller authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired seller session. Please log in again.",
    });
  }
};
