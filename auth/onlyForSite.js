exports.forSites = (req, res, next) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const auth = req.headers?.authorization;
    if (auth == "sameSite") return next();
    return res.status(400).json({ message: `is it not same sites` });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};
