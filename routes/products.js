const express = require("express");
const router = express.Router();
const multer = require("multer");
const login = require("../middleware/login");

const ProductsController = require("../controllers/products-controller");

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

// RETORNA TODOS OS PRODUTOS
router.get("/", ProductsController.getAllProducts);

// INSERE UM PRODUTO
router.post(
  "/",
  login.isNecesser,
  upload.single("image_product"),
  ProductsController.postProduct
);

// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_product", ProductsController.getOneProduct);

// ALTERA UM PRODUTO
router.patch(
  "/",
  login.isNecesser,
  upload.single("image_product"),
  ProductsController.patchProduct
);

// EXCLUI UM PRODUTO
router.delete("/", login.isNecesser, ProductsController.deleteProduct);

module.exports = router;
