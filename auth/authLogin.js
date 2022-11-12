const jwt = require("jsonwebtoken");

exports.authLogin = async (req, res, next) => {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ message: `Method ${req.method} is not allowed` });
  }
  // console.log(req.cookies);

  return this.authUser(req, res, next);
};

exports.authUser = async (req, res, next) => {
  try {
    const { auth } = req.cookies;
    const data = jwt.verify(auth, process.env.SECRETKEY);
    req.id = data?.id;

    next();
  } catch (error) {
    return res.status(400).json({ message: `${error.message}` });
  }
};

exports.authAdmin = async (req, res, next) => {
  try {
  } catch (error) {
    return res.status(400).json({ message: `${error.message}` });
  }
};
