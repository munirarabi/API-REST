const mysql = require("../mysql");

exports.getAllProducts = async (req, res, next) => {
  try {
    const query = `SELECT productId, name, price, productImage 
                             FROM products;
    `;
    const result = await mysql.execute(query);

    const response = {
      length: result.length,
      products: result.map((prod) => {
        return {
          productId: prod.productId,
          name: prod.name,
          price: prod.price,
          productImage: prod.productImage,
          pathImages:
            process.env.URL_API + "products/" + prod.productId + "/images",
          request: {
            type: "GET",
            description: "Retorna  especifico",
            url: process.env.URL_API + "products/" + prod.productId,
          },
        };
      }),
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    let name = "";
    if (req.query.name) {
      name = req.query.name;
    }
    const query = `SELECT productId, name, price, productImage 
                             FROM products
                           WHERE categoryId = ?
                             AND (
                                 name LIKE '%${name}%'
                             );
    `;
    const result = await mysql.execute(query, [req.query.categoryId]);

    const query2 = `SELECT name FROM categories WHERE categoryId = ?`;

    const result2 = await mysql.execute(query2, [req.query.categoryId]);

    const response = {
      length: result.length,
      products: result.map((prod) => {
        return {
          productId: prod.productId,
          name: prod.name,
          price: prod.price,
          productImage: prod.productImage,
          pathImages:
            process.env.URL_API + "products/" + prod.productId + "/images",
          categoryId: req.query.categoryId,
          category: result2[0].name,
          request: {
            type: "GET",
            description: "Retorna  especifico",
            url: process.env.URL_API + "products/" + prod.productId,
          },
        };
      }),
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const insertQuery = `INSERT INTO products (name, price, productImage, categoryId) VALUES (?,?,?,?);`;
    const result = await mysql.execute(insertQuery, [
      req.body.name,
      req.body.price,
      req.file.path,
      req.body.categoryId,
    ]);

    const response = {
      message: "Produto inserido com sucesso.",
      productCreated: {
        productId: result.insertId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        categoryId: req.body.categoryId,
        request: {
          type: "GET",
          description: "Retorna todos os produtos",
          url: process.env.URL_API + "products",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    if (error.code == "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).send({
        message: "Não foi encontrado a categoria com esse ID.",
      });
    }

    if (error.code == "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
      return res.status(404).send({
        message: "Preencha todos os campos.",
      });
    }
    return res.status(500).send(console.error(error));
  }
};

exports.getProductDetail = async (req, res, next) => {
  try {
    const insertQuery = `SELECT productId, name, price, productImage FROM products WHERE productId = ?;`;
    const result = await mysql.execute(insertQuery, [req.params.productId]);
    console.log(result.length);

    if (result.length == 0) {
      return res.status(404).send({
        message: "Não foi encontrado o produto com este ID",
      });
    }

    const response = {
      product: {
        productId: result[0].productId,
        name: result[0].name,
        price: result[0].price,
        productImage: result[0].productImage,
        request: {
          type: "GET",
          description: "Retorna os dados de todos os produtos",
          url: process.env.URL_API + "products",
        },
      },
    };

    return res.status(200).send(response);
  } catch (error) {
    // console.error(result);
    return res.status(500).send({ error: error });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const insertQuery = `UPDATE products
                            SET name = ?,
                                price = ?
                         WHERE productId = ?;`;
    const result = await mysql.execute(insertQuery, [
      req.body.name,
      req.body.price,
      req.params.productId,
    ]);

    if (result.affectedRows == 0) {
      return res.status(404).send({
        message: "Não foi encontrado o produto com este ID",
      });
    }

    const response = {
      message: "Produto atualizado com sucesso",
      productUpdated: {
        productId: req.params.productId,
        name: req.body.name,
        price: req.body.price,
        request: {
          type: "GET",
          description: "Retorna os detalhes desse produto atualizado",
          url: process.env.URL_API + "products/" + req.params.productId,
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
    const insertQuery = `DELETE FROM products WHERE productId = ?;`;
    const result = await mysql.execute(insertQuery, [req.params.productId]);

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
        url: process.env.URL_API + "products",
        body: {
          name: "String",
          price: "Number",
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    if (error.code == "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).send({
        message: "Não foi encontrado nenhuma categoria com esté ID",
        categories: process.env.URL_API + "categories",
      });
    }

    return res.status(500).send({ error: error });
  }
};

exports.postImage = async (req, res, next) => {
  try {
    const insertQuery = `INSERT INTO productImages (productId, path) VALUES (?,?);`;
    const result = await mysql.execute(insertQuery, [
      req.params.productId,
      req.file.path,
    ]);

    const response = {
      message: "Imagem inserida com sucesso",
      createdImage: {
        productId: parseInt(req.params.productId),
        imageId: result.insertId,
        productImage: process.env.URL_API + req.file.path,
        request: {
          type: "GET",
          description: "Retorna todas as imagens",
          url:
            process.env.URL_API +
            "products/" +
            req.params.productId +
            "/images",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getImages = async (req, res, next) => {
  try {
    const insertQuery = `SELECT imageId, productId, path FROM productImages WHERE productId = ?;`;
    const result = await mysql.execute(insertQuery, [req.params.productId]);

    const response = {
      length: result.length,
      images: result.map((img) => {
        return {
          productId: parseInt(req.params.productId),
          imageId: img.imageId,
          path: process.env.URL_API + img.path,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
