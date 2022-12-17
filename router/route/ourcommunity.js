const multer = require("multer");
const { uid } = require("uid");
const { deleteImageFile } = require("../../controller/deleleImage");
const { deleteImageError } = require("../../controller/deleteImageError");
const { storage } = require("../../controller/multerStorage");
const {
  Create,
  Update,
  Select,
  Delete,
} = require("../../databases/mysql/mysql-config");

exports.uploadCommunityPostImages = multer({
  storage: storage("public/ourcommunity"),
  // fileFilter: imageFilter,
}).array("community-post-images");

exports.addNewCommunityPost = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });
    const pid = uid(10);
    const status = "onreview";

    const obj = { pid, ...req.body, status, user__id: req.id };

    await Create("community__post", obj);

    if (req?.files.length !== 0) {
      for (let i = 0; i < req?.files?.length; i++) {
        const { originalname, filename } = req.files[i];
        const url = "ourcommunity/" + filename;
        const newObj = { product__id: pid, url, originalname };
        await Create("community__post__images", newObj);
      }
    }

    return res.status(201).json({ message: `Add successfully !!` });
  } catch (error) {
    if (req?.files?.length !== 0) {
      for (let i = 0; i < req?.files.length; i++) {
        const { filename } = req?.files[i];
        deleteImageError("ourcommunity/" + filename);
      }
    }
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.updateNewCommunityPost = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });
    const { pid } = req.params;

    if (req?.files.length !== 0) {
      for (let i = 0; i < req.files.length; i++) {
        const { originalname, filename } = req.files[i];
        const url = "/ourcommunity/" + filename;
        const newObj = { product__id: pid, url, originalname };
        await Create("community__post__images", newObj);
      }
    }

    const obj = { ...req.body };
    await Update("community__post", obj, "pid=?", [pid]);

    return res.status(200).json({ message: `Update successfully !!` });
  } catch (error) {
    if (req?.files?.length !== 0) {
      for (let i = 0; i < req?.files.length; i++) {
        const { filename } = req.files;
        deleteImageError("ourcommunity/" + filename);
      }
    }
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getNewCommunityPost = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    let where = "status=?";
    let data = [req.params?.status];

    if (req.params?.status == "all") {
      where = null;
      data = null;
    }

    if(req.params?.status == "user"){
      where = "status=? || status=?";
      data =["onsale", "sold"]
    }

    const newData = await getDataFun(req, res, where, data);

    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getCommunityPostByTbname = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });
    const tablename = req.params?.tbname;

    let where = `status!=?&&${tablename}=?`;
    let data = ["onreview", req.params?.value];

    if (req?.id) {
      where = `${tablename}=?`;
      data = [req.params?.value];
    }

    if (req.params?.status == "all") {
      where = null;
      date = null;
    }
    const newData = await getDataFun(req, res, where, data);
    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

const getDataFun = async (req, res, where, data) => {
  try {
    const [getData, _0] = await Select("community__post", where, data);

    const newData = [];
    const host = "http://" + req.headers.host + "/";
    for (let i = 0; i < getData.length; i++) {
      const { pid } = getData[i];
      const [getImages, _1] = await Select(
        "community__post__images",
        "product__id=?",
        [pid]
      );
      newData.push({ ...getData[i], imageSrc: getImages, host });
    }
    return newData;
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.deleteCommunityPost = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { pid } = req.params;
    const [getData, _0] = await Select(
      "community__post__images",
      "product__id=?",
      [pid]
    );

    for (let i = 0; i < getData.length; i++) {
      await deleteImageFile(
        "community__post__images",
        getData[i].id,
        "url",
        "public/ourcommunity",
        "ourcommunity/"
      );
      // await Delete("community__post__images", "id=?", [getData[i]]);
    }
    await Delete("community__post__images", "product__id=?", [pid]);
    await Delete("community__post", "pid=?", [pid]);

    return res.status(200).json({ message: `Delete Successfully !!!` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.deleteCommunityPostImage = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed !!!` });

    const { id } = req.params;
    await deleteImageFile(
      "community__post__images",
      id,
      "url",
      "public/ourcommunity",
      "ourcommunity/"
    );
    await Delete("community__post__images", "id=?", [id]);
    return res.status(200).json({ message: "Delete successfully !!" });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
