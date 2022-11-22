const { uid } = require("uid");
const {
  Create,
  Select,
  Update,
  Count,
  Delete,
} = require("../../databases/mysql/mysql-config");
const multer = require("multer");
const { storage, imageFilter } = require("../../controller/multerStorage");
const { deleteImageFile } = require("../../controller/deleleImage");
const { getDataWithImages } = require("../../controller/getDataWithImages");

exports.uploadProductImage = multer({
  storage: storage("public/products"),
  fileFilter: imageFilter,
}).array("product-images");

exports.addProduct = async (req, res) => {
  try {
    if (req.method !== "POST")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const pid = uid(16);
    let newObj = {
      ...req.body,
      pid,
      create__date: new Date(),
      update__date: new Date(),
    };
    if (req.files.length !== 0) {
      req.files?.map(async (val) => {
        const name = val.filename;
        const originalname = val.originalname;
        const fileObj = {
          name,
          url: "products/" + name,
          product__id: pid,
          originalname,
        };
        // console.log(fileObj);
        await Create("product__images", fileObj);
      });
    }

    await Create("products__list", newObj);
    return res.status(201).json({ message: "Product add successfuly" });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: `Internal Server error: ${error.message}` });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.method !== "PATCH")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const pid = req.params?.id;
    if (req.files.length !== 0) {
      req.files?.map(async (val) => {
        const name = val.filename;
        const originalname = val.originalname;
        const fileObj = {
          name,
          url: "products/" + name,
          product__id: pid,
          originalname,
        };
        // console.log(fileObj);
        await Create("product__images", fileObj);
      });
    }

    await Update(
      "products__list",
      { ...req.body, update__date: new Date() },
      "pid=?",
      [pid]
    );
    return res
      .status(200)
      .json({ message: `Product update successfully, id: ${pid}` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getProducts = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    let offSet = 0;
    let noOfRecords = req.params?.noofproduct;

    if (req?.params?.hasOwnProperty("page")) {
      const { page } = req.params;
      offSet = Math.floor(noOfRecords * page - noOfRecords);
    }

    // for pagination
    const [count, __] = await Count("products__list");
    const paginationNum = Math.ceil(count[0].count / noOfRecords);

    // for get all data
    if (!req.params.hasOwnProperty("noofproduct")) {
      noOfRecords = count[0].count;
    }
    const getData = await getDataWithImages(
      req,
      {
        tablename: "products__list",
        where: null,
        data: null,
        orders: "create__date DESC",
        limit: { offSet, noOfRecords },
      },
      {
        imagetable: "product__images",
      }
    );

    if (getData?.length == 0)
      return res.status(404).json({ message: "Page not found" });

    return res.status(200).json({ getData, paginationNum });
  } catch (error) {
    return res
      .status(400)
      .json({ errors: `Internal Server error: ${error.message}` });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { pid } = req.params;
    const [getImages, _] = await Select("product__images", "product__id=?", [
      pid,
    ]);
    for (let i = 0; i < getImages.length; i++) {
      const id = getImages[i].id;
      await deleteImageFile(
        "product__images",
        id,
        "url",
        "public/products",
        "products/"
      );
      await Delete("product__images", "id=?", [id]);
    }

    await Delete("products__list", "pid=?", [pid]);
    return res.status(200).json({ message: `Delete successfully pid:${pid}` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Error: ${error.message}` });
  }
};

exports.totalProduct = async (req, res) => {
  try {
    const [count, _0] = await Count("products__list");
    return res.status(200).json({ count: count[0].count });
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getProductById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { pid } = req.params;
    const getData = await getDataWithImages(
      req,
      {
        tablename: "products__list",
        where: "pid=?",
        data: [pid],
        orders: null,
        limit: null,
      },
      {
        imagetable: "product__images",
      },
      true
    );
    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { category } = req.params;
    const getData = await getDataWithImages(
      req,
      {
        tablename: "products__list",
        where: "category=?",
        data: [category],
        orders: null,
        limit: null,
      },
      {
        imagetable: "product__images",
      },
      true
    );

    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.getProductImagesById = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { product__id } = req.params;
    const [getData, _] = await Select("product__images", "product__id=?", [
      product__id,
    ]);
    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.deteProductImage = async (req, res) => {
  try {
    if (req.method !== "DELETE")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { id } = req.params;
    await deleteImageFile(
      "product__images",
      id,
      "url",
      "public/products",
      "products/"
    );
    await Delete("product__images", "id=?", [id]);
    return res.status(200).json({ message: "Delete Succefully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};

exports.topSellingProduct = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getData, _0] = await Select("orders");

    const orders = getData.map((val) => ({
      product__id: val.product__id,
      qty: parseInt(val.qty),
    }));

    const newOrders = orders.reduce((finalArray, current) => {
      const obj = finalArray.find(
        (item) => item.product__id == current.product__id
      );

      if (obj) {
        const newObj = finalArray.map((item) => {
          const product__id = item.product__id;
          const qty = parseInt(item.qty);

          if (product__id == current.product__id) {
            item.qty = qty + parseInt(current.qty);
          }
          return item;
        });
        return newObj;
      }
      return finalArray.concat([current]);
    }, []);

    const result = newOrders.sort((a, b) => a - b);
    const products = [];
    for (let j = 0; j < result.length; j++) {
      const data = await getDataWithImages(
        req,
        {
          tablename: "products__list",
          where: "pid=?&&status=?",
          data: [result[j].product__id, "published"],
          orders: null,
          limit: null,
        },
        { imagetable: "product__images" }
      );
      products.push(...data);
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const [getImages, _0] = await Select("product__images");
    const hostUrl = "http://" + req.headers.host + "/";
    const allImages = [];

    for (let i = 0; i < getImages.length; i++) {
      const id = getImages[i]?.id;
      const product__id = getImages[i]?.product__id;
      const url = hostUrl + getImages[i]?.url;
      const originalname = getImages[i]?.originalname;

      allImages.push({ id, product__id, url, originalname });
    }

    return res.status(200).json(allImages);
  } catch (error) {
    return res.status(405).json({ message: `Error: ${error.message} ` });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { keywords } = req.params;
    const getData = await getDataWithImages(
      req,
      {
        tablename: "products__list",
        where: "title",
        data: null,
        orders: null,
        limit: null,
        like: `%${keywords}%`,
      },
      {
        imagetable: "product__images",
      }
    );

    return res.status(200).json(getData);
  } catch (error) {
    return res.status(400).json({ message: `Error: ${error.message}` });
  }
};

exports.getOnSaleProducts = async (req, res) => {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ message: `Method ${req.method} is not allowed` });

    const { pid } = req.params;
    const getData = await getDataWithImages(
      req,
      {
        tablename: "products__list",
        where: "on__sale=?",
        data: ["1"],
        orders: "create__date DESC",
        limit: null,
      },
      {
        imagetable: "product__images",
      },
      true
    );
    return res.status(200).json(getData);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server error: ${error.message}` });
  }
};
