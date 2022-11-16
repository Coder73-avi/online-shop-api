const { uid } = require("uid");
const { getDataWithImages } = require("../../controller/getDataWithImages");
const {
  Select,
  Create,
  Update,
} = require("../../databases/mysql/mysql-config");

exports.addReviews = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    const { order__id } = req.body;
    const newObj = {
      ...req.body,
      user__id: req.id,
      date: new Date(),
      status: "published",
    };
    await Create("reviews", newObj);
    +(await Update("orders", { review: 1 }, "id=?&&user__id=?", [
      order__id,
      req.id,
    ]));
    // console.log(newObj);
    return res.status(201).json({ message: `Send successfully` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getReviews = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [data, _0] = await Select("reviews");

    const newData = [];
    for (let i = 0; i < data.length; i++) {
      const getData = await getDataWithImages(
        req,
        {
          tablename: "products__list",
          where: "pid=?",
          data: [data[i].product__id],
          orders: null,
          limit: null,
        },
        { imagetable: "product__images" }
      );

      newData.push({ ...data[i], product: getData[0] });
    }

    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getReviewForProduct = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { productid } = req.params;
    const [data, _0] = await Select("reviews", "product__id=?", [productid]);
    const newData = [];
    for (let i = 0; i < data.length; i++) {
      const [user, __0] = await Select("users", "id=?", [data[i].user__id]);
      const fullname = user[0].firstname + " " + user[0].lastname;

      newData.push({ ...data[i], fullname });
    }

    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [data, _0] = await Select("reviews", "user__id=?", [req.id]);

    const newData = [];
    for (let i = 0; i < data.length; i++) {
      const getData = await getDataWithImages(
        req,
        {
          tablename: "products__list",
          where: "pid=?",
          data: [data[i].product__id],
          orders: null,
          limit: null,
        },
        { imagetable: "product__images" }
      );

      newData.push({ ...data[i], product: getData[0] });
    }
    return res.status(200).json(newData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
