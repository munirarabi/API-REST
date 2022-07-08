const express = require("express");
const router = express.Router();
const multer = require("multer");
const login = require("../middleware/login");

const productController = require("../controllers/product-controller");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (req, file, callback) {
    let data = new Date().toISOString().replace(/:/g, "-") + "-";
    callback(null, data + file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", productController.getProducts);

router.post(
  "/",
  login.required,
  upload.single("productImage"),
  productController.createProduct
);

router.get("/:productId", productController.getProductDetail);

router.patch(
  "/:productId",
  login.required,
  upload.single("productImage"),
  productController.updateProduct
);

router.delete(
  "/:productId",
  login.required,
  productController.deleteProduct
);

// IMAGES
router.post(
  "/:productId/image",
  login.required,
  upload.single("productImage"),
  productController.postImage
);

router.get("/:productId/images", productController.getImages);

module.exports = router;
