const mysql = require("../mysql");

exports.getAllProducts = async (req, res, next) => {
  try {
    const insertQuery = `SELECT id_product, name, price, image_product FROM products;`;
    const result = await mysql.execute(insertQuery);

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
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    const insertQuery = `INSERT INTO products (name, price, image_product) VALUES (?,?,?);`;
    const result = await mysql.execute(insertQuery, [
      req.body.name,
      req.body.price,
      req.file.path,
    ]);

    const response = {
      message: "Produto inserido com sucesso",
      productCreated: {
        id_product: result.insertId,
        name: req.body.name,
        price: req.body.price,
        image_product: req.file.path,
        request: {
          type: "GET",
          description: "Retorna todos os produtos",
          url: process.env.URL_API + "products/" + result.insertId,
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const insertQuery = `SELECT id_product, name, price, image_product FROM products WHERE id_product = ?;`;
    const result = await mysql.execute(insertQuery, [req.params.id_product]);

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
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.patchProduct = async (req, res, next) => {
  try {
    const insertQuery = `UPDATE products SET name = ?, price = ?, image_product = ? WHERE id_product = ?;`;
    await mysql.execute(insertQuery, [
      req.body.name,
      req.body.price,
      req.file.path,
      req.body.id_product,
    ]);

    const response = {
      message: "Produto atualizado com sucesso",
      productUpdated: {
        id_product: req.body.id_product,
        name: req.body.name,
        price: req.body.price,
        image_product: process.env.URL_API + req.file.path,
        request: {
          type: "PATCH",
          description: "Atualiza um produto",
          url: process.env.URL_API + "products/" + req.body.id_product,
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const insertQuery = `DELETE FROM products WHERE id_prodduct = ?;`;
    const result = await mysql.execute(insertQuery, [req.body.id_product]);

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
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
