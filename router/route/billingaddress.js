const {
  Create,
  Update,
  Select,
} = require("../../databases/mysql/mysql-config");

exports.addBillingAddress = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const newObj = { ...req.body, user__id: req.id, status: "inactive" };

    await Create("billing__address", newObj);
    return res.status(201).json({ message: `Insert successfully` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.updateBillingAddress = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const updateObj = { ...req.body };
    await Update("billing__address", updateObj, "id=?", [req.params.id]);
    return res.status(200).json({ message: `Update successfully` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
exports.getBillingAddress = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _] = await Select("billing__address");
    return res.status(200).json(getData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getBillingAddressById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _] = await Select("billing__address", "id=?", [
      req.params.id,
    ]);
    return res.status(200).json(getData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
exports.getBillingAddressByUserId = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _] = await Select("billing__address", "user__id=?", [
      req.params.userid,
    ]);
    return res.status(200).json(getData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
