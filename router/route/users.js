const jwt = require("jsonwebtoken");
const { uid } = require("uid");
const { Encryption, bcryptCompaire } = require("../../controller/bycrpty");
const {
  Create,
  Select,
  Update,
} = require("../../databases/mysql/mysql-config");

exports.signIn = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    // validation
    const hashPwd = Encryption(req.body.password);
    req.body.password = hashPwd;
    const newObj = { id: uid(16), ...req.body };
    delete newObj.cpassword;
    console.log(newObj);

    await Create("users", newObj);
    res.status(201).json({ message: "Sign in successfully." });
  } catch (error) {
    res.status(400).json({ message: `Internal Sever error: ${error.message}` });
  }
};

exports.Login = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    // validation
    const { email, password } = req.body;
    const [getData, _] = await Select("users", "email=?", [email]);
    if (getData.length === 0)
      return res.status(404).json({ message: `Invalid User` });

    if (email === getData[0].email) {
      if (bcryptCompaire(password, getData[0].password)) {
        delete getData[0].password;
        const token = jwt.sign({ data: getData }, process.env.SECRETKEY, {
          expiresIn: "1d",
        });
        res.cookie("token", token, {
          httpOnly: true,
        });

        return res.status(200).json({ message: "Login successfully.", token });
      }
    }
    return res.status(400).json({ message: "Invalid User" });
  } catch (error) {
    res.status(400).json({ message: `Internal Sever error: ${error.message}` });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    // validation
    const { id } = req.params;
    let newObj = { ...req.body };
    const [getData, _] = await Select("users", "id=?", [id]);
    if (getData.length === 0)
      return res.status(404).json({ message: `Invalid User` });

    if (req.body.hasOwnProperty("password")) {
      if (bcryptCompaire(req.body.password, getData[0].password)) {
        req.body.password = Encryption(req.body.npassword);
        delete req.body.npassword;
        delete req.body.cpassword;
        newObj = { ...req.body };
      } else {
        return res.status(400).json({ message: `Unauthrized ACcount` });
      }
    }
    // console.log(newObj);
    await Update("users", newObj, "id", [id]);
    return res.status(200).json({ message: "Update successfully." });
  } catch (error) {
    res.status(400).json({ message: `Internal Sever error: ${error.message}` });
  }
};

exports.getUser = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });
    // validation
    const { id } = req.params;
    const [getData, _] = await Select("users", "id=?", [id]);
    if (getData.length === 0)
      return res.status(404).json({ message: `Invalid User` });

    delete getData[0].password;
    return res.status(200).json(getData);
  } catch (error) {
    res.status(400).json({ message: `Internal Sever error: ${error.message}` });
  }
};
