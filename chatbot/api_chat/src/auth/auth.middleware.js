
const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 Gắn user vào req
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
