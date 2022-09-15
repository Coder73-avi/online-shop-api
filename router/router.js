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

module.exports = router;
