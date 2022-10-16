const { uid } = require("uid");
const { Create, Select } = require("../../databases/mysql/mysql-config");

exports.addOrder = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ message: `Method ${req.method} is not allwoed` });
    }

    let newObj = { ...req.body, id: uid(16), date: new Date() };
    await Create("orders", newObj);
    return res.status(201).json({ message: `Ordered successfully.` });
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

    const { userid } = req.params;
    const [getData, _] = await Select("orders", "user__id=?", [userid]);
    if (getData.length === 0)
      return res.status(404).json({ message: `Data not found` });
    return res.status(200).json(getData);
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

    const { id } = req.params;
    const [getData, _] = await Select("orders", "id=?", [id]);

    if (getData.length === 0)
      return res.status(404).json({ message: `Data not found` });
    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};
