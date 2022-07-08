const mysql = require("../mysql");

exports.getCategories = async (req, res, next) => {
  try {
    const insertQuery = `SELECT categoryId, name FROM categories;`;
    const result = await mysql.execute(insertQuery);

    const response = {
      length: result.length,
      categories: result.map((category) => {
        return {
          categoryId: category.categoryId,
          name: category.name,
        };
      }),
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const insertQuery = `INSERT INTO categories (name) VALUES (?);`;
    const result = await mysql.execute(insertQuery, [req.body.name]);

    const response = {
      message: "Categoria inserida com sucesso",
      createdCategory: {
        categoryId: result.categoryId,
        name: req.body.name,
        request: {
          type: "GET",
          description: "Retorna todas as categorias",
          url: process.env.URL_API + "categories",
        },
      },
    };

    return res.status(201).send(response);
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(409).send({
        message: "Categoria já cadastrada",
      });
    }

    return res.status(500).send({ error: error });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const insertQuery = `UPDATE categories
                              SET name = ?
                           WHERE categoryId = ?;`;
    const result = await mysql.execute(insertQuery, [
      req.body.name,
      req.body.categoryId,
    ]);

    if (result.affectedRows == 0) {
      return res.status(404).send({
        message: "Não foi encontrado nenhuma categoria com este ID",
      });
    }

    const response = {
      message: "Categoria atualizado com sucesso",
      productUpdated: {
        categoryId: req.body.categoryId,
        name: req.body.name,
        request: {
          type: "GET",
          description: "Retorna os detalhes dessa categoria especifica",
          url: process.env.URL_API + "categories/" + req.params.categoryId,
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const insertQuery = `DELETE FROM categories WHERE categoryId = ?;`;
    const result = await mysql.execute(insertQuery, [req.params.categoryId]);

    if (result.affectedRows == 0) {
      return res.status(404).send({
        message: "Não foi encontrada nenhuma categoria com esse ID",
      });
    }

    const response = {
      message: "Categoria removido com sucesso",
      request: {
        type: "POST",
        description: "Insere uma categoria",
        url: process.env.URL_API + "categories",
        body: {
          name: "String",
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
