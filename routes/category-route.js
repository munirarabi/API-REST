const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const categoriesController = require("../controllers/category-controller");

router.get("/", categoriesController.getCategories);
router.post("/", login.required, categoriesController.createCategory);
router.patch("/", login.required, categoriesController.updateCategory);
router.delete("/:categoryId", login.required, categoriesController.deleteCategory);

module.exports = router;
