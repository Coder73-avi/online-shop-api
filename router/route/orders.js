const { uid } = require("uid");
const {
  Create,
  Select,
  MultipleRowCreate,
  Delete,
  Update,
} = require("../../databases/mysql/mysql-config");

exports.addOrder = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ message: `Method ${req.method} is not allwoed` });
    }
    const newData = req.body;
    const addMoreInfo = newData?.map((val) => {
      const id = uid(10);
      val.id = id;
      val.user__id = req.id;
      val.date = new Date();
      return val;
    });

    const keys = Object.keys(addMoreInfo[0]);
    const values = addMoreInfo.map((val) => Object.values(val));
    // console.log(req.id);
    await MultipleRowCreate("orders", keys, [values]);
    await Delete("checkout", "user__id=?", [req.body[0]?.user__id]);
    // return res.status(201).json({ keys, values });
    return res.status(201).json({ message: `Ordered successfully.` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: `Method ${req.method} is not allwoed` });
    }
    const [getData, _] = await Select("orders", null, null, "date DESC");

    const newOrders = getData.filter(
      (item, indx, self) =>
        indx === self.findIndex((t) => t.collection__id == item.collection__id)
    );

    const newData = [];
    for (let i = 0; i < newOrders.length; i++) {
      const [address, __0] = await Select("billing__address", "id=?", [
        newOrders[i].address__id,
      ]);
      const fullname = address[0].fullname;
      const location = address[0].city;
      newData.push({ ...newOrders[i], location, fullname });
    }

    return res.status(200).json(newData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getOrders = async (req, res) => {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: `Method ${req.method} is not allwoed` });
    }

    const [getData, _] = await Select("orders", "user__id=?", [req.id]);
    if (getData.length === 0)
      return res.status(404).json({ message: `Data not found` });

    let imageSrc, originalname;
    const newData = [];
    const url = "http://" + req.headers.host + "/";
    for (let i = 0; i < getData.length; i++) {
      const [image, _0] = await Select("product__images", "product__id=?", [
        getData[i].product__id,
      ]);
      if (image.length !== 0) {
        imageSrc = url + image[0].url;
        originalname = image[0].originalname;
      }
      newData.push({ ...getData[i], imageSrc, originalname });
    }
    return res.status(200).json(newData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ message: `Method ${req.method} is not allwoed` });
    }

    const { collectionid } = req.params;
    const [getData, _] = await Select("orders", "collection__id=?", [
      collectionid,
    ]);

    if (getData.length === 0)
      return res.status(404).json({ message: `Data not found` });

    let imageSrc, originalname;
    const newData = [];
    const url = "http://" + req.headers.host + "/";
    for (let i = 0; i < getData.length; i++) {
      const [image, _0] = await Select("product__images", "product__id=?", [
        getData[i].product__id,
      ]);
      if (image.length !== 0) {
        imageSrc = url + image[0].url;
        originalname = image[0].originalname;
      }
      newData.push({ ...getData[i], imageSrc, originalname });
    }

    return res.status(200).json(newData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.updateOrders = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allwoed` });

    const { collectionid } = req.params;
    const obj = req.body;
    await Update("orders", obj, "collection__id=?", [collectionid]);
    return res.status(200).json({ message: "Update Successfully !!" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getOrdersHistory = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    const noOfRecords = req.params?.totalpage;
    const [getData, _0] = await Select("orders", null, null, "date ASC", {
      offSet: 0,
      noOfRecords,
    });

    const newData = [];
    for (let i = 0; i < getData.length; i++) {
      const [address, __0] = await Select("billing__address", "id=?", [
        getData[i].address__id,
      ]);
      const fullname = address[0].fullname;
      const location = address[0].city;
      newData.push({ ...getData[i], location, fullname });
    }

    return res.status(200).json(newData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Error: ${error.message}` });
  }
};
