const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createuser = async (req, res, next) => {
  try {
    const users = req.body.users.map((user) => [
      user.email,
      bcrypt.hashSync(user.password, 10),
    ]);

    insertQuery = `INSERT INTO users (email, password) VALUES ?;`;
    const results = await mysql.execute(insertQuery, [users]);

    const response = {
      message: "Usuário criado com sucesso",
      createdUsers: req.body.users.map((user) => {
        return { email: user.email };
      }),
    };

    return res.status(201).send(response);
  } catch (error) {
    if (error.code == "ER_DUP_ENTRY") {
      return res.status(409).send({
        message: "Esse usuário já existe",
      });
    }

    return res.status(500).send({ error: error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const insertQuery = `SELECT userId, email, password FROM users WHERE email = ?;`;
    const result = await mysql.execute(insertQuery, [req.body.email]);

    if (result.length < 1) {
      return res.status(401).send({ message: "Falha na autenticação" });
    }

    const idUser = result[0].userId;
    const emailUser = result[0].email;

    bcrypt.compare(req.body.password, result[0].password, (error, result) => {
      if (error) {
        return res.status(401).send({ message: "Falha na autenticação" });
      }

      if (result) {
        const token = jwt.sign(
          {
            userId: idUser,
            email: emailUser,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "9999 years",
          }
        );

        return res.status(200).send({
          message: "Autenticado com sucesso",
          token: token,
        });
      }
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
