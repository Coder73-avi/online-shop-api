const { uid } = require("uid");
const {
  Create,
  Select,
  Update,
} = require("../../databases/mysql/mysql-config");
const multer = require("multer");
const { storage, imageFilter } = require("../../controller/multerStorage");
const { deleteImageFile } = require("../../controller/deleleImage");

exports.uploadProductImage = multer({
  storage: storage("public/products"),
  fileFilter: imageFilter,
}).array("product-images");

exports.addProduct = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const id = uid(16);
    let newObj = { ...req.body, id, date: new Date() };
    if (req.files.length !== 0) {
      req.files?.map(async (val) => {
        const name = val.filename;
        const fileObj = { name, url: "products/" + name, product__id: id };
        console.log(fileObj);
        await Create("product__images", fileObj);
      });
    }

    await Create("products", newObj);
    return res.status(200).json({ message: "Product add successfuly" });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: `Internal Server error: ${error.message}` });
  }
};

exports.getProducts = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _] = await Select("products");
    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ errors: `Internal Server error: ${error.message}` });
  }
};

exports.getProductById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { id } = req.params;
    const [getData, _] = await Select("products", "id=?", [id]);
    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { id } = req.params;
    if (req.files.length !== 0) {
      req.files?.map(async (val) => {
        const name = val.filename;
        const fileObj = { name, url: "products/" + name, product__id: id };
        console.log(fileObj);
        await Create("product__images", fileObj);
      });
    }

    await Update("products", req.body, "id=?", [id]);
    return res
      .status(200)
      .json({ message: `Product update successfully, id: ${id}` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getProductImagesById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { product__id } = req.params;
    const [getData, _] = await Select("product__images", "product__id=?", [
      product__id,
    ]);
    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};
