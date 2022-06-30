const bodyParser = require("body-parser");
const express = require("express");
const router = express.Router();

// RETORNA TODOS OS PEDIDOS
router.get("/", (req, res, next) => {
  res.status(200).send({
    message: "Retorna os pedidos",
  });
});

// INSERE UM PEDIDO
router.post("/", (req, res, next) => {
  const request = {
    id_product: req.body.id_product,
    quantity: req.body.quantity,
  };

  res.status(201).send({
    message: "O pedido foi criado",
    pedidoCriado: request,
  });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get("/:id_request", (req, res, next) => {
  const id = req.params.id_request;

  res.status(200).send({
    message: "Detalhes do pedido",
    id_request: id,
  });
});

// EXCLUI UM PEDIDO
router.delete("/", (req, res, next) => {
  res.status(201).send({
    message: "Pedido excluido",
  });
});

module.exports = router;
