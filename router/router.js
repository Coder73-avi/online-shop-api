const express = require("express");
const { addOrder, getOrders, getOrderById } = require("./route/orders");
const router = express.Router();
const {
  getProducts,
  addProduct,
  uploadProductImage,
  getProductById,
  getProductImagesById,
  updateProduct,
} = require("./route/products");
const {
  signUp,
  Login,
  updateUser,
  getUserById,
  getUsers,
  logOutUser,
} = require("./route/users");

const jwt = require("jsonwebtoken");
const { authLogin, authUser } = require("../auth/authLogin");
const {
  addCategory,
  uploadCategoryImage,
  updateCategory,
  getCategorys,
  getCategoryById,
  deleteCategory,
} = require("./route/category");
const {
  addCheckOut,
  updateCheckOut,
  getCheckOuts,
  getCheckOutById,
  getCheckOutsByUserId,
} = require("./route/checkout");
const {
  addBillingAddress,
  updateBillingAddress,
  getBillingAddress,
  getBillingAddressById,
  getBillingAddressByUserId,
} = require("./route/billingaddress");

// products
router.post("/addproduct", uploadProductImage, addProduct);
router.route("/getproducts").get(getProducts);
router.route("/getproduct/:id").get(getProductById);
router.patch("/updateproduct/:id", uploadProductImage, updateProduct);
router.route("/getproductimages/:product__id").get(getProductImagesById);

// orders
router.route("/addorders").post(addOrder);
router.route("/getorders/:userid").get(getOrders);
router.route("/getorder/:id").get(getOrderById);

// users
router.route("/signup").post(signUp);
router.post("/login", Login);
router.patch("/updateuser/:id", updateUser);
router.get("/getusers", getUsers);
router.get("/getuser", authLogin, getUserById);
// router.get("/getuser/:id", authLogin, getUserById);
router.get("/logout", logOutUser);

// categoryss
router.post("/addcategory", uploadCategoryImage, addCategory);
router.patch("/updatecategory/:id", uploadCategoryImage, updateCategory);
router.route("/categorys").get(getCategorys);
router.route("/category/:id").get(getCategoryById);
router.route("/deletecategory/:id").delete(deleteCategory);

// checkout
router.post("/addcheckout", addCheckOut);
router.patch("/updatecheckout", updateCheckOut);
router.get("/getcheckouts", getCheckOuts);
router.get("/getcheckout/:id", getCheckOutById);
router.get("/getcheckouts/:userid", getCheckOutsByUserId);

// billing address
router.post("/addbillingaddress", authUser, addBillingAddress);
router.patch("/updatebillingaddress/:id", authUser, updateBillingAddress);
router.get("/billingaddress", authLogin, getBillingAddress);
router.get("/billingaddress/:id", authLogin, getBillingAddressById);
router.get("/getbillingaddress/:userid", authLogin, getBillingAddressByUserId);

// testing
router.get("/setcookie", (req, res) => {
  const token = jwt.sign(
    { name: "abhishek magar", age: 10 },
    process.env.SECRETKEY
  );
  res.cookie(`token`, token);
  res.send("Cookie have been saved successfully");
});

router.get("/", (req, res) => {
  res.send("This is online shop api");
});

module.exports = router;
