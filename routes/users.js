const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users-controller");

router.post("/register", UsersController.postUserRegister);

router.post("/login", UsersController.postUserLogin);

module.exports = router;
