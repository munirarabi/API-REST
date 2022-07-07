const mysql = require("../mysql").pool;

exports.getAllRequests = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: erro });
    }

    conn.query(
      `SELECT requests.id_request,
                requests.quantity,
                products.id_product,
                products.name,
                products.price,
                products.image_product
              FROM requests
         INNER JOIN products
                  ON products.id_product = requests.id_product`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          requests: result.map((request) => {
            return {
              id_request: request.id_request,
              quantity: request.quantity,
              product: {
                id_product: request.id_product,
                name: request.name,
                price: request.price,
                image_product: process.env.URL_API + request.image_product,
              },
              request: {
                type: "GET",
                description: "Retorna os detalhes de um pedido específico",
                url: process.env.URL_API + request.id_request,
              },
            };
          }),
        };

        return res.status(200).send({ response });
      }
    );
  });
};

exports.postRequest = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `SELECT id_product, name, price FROM products WHERE id_product = ?`,
      [req.body.id_product],
      (error, result, field) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length == 0) {
          return res.status(404).send({
            message: "Produto não encontrado",
          });
        }

        conn.query(
          `INSERT INTO requests (id_product, quantity) VALUES (?,?)`,
          [req.body.id_product, req.body.quantity],
          // CALLBACK
          (error, result, field) => {
            conn.release(); //FECHANDO CONEXÃO

            if (error) {
              return res.status(500).send({ error: error });
            }

            const response = {
              message: "Pedido inserido com sucesso",
              requestCreated: {
                id_request: result.id_request,
                id_product: req.body.id_product,
                quantity: req.body.quantity,
                request: {
                  type: "GET",
                  description: "Retorna todos os pedidos",
                  url: process.env.URL_API,
                },
              },
            };

            return res.status(201).send(response);
          }
        );
      }
    );
  });
};

exports.getOneRequest = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `SELECT id_request, id_product, quantity FROM requests WHERE id_request = ?`,
      [req.params.id_request],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length == 0) {
          return res.status(404).send({
            message: "Não foi encontrado o pedido com esté ID",
          });
        }

        const response = {
          request: {
            id_request: result[0].id_request,
            id_product: result[0].id_product,
            quantity: result[0].quantity,
            request: {
              type: "GET",
              description: "Retorna todos os pedidos",
              url: process.env.URL_API,
            },
          },
        };

        return res.status(200).send(response);
      }
    );
  });
};

exports.deleteRequest = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `DELETE FROM requests WHERE id_request = ?`,
      [req.body.id_request],
      // CALLBACK
      (error, result, field) => {
        conn.release(); //FECHANDO CONEXÃO

        if (error) {
          return res.status(500).send({ error: error });
        }

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
              id_product: "Number",
              quantity: "Number",
            },
          },
        };

        return res.status(200).send(request);
      }
    );
  });
};
