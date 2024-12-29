const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.json({
      message: "Token not found, Not Authorized",
      success: false,
    });
  }
  try {
    const decoded = jwt.verify(auth, process.env.SECRETKEY);
    console.log(decoded);
    req.email = decoded.email;
    next();
  } catch (err) {
    return res.json({
      message: "Token expired, Not Authorized",
      success: false,
    });
  }
};
