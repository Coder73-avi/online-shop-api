const {
  Create,
  Update,
  Select,
  Delete,
} = require("../../databases/mysql/mysql-config");
const multer = require("multer");
const { storage, imageFilter } = require("../../controller/multerStorage");
const { deleteImageFile } = require("../../controller/deleleImage");

exports.uploadCategoryImage = multer({
  storage: storage("public/categorysbg"),
  fileFilter: imageFilter,
}).single("imagesrc");

exports.addCategory = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ message: `Method ${req.method} is not allwoed` });
    }
    let imagesrc = "";
    const file = req.file;
    if (file) imagesrc = "categorysbg/" + file.filename;
    let newObj = { ...req.body, imagesrc, date: new Date() };
    // console.log(file, req.body);

    await Create("categorys", newObj);
    return res.status(201).json({ message: `Add successfully.` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { id } = req.params;

    let updateObj = { ...req.body };
    if (req.file) {
      deleteImageFile(
        "categorys",
        id,
        "imagesrc",
        "public/categorysbg",
        "categorysbg/"
      );
      updateObj = {
        ...updateObj,
        imagesrc: "categorysbg/" + req.file.filename,
      };
    }
    // console.log(updateObj, req.file);

    await Update("categorys", updateObj, "id=?", [id]);
    return res.status(200).json({ message: `Update successfully, id: ${id}` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getCategorys = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _] = await Select("categorys");

    const host = "http://" + req.headers.host + "/";
    const newData = getData.map((item) => {
      if (item.imagesrc !== "" && typeof item.imagesrc !== "object") {
        item.imagesrc = host + item.imagesrc;
      } else {
        item.imagesrc = "";
      }
      return item;
    });
    return res.status(200).json(newData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { id } = req.params;
    const [getData, _] = await Select("categorys", "id=?", [id]);

    const host = "http://" + req.headers.host + "/";
    const newData = getData.map((item) => {
      if (item.imagesrc !== "" && typeof item.imagesrc !== "object") {
        item.imagesrc = host + item.imagesrc;
      } else {
        item.imagesrc = "";
      }
      return item;
    });
    return res.status(200).json(newData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ mesage: `Method ${req.method} is not allowed` });

    const { id } = req.params;
    deleteImageFile(
      "categorys",
      id,
      "imagesrc",
      "public/categorysbg",
      "categorybg/"
    );
    await Delete("categorys", "id=?", [id]);
    res.status(200).json({ message: `Delete successfully.` });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Internal Problems error: ${error.mesage}` });
  }
};

exports.getTopSellingCategorys = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const [orders, _0] = await Select("orders");
    const categoryList = orders?.map((val) => val.category);
    const newObj = {};

    categoryList.forEach((name) => {
      return (newObj[name] = (newObj[name] || 0) + 1);
    });

    const newCategoryList = Object.keys(newObj).sort(
      (a, b) => newObj[b] - newObj[a]
    );

    return res.status(200).json(newCategoryList.slice(0, 6));
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
