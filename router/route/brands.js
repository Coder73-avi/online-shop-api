const multer = require("multer");
const { uid } = require("uid");
const { deleteImageFile } = require("../../controller/deleleImage");
const { imageFilter, storage } = require("../../controller/multerStorage");
const {
  Create,
  Select,
  Delete,
} = require("../../databases/mysql/mysql-config");

exports.uploadBrandImage = multer({
  storage: storage("public/brands"),
  fileFilter: imageFilter,
}).array("brand-logo");

exports.addBrands = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const file = req?.files[0];
    const logo = "brands/" + file?.filename;
    const originalname = file?.originalname;
    const obj = { id: uid(10), name: req.body.name, logo, originalname };

    await Create("brands", obj);
    return res.status(201).json({ message: "Add successfully" });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getBrands = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const host = "http://" + req.headers.host + "/";
    const [getData, _0] = await Select("brands");

    const newData = [];
    for (let i = 0; i < getData.length; i++) {
      const logo = host + getData[i].logo;
      newData.push({ ...getData[i], logo });
    }
    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const host = "http://" + req.headers.host + "/";
    const { id } = req.params;
    const [getData, _0] = await Select("brands", "id=?", [id]);

    const newData = [];
    for (let i = 0; i < getData.length; i++) {
      const logo = host + getData[i].logo;
      newData.push({ ...getData[i], logo });
    }
    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.deleteBrands = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { id } = req.params;

    await deleteImageFile("brands", id, "logo", "public/brands", "brands/");
    await Delete("brands", "id=?", [id]);

    return res.status(200).json({ message: `Delete Sucessfully. Id: ${id}` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
