const { uid } = require("uid");
const {
  Create,
  Select,
  MultipleRowCreate,
  Delete,
} = require("../../databases/mysql/mysql-config");

const dataIns = [
  {
    product__id: "123",
    user__id: "123",
    title: "product 1",
    price: "12333",
    qty: "2",
    category: "a",
  },
  {
    product__id: "1234",
    user__id: "1234",
    title: "product 2",
    price: "12343",
    qty: "1",
    category: "b",
  },
  {
    product__id: "12345",
    user__id: "1234",
    title: "product 3",
    price: "12343",
    qty: "1",
    category: "b",
  },
];

exports.addOrder = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ message: `Method ${req.method} is not allwoed` });
    }
    const newData = req.body;
    const addMoreInfo = newData?.map((val) => {
      val.id = uid(16);
      val.date = new Date();
      return val;
    });

    const keys = Object.keys(addMoreInfo[0]);
    const values = addMoreInfo.map((val) => Object.values(val));

    await MultipleRowCreate("orders", keys, [values]);
    await Delete("checkout", "user__id", [req.body[0]?.user__id]);
    // return res.status(201).json({ keys, values });
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
