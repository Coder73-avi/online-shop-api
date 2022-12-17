const multer = require("multer");
const { deleteImageFile } = require("../../controller/deleleImage");
const { deleteImageError } = require("../../controller/deleteImageError");
const { storage, imageFilter } = require("../../controller/multerStorage");
const {
  Create,
  Update,
  Select,
} = require("../../databases/mysql/mysql-config");

exports.uploadBannerImage = multer({
  storage: storage("public/banners"),
  fileFilter: imageFilter,
}).single("banner");

exports.addBanner = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { filename, originalname } = req.file;
    const url = "banners/" + filename;
    let obj = { url, originalname, ...req.body };

    await Create("banners", obj);
    return res.status(201).json({ message: "Banner added !!" });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { type } = req.params;
    const { filename, originalname } = req.file;
    const url = "banners/" + filename;
    let obj = { ...req.boy, url, originalname };

    const [getData, _0] = await Select("banners", "type=?", [type]);
    if (getData.length == 0) {
      return res.status(404).json({ message: "Data not found !!!" });
    }

    await deleteImageFile(
      "banners",
      getData[0].id,
      "url",
      "public/banners",
      "banners/"
    );

    await Update("banners", obj, "type=?", [type]);
    return res.status(200).json({ message: "Update Successfully" });
  } catch (error) {
    if (req.file?.filename) {
      deleteImageError("public/banner/" + req.file?.filename);
    }
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getBanner = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { type } = req.params;

    const [getData, _0] = await Select("banners", "type=?", [type]);

    if (getData.length == 0) return res.status(200).json(getData);

    const host = "http://" + req.headers.host + "/";
    const newData = { ...getData[0], host };
    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
