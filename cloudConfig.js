const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();


// ✅ Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Configure Multer storage for Cloudinary
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "WanderLust",
//       allowed_formats: ["jpeg", "png", "jpg"], // valid formats
//       public_id: file.originalname.split(".")[0], // optional: save with original filename (without extension)
//     };
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "WanderLust",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

module.exports = { cloudinary, storage };
