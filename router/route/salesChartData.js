const { Select } = require("../../databases/mysql/mysql-config");
const moment = require("moment");

exports.getSalesChartData = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getOrders, _0] = await Select("orders");

    const chartData = [];
    for (let i = 0; i < getOrders.length; i++) {
      const date = moment.utc(new Date(getOrders[i]?.date)).format("MMM D");
      const price = getOrders[i].price;
      chartData.push({ date, price });
    }

    let result = chartData?.reduce((finalArray, current) => {
      let obj = finalArray?.find((item) => item.date == current.date);

      if (obj) {
        let newObj = finalArray?.map((item) => {
          if (item.date == current.date) {
            item.price = parseInt(item.price) + parseInt(current.price);
          }
          return item;
        });
        return newObj;
      }
      return finalArray.concat([
        { date: current.date, price: parseInt(current.price) },
      ]);
    }, []);

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Error: ${error.message}` });
  }
};
