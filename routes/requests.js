const express = require("express");
const router = express.Router();

const RequestsController = require("../controllers/requests-controller");

// RETORNA TODOS OS PEDIDOS
router.get("/", RequestsController.getAllRequests);

// INSERE UM PEDIDO
router.post("/", RequestsController.postRequest);

// RETORNA OS DADOS DE UM PEDIDO
router.get("/:id_request", RequestsController.getOneRequest);

// EXCLUI UM PEDIDO
router.delete("/", RequestsController.deleteRequest);

module.exports = router;
