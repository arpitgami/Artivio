const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.signaturecontroller = (req, res) => {
  console.log("Request body: ", req.body);
  const { public_id, timestamp, upload_preset } = req.body;

  const paramsToSign = {
    public_id: public_id,
    timestamp: Math.floor(Date.now() / 1000),
    upload_preset: upload_preset,
  };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret
  );

  res.json({
    signature,
    timestamp,
    public_id,
    cloud_name: cloudinary.config().cloud_name,
    upload_preset: upload_preset,
  });
};
