const { uid } = require("uid");
const { Create, Select } = require("../../databases/mysql/mysql-config");
exports.addCheckOut = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    // validation
    const id = uid(10);
    const obj = { id, ...req.body };

    await Create("checkout", obj);
    return res.status(201).json({ message: `Add successfuly id: ${id}` });
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

    const [getData, _] = await Select("checkout");
    return res.status(200).json(getData);
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
    const [getData, _] = await Select("checkout", "id=?", [id]);
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
