const mysql = require("../mysql");

exports.deleteImage = async (req, res, next) => {
  try {
    const insertQuery = `DELETE FROM productImages WHERE imageId = ?;`;
    const result = await mysql.execute(insertQuery, [req.params.imageId]);

    if (result.affectedRows == 0) {
      return res.status(404).send({
        message: "Não foi encontrado nenhuma imagem com esté ID",
      });
    }

    const response = {
      message: "Imagem removida com sucesso",
      request: {
        type: "POST",
        description: "Insere uma imagem",
        url: process.env.URL_API + "products/" + req.body.productId + "/image",
        body: {
          productId: "Number",
          path: "File",
        },
      },
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
