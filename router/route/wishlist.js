const { uid } = require("uid");
const {
  Create,
  Select,
  Count,
  Update,
  Delete,
} = require("../../databases/mysql/mysql-config");
exports.addWishlist = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    // validation

    const id = uid(10);
    const obj = { id, ...req.body, user__id: req.id };

    await Create("wishlist", obj);
    return res.status(201).json({ message: `Add successfully id: ${id}` });
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};
exports.updateWishlist = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getWishlists = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _] = await Select("wishlist", "user__id=?", [req.id]);
    return res.status(200).json(getData);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};
exports.getWishlistById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { id } = req.params;
    const [getData, _] = await Select("wishlist", "id=?&&user__id=?", [
      id,
      req.id,
    ]);
    return res.status(200).json(getData);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getWishlistsByUserId = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { userid } = req.params;
    const [getData, _] = await Select("wishlist", "user__id=?", [userid]);

    return res.status(200).json(getData);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    await Delete("wishlist", "id", [req.params?.id]);
    return res
      .status(200)
      .json({ message: `Delete Succesfully, Id: ${req.params?.id}` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
