const jwt = require("jsonwebtoken");

exports.authLogin = async (req, res, next) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { token } = req.cookies;
    const data = jwt.verify(token, process.env.SECRETKEY);
    req.id = data?.id;

    next();
  } catch (error) {
    return res.status(400).json({ message: `${error.message}` });
  }
};
exports.authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const data = jwt.verify(token, process.env.SECRETKEY);
    req.id = data?.id;

    next();
  } catch (error) {
    return res.status(400).json({ message: `${error.message}` });
  }
};
