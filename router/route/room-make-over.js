const multer = require("multer");
const { deleteImageFile } = require("../../controller/deleleImage");
const { deleteImageError } = require("../../controller/deleteImageError");
const { storage } = require("../../controller/multerStorage");
const {
  Create,
  Update,
  Select,
} = require("../../databases/mysql/mysql-config");

exports.uploadImageOfRoomMakeOver = multer({
  storage: storage("public/room-make-over"),
}).single("file");

exports.roomMakeOver = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { filename, originalname } = req.file;
    const url = "room-make-over/" + filename;
    let obj = { url, originalname, ...req.body };

    await Create("room_make_over", obj);
    return res.status(201).json({ message: " added !!" });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.updateRoomMakeOver = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { type } = req.params;
    const { filename, originalname } = req.file;
    const url = "room-make-over/" + filename;
    let obj = { ...req.body, url, originalname };

    const [getData, _0] = await Select("room_make_over", "type=?", [type]);
    if (getData.length == 0) {
      return res.status(404).json({ message: "Data not found !!!" });
    }

    await deleteImageFile(
      "room_make_over",
      getData[0].id,
      "url",
      "public/room-make-over",
      "room-make-over/"
    );
    await Update("room_make_over", obj, "type=?", [type]);
    return res.status(200).json({ message: "Update Successfully" });
  } catch (error) {
    if (req.file?.filename) {
      deleteImageError("public/room-make-over/" + req.file?.filename);
    }
    console.log(error.message);
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getRoomMakeOver = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { type } = req.params;

    const [getData, _0] = await Select("room_make_over", "type=?", [type]);

    if (getData.length == 0) return res.status(200).json(getData);

    const host = "http://" + req.headers.host + "/";
    const newData = { ...getData[0], host };
    return res.status(200).json([newData]);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
