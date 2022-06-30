const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

// RETORNA TODOS OS PRODUTOS
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: erro });
    }

    conn.query(
      `SELECT id_product, name, price FROM products`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: erro });
        }
        const response = {
          quantity: result.length,
          products: result.map((prod) => {
            return {
              id_product: prod.id_product,
              name: prod.name,
              price: prod.price,
              request: {
                type: "GET",
                description: "Retorna todos os produtos",
                url: "http://localhost:3000/products/" + prod.id_product,
              },
            };
          }),
        };
        return res.status(200).send({ response });
      }
    );
  });
});

// INSERE UM PRODUTO
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: erro });
    }

    conn.query(
      `INSERT INTO products (name, price) VALUES (?,?)`,
      [req.body.name, req.body.price],
      // CALLBACK
      (error, result, field) => {
        conn.release(); //LIBERANDO CONEXÃO

        if (error) {
          return res.status(500).send({ error: erro });
        }

        const response = {
          message: "Produto inserido com sucesso",
          productCreated: {
            id_product: result.id_product,
            name: req.body.name,
            price: req.body.price,
            request: {
              type: "POST",
              description: "Insere um produto",
              url: "http://localhost:3000/products",
            },
          },
        };

        return res.status(201).send(response);
      }
    );
  });
});

// RETORNA OS DADOS DE UM PRODUTO
router.get("/:id_product", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: erro });
    }

    conn.query(
      `SELECT id_product, name, price FROM products WHERE id_product = ?`,
      [req.params.id_product],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: erro });
        }

        if (result.length == 0) {
          return res.status(404).send({
            message: "Não foi encontrado o produto com esté ID",
          });
        }

        const response = {
          product: {
            id_product: result[0].id_product,
            name: result[0].name,
            price: result[0].price,
            request: {
              type: "GET",
              description: "Retorna os dados de um produto específico",
              url: "http://localhost:3000/products",
            },
          },
        };

        return res.status(200).send(response);
      }
    );
  });
});

// ALTERA UM PRODUTO
router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: erro });
    }

    conn.query(
      `UPDATE products
          SET name = ?,
              price = ?
        WHERE id_product = ?`,
      [req.body.name, req.body.price, req.body.id_product],
      // CALLBACK
      (error, result, field) => {
        conn.release(); //LIBERANDO CONEXÃO

        if (error) {
          return res.status(500).send({ error: erro });
        }

        const response = {
          message: "Produto atualizado com sucesso",
          productUpdated: {
            id_product: req.body.id_product,
            name: req.body.name,
            price: req.body.price,
            request: {
              type: "PATCH",
              description: "Atualiza um produto",
              url: "http://localhost:3000/products/" + req.body.id_product,
            },
          },
        };

        return res.status(202).send(response);
      }
    );
  });
});

// EXCLUI UM PRODUTO
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: erro });
    }

    conn.query(
      `DELETE FROM products WHERE id_product = ?`,
      [req.body.id_product],
      // CALLBACK
      (error, result, field) => {
        conn.release(); //LIBERANDO CONEXÃO

        if (error) {
          return res.status(500).send({ error: erro });
        }

        const response = {
          message: "Produto removido com sucesso",
          request: {
            type: "POST",
            description: "Insere um produto",
            url: "http://localhost:300/products",
            body: {
              name: "String",
              price: "Number",
            },
          },
        };

        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
