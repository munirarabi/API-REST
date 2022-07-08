const mysql = require("../mysql");

exports.getOrders = async (req, res, next) => {
  try {
    const insertQuery = `SELECT orders.orderId,
                                orders.quantity,
                                products.productId,
                                products.name,
                                products.price,
                                products.productImage
                          FROM orders
                    INNER JOIN products
                          ON products.productId = orders.productId;`;

    const result = await mysql.execute(insertQuery);

    const response = {
      orders: result.map((order) => {
        return {
          orderId: order.orderId,
          quantity: order.quantity,
          product: {
            productId: order.productId,
            name: order.name,
            price: order.price,
            // productImage: process.env.URL_API + order.productImage,
          },
          request: {
            type: "GET",
            description: "Retorna os detalhes de um pedido específico",
            url: process.env.URL_API + order.orderId,
          },
        };
      }),
    };

    return res.status(200).send({ response });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const insertQuery = `SELECT productId, name, price FROM products WHERE productId = ?;`;
    const result = await mysql.execute(insertQuery, [req.body.productId]);

    if (result.length == 0) {
      return res.status(404).send({
        message: "Produto não encontrado",
      });
    }

    const insertQuery2 = `INSERT INTO orders (productId, quantity) VALUES (?,?);`;
    const result2 = await mysql.execute(insertQuery2, [
      req.body.productId,
      req.body.quantity,
    ]);
    const response = {
      message: "Pedido inserido com sucesso",
      createdOrder: {
        orderId: result2.orderId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        request: {
          type: "GET",
          description: "Retorna todos os pedidos",
          url: process.env.URL_API + "orders",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getOrderDetail = async (req, res, next) => {
  try {
    const insertQuery = `SELECT orderId, productId, quantity FROM orders WHERE orderId = ?;`;
    const result = await mysql.execute(insertQuery, [req.params.orderId]);

    if (result.length == 0) {
      return res.status(404).send({
        message: "Não foi encontrado o pedido com esté ID",
      });
    }

    const response = {
      order: {
        orderId: result[0].orderId,
        productId: result[0].productId,
        quantity: result[0].quantity,
        request: {
          type: "GET",
          description: "Retorna todos os pedidos",
          url: process.env.URL_API,
        },
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const insertQuery = `DELETE FROM orders WHERE orderId = ?;`;
    const result = await mysql.execute(insertQuery, [req.body.orderId]);
    if (result.affectedRows == 0) {
      return res.status(404).send({
        message: "Não foi encontrado o pedido com esté ID",
      });
    }

    const request = {
      message: "Pedido removido com sucesso",
      request: {
        type: "POST",
        description: "Insere um pedido",
        url: process.env.URL_API,
        body: {
          productId: "Number",
          quantity: "Number",
        },
      },
    };

    return res.status(200).send(request);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
