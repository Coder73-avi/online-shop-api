const { Select } = require("../../databases/mysql/mysql-config");

exports.forReviews = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [reviewsData, _0] = await Select("orders", "user__id=?&&review=?", [
      req.id,
      "0",
    ]);
    return res.status(200).json(reviewsData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
