const { Select } = require("../databases/mysql/mysql-config");
const fs = require("fs");

exports.deleteImageFile = async (
  tablename,
  id,
  table_col_name,
  dest,
  replaceName
) => {
  const [selectFile, _] = await Select(tablename, "id=?", [id]);
  const oldFilePath = selectFile[0][table_col_name];
  const imageList = fs.readdirSync(dest);
  if (oldFilePath !== null && oldFilePath !== undefined) {
    const findImageName = oldFilePath.replace(replaceName, "");
    if (imageList.includes(findImageName)) {
      return fs.unlinkSync("public/" + oldFilePath);
    }
  }
  return;
};
