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
const { signIn, Login, updateUser, getUser } = require("./route/users");

const jwt = require("jsonwebtoken");
const { authLogin } = require("../auth/authLogin");
const {
  addCategory,
  uploadCategoryImage,
  updateCategory,
  getCategorys,
  getCategoryById,
  deleteCategory,
} = require("./route/category");

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
router.route("/signin").post(signIn);
router.post("/login", Login);
router.patch("/updateuser/:id", updateUser);
router.get("/getuser/:id", authLogin, getUser);

// categoryss
router.post("/addcategory", uploadCategoryImage, addCategory);
router.patch("/updatecategory/:id", uploadCategoryImage, updateCategory);
router.route("/categorys").get(getCategorys);
router.route("/category/:id").get(getCategoryById);
router.route("/deletecategory/:id").delete(deleteCategory);

// testing
router.get("/setcookie", (req, res) => {
  const token = jwt.sign(
    { name: "abhishek magar", age: 10 },
    process.env.SECRETKEY
  );
  res.cookie(`token`, token);
  res.send("Cookie have been saved successfully");
});

module.exports = router;
