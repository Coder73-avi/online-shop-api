const fs = require("fs");

exports.deleteImageError = (location) => {
  return fs.unlinkSync("public/" + location);
};
