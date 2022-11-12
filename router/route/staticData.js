const { Select, Count } = require("../../databases/mysql/mysql-config");

const totalRevenue = (data) => {
  return data?.reduce(
    (amount, item) => parseInt(item?.price * item.qty) + amount,
    0
  );
};

exports.getStaticData = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    let revenue, orders, views;

    const [getOrders, _0] = await Select("orders");
    revenue = totalRevenue(getOrders);

    const [totalOrders, _1] = await Count("orders");
    orders = totalOrders[0].count;

    

    return res.status(200).json({ revenue, orders, views });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Error: ${error.message}` });
  }
};
