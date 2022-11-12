const { uid } = require("uid");
const { getDataWithImages } = require("../../controller/getDataWithImages");
const {
  Create,
  Select,
  Count,
  Update,
  Delete,
} = require("../../databases/mysql/mysql-config");
exports.addCheckOut = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    // validation

    const [getData, _] = await Select(
      "checkout",
      "user__id=? && product__id=?",
      [req?.id, req.body?.product__id]
    );
    if (getData?.length !== 0) {
      const qty = parseInt(getData[0].qty) + parseInt(req.body?.qty);
      await Update("checkout", { qty }, "id=?", [getData[0].id]);
      return res.status(200).json({ message: "Update successfully" });
    }

    const id = uid(10);
    const obj = { id, ...req.body, user__id: req.id };

    await Create("checkout", obj);
    return res.status(201).json({ message: `Add successfully id: ${id}` });
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.updateCheckOut = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getCheckOuts = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _] = await Select("checkout", "user__id=?", [req.id]);

    const newData = [];

    for (let i = 0; i < getData.length; i++) {
      const data = await getDataWithImages(
        req,
        {
          tablename: "products__list",
          where: "pid=?",
          data: [getData[i].product__id],
          orders: null,
          limit: null,
        },
        { imagetable: "product__images" }
      );
      newData.push({
        ...data[0],
        product__option: getData[i].product__option,
      });
    }

    return res.status(200).json(newData);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getCheckOutById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { id } = req.params;
    const [getData, _] = await Select("checkout", "id=?&&user__id", [
      id,
      req.id,
    ]);
    return res.status(200).json(getData);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getCheckOutsByUserId = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { userid } = req.params;
    const [getData, _] = await Select("checkout", "user__id=?", [userid]);

    return res.status(200).json(getData);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.deleteCheckOut = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    await Delete("checkout", "id=?", [req.params?.id]);
    return res
      .status(200)
      .json({ message: `Delete Succesfully, Id: ${req.params?.id}` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
