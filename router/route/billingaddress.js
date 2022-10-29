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

exports.activeBilingAddress = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res.status.json({
        message: `Method ${req.method} is not allowed`,
      });
    const { id } = req.params;
    const [getData, _] = await Select("billing__address", "id=?", [id]);
    if (getData.length == 0)
      return res.status(404).json({ message: "Billing address not found!" });

    await Update("billing__address", { status: "inactive" }, "user__id=?", [
      req.id,
    ]);
    await Update("billing__address", { status: "active" }, "id=?", [id]);

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
      req.id,
    ]);
    return res.status(200).json(getData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getActiveBillingAddress = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const id = req.id;
    const [getData, _] = await Select("billing__address", "user__id=?", [id]);
    const activeAddress = getData.filter(
      (val) => val?.status?.toLowerCase() == "active"
    );
    return res.status(200).json(activeAddress);
  } catch (error) {
    return res.status(400).json({ message: `Error : ${error.message}` });
  }
};
