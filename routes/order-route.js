const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order-controller");

// RETORNA TODOS OS PEDIDOS
router.get("/", orderController.getOrders);

// INSERE UM PEDIDO
router.post("/", orderController.postOrder);

// RETORNA OS DADOS DE UM PEDIDO
router.get("/:orderId", orderController.getOrderDetail);

// EXCLUI UM PEDIDO
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
