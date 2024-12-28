var jwt = require("jsonwebtoken");
exports.auth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.json({
      message: "Token not found, Not Authorized",
      success: false,
    });
  }
  try {
    // console.log(auth);
    // const token = auth.split("Bearer ")[1];
    // console.log(token);
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
