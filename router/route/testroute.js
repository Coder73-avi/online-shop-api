const multer = require("multer");
const { storage, imageFilter } = require("../../controller/multerStorage");

exports.uploadTestImage = multer({
  storage: storage("public/test"),
  fileFilter: imageFilter,
}).array("product-images");

exports.createProduct = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: `Method ${req.method} is not allowed` });
  }

  const data = req.body;
  const files = req.files;

  console.log(data, files);

  return res.status(201).json({ data, files });
};
