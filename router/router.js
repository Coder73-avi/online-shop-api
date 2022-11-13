const express = require("express");
const url = require("url");
const {
  addOrder,
  getOrders,
  getOrderById,
  getAllOrders,
  updateOrders,
  getOrdersHistory,
} = require("./route/orders");
const router = express.Router();
const {
  getProducts,
  addProduct,
  uploadProductImage,
  getProductById,
  getProductImagesById,
  updateProduct,
  getProductsByCategory,
  deteProductImage,
  deleteProduct,
  totalProduct,
  topSellingProduct,
  getAllImages,
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
  deleteCheckOut,
} = require("./route/checkout");
const {
  addBillingAddress,
  updateBillingAddress,
  getBillingAddress,
  getBillingAddressById,
  getBillingAddressByUserId,
  activeBilingAddress,
  getActiveBillingAddress,
} = require("./route/billingaddress");
const {
  addWishlist,
  updateWishlist,
  getWishlists,
  getWishlistById,
  getWishlistsByUserId,
  deleteWishlist,
} = require("./route/wishlist");
const { createProduct, uploadTestImage } = require("./route/testroute");
const { productValidation } = require("../controller/produuctValidation");
const { getStaticData } = require("./route/staticData");
const { getSalesChartData } = require("./route/salesChartData");
const { forReviews } = require("./route/reviews");

// products
router.post("/addproduct", uploadProductImage, productValidation, addProduct);
// router.route("/getproducts").get(getProducts);
router.route("/getproducts").get(getProducts);
router.route("/getproducts/:noofproduct").get(getProducts);
router.route("/getproducts/:noofproduct/:page").get(getProducts);
router.get("/totalproduct", totalProduct);

router.route("/getproduct/:pid").get(getProductById);
router.patch(
  "/updateproduct/:id",
  productValidation,
  uploadProductImage,
  updateProduct
);
router.route("/deleteproduct/:pid").delete(deleteProduct);
router.route("/getproductimages/:product__id").get(getProductImagesById);
router.route("/getproductsbycategory/:category").get(getProductsByCategory);
router.route("/deleteproductimage/:id").delete(deteProductImage);
router.route("/topsellingproduct").get(topSellingProduct);
router.get("/getallimages", getAllImages);

// orders
router.post("/addorders", authUser, addOrder);
router.get("/getallorders", getAllOrders);
router.patch("/updateorders/:collectionid", updateOrders);
router.get("/getorders/", authLogin, getOrders);
router.route("/getorderscollection/:collectionid").get(getOrderById);
router.get("/getorderhistory/:totalpage", getOrdersHistory);

// users
router.route("/signup").post(signUp);
router.post("/login", Login);
router.patch("/updateuser/:id", updateUser);
router.get("/getusers", getUsers);
router.get("/getuser", authLogin, getUserById);
router.get("/getuser/:id", getUserById);
// router.get("/getuser/:id", authLogin, getUserById);
router.get("/logout", logOutUser);

// categoryss
router.post("/addcategory", uploadCategoryImage, addCategory);
router.patch("/updatecategory/:id", uploadCategoryImage, updateCategory);
router.route("/categorys").get(getCategorys);
router.route("/category/:id").get(getCategoryById);
router.route("/deletecategory/:id").delete(deleteCategory);

// checkout
router.post("/addcheckout", authUser, addCheckOut);
router.patch("/updatecheckout/:id", authUser, updateCheckOut);
router.get("/getcheckouts", authLogin, getCheckOuts);
router.get("/getcheckout/:id", authLogin, getCheckOutById);
router.get("/getcheckouts/:userid", authLogin, getCheckOutsByUserId);
router.delete("/deletecheckout/:id", authUser, deleteCheckOut);

// wishlist
router.post("/addwishlist", authUser, addWishlist);
router.patch("/updatewishlist", authUser, updateWishlist);
router.get("/getwishlists", authLogin, getWishlists);
router.get("/getwishlist/:id", authLogin, getWishlistById);
router.get("/getwishlists/:userid", authLogin, getWishlistsByUserId);
router.delete("/deletewishlist/:id", authUser, deleteWishlist);

// billing address
router.post("/addbillingaddress", authUser, addBillingAddress);
router.patch("/updatebillingaddress/:id", authUser, updateBillingAddress);
router.patch("/activebillingaddress/:id", authUser, activeBilingAddress);
router.get("/billingaddress", authLogin, getBillingAddress);
router.get("/billingaddress/:id", getBillingAddressById);
router.get("/getbillingaddress/:userid", authLogin, getBillingAddressByUserId);
router.get("/getactivebillingaddress", authLogin, getActiveBillingAddress);

// other routes
router.get("/getstaticdata", getStaticData);
router.get("/getordersdata", getSalesChartData);

// for product Reivews routes
router.get("/forreviews", authLogin, forReviews);

// testing

router.post("/testroute", uploadTestImage, productValidation, createProduct);

router.get("/setcookie", (req, res) => {
  const token = jwt.sign(
    { name: "abhishek magar", age: 10 },
    process.env.SECRETKEY
  );
  res.cookie(`token`, token, { maxAge: "500000", httpOnly: true });
  res.send("Cookie have been saved successfully");
});

router.get("/", (req, res) => {
  res.send("This is online shop api");
});

module.exports = router;
