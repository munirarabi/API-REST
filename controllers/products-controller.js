const mysql = require("../mysql").pool;

exports.getAllProducts = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `SELECT id_product, name, price, image_product FROM products`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          quantity: result.length,
          products: result.map((prod) => {
            return {
              id_product: prod.id_product,
              name: prod.name,
              price: prod.price,
              image_product: prod.image_product,
              request: {
                type: "GET",
                description: "Retorna o produto especifico",
                url: process.env.URL_API + prod.id_product,
              },
            };
          }),
        };
        return res.status(200).send(response);
      }
    );
  });
};

exports.postProduct = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `INSERT INTO products (name, price, image_product) VALUES (?,?,?)`,
      [req.body.name, req.body.price, req.file.path],
      // CALLBACK
      (error, result, field) => {
        conn.release(); //FECHANDO CONEXÃO

        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          message: "Produto inserido com sucesso",
          productCreated: {
            id_product: result.id_product,
            name: req.body.name,
            price: req.body.price,
            image_product: req.file.path,
            request: {
              type: "GET",
              description: "Retorna todos os produtos",
              url: process.env.URL_API + "products",
            },
          },
        };

        return res.status(201).send(response);
      }
    );
  });
};

exports.getOneProduct = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `SELECT id_product, name, price, image_product FROM products WHERE id_product = ?`,
      [req.params.id_product],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
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
            image_product: result[0].image_product,
            request: {
              type: "GET",
              description: "Retorna os dados de todos os produtos",
              url: process.env.URL_API + "products",
            },
          },
        };

        return res.status(200).send(response);
      }
    );
  });
};

exports.patchProduct = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    console.log(req.file.path);
    conn.query(
      `UPDATE products SET name = ?, price = ?, image_product = ? WHERE id_product = ?`,
      [req.body.name, req.body.price, req.file.path, req.body.id_product],

      // CALLBACK
      (error, result, field) => {
        conn.release(); //FECHANDO CONEXÃO

        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          message: "Produto atualizado com sucesso",
          productUpdated: {
            id_product: req.body.id_product,
            name: req.body.name,
            price: req.body.price,
            image_product: req.file.path,
            request: {
              type: "PATCH",
              description: "Atualiza um produto",
              url: process.env.URL_API + "products/" + req.body.id_product,
            },
          },
        };

        return res.status(202).send(response);
      }
    );
  });
};

exports.deleteProduct = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `DELETE FROM products WHERE id_product = ?`,
      [req.body.id_product],
      // CALLBACK
      (error, result, field) => {
        conn.release(); //FECHANDO CONEXÃO

        if (error) {
          if (error.errno == 1451) {
            return res.status(500).send({
              error:
                "Esse produto está referenciado á alguma tabela, por isso não poderá ser deletado.",
            });
          }

          return res.status(500).send({ error: error });
        }

        if (result.affectedRows == 0) {
          return res.status(404).send({
            message: "Não foi encontrado o produto com esté ID",
          });
        }

        const response = {
          message: "Produto removido com sucesso",
          request: {
            type: "POST",
            description: "Insere um produto",
            url: process.env.URL_API + "/products",
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
};
