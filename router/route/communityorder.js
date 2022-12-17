const {
  Create,
  Select,
  Update,
} = require("../../databases/mysql/mysql-config");

exports.addCommunityOrder = async (req, res, next) => {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    }

    const [getAddress, __0] = await Select(
      "billing__address",
      "user__id=?&&status=?",
      [req.id, "active"]
    );
    let obj = {
      ...req.body,
      status: "processing",
      user__id: req?.id,
      address__id: getAddress[0].id,
    };
    await Create("community__orders", obj);
    await Update("community__post", { status: "sold" }, "pid=?", [
      obj.product__id,
    ]);

    return res.status(201).json({ message: "Order Send !!!" });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
