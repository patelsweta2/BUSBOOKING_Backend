const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authentication token missing or invalid" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res
        .status(403)
        .json({ message: "You are not authorized to make request" });
    }
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "TokenExpired", message: "Token expired" });
    } else {
      return res.status(403).json({ message: "Authentication error" });
    }
  }
};

module.exports = authMiddleware;
