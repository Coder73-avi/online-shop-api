const multer = require("multer");
const path = require("path");

exports.storage = (dest) => {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const videoType = [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".webm"];
      const name = file.fieldname;
      const newDate = Date.now();
      const extn = path.extname(file.originalname);
      let filename = name + newDate + extn;
      if (videoType.includes(extn.toLowerCase())) {
        filename = "main-ads-video" + extn;
      }
      return cb(null, filename);
    },
  });
};

exports.imageFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|gif|webp|tif|png|tif|tiff|bmp|esp|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  return cb(
    `Error: Upload Image file only (jpg, jpeg, gif, webp, tif, png, tif,tiff, bmp, esp, svg)`
  );
};
