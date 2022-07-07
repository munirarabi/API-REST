const mysql = require("../mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postUserRegister = async (req, res, next) => {
  try {
    const insertQuery = `SELECT id_user, email, password FROM users WHERE email = ?;`;
    const result = await mysql.execute(insertQuery, [req.body.email]);

    if (result.length > 0) {
      res.status(409).send({
        message: "Usuário já cadastrado",
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
        if (errBcrypt) {
          return res.status(500).send({ error: errBcrypt });
        }

        const insertQuery2 = `INSERT INTO users (email, password) VALUES (?,?);`;
        const result2 = await mysql.execute(insertQuery2, [
          req.body.email,
          hash,
        ]);

        const response = {
          message: "Usuário criado com sucesso",
          userCreated: {
            id_user: result2.insertId,
            email: req.body.email,
          },
        };

        return res.status(201).send(response);
      });
    }
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postUserLogin = async (req, res) => {
  try {
    const insertQuery = `SELECT id_user, email, password FROM users WHERE email = ?;`;
    const result = await mysql.execute(insertQuery, [req.body.email]);

    if (result.length < 1) {
      return res.status(401).send({ message: "Falha na autenticação" });
    }

    const idUser = result[0].id_user;
    const emailUser = result[0].email;

    bcrypt.compare(req.body.password, result[0].password, (error, result) => {
      if (error) {
        return res.status(401).send({ message: "Falha na autenticação" });
      }

      if (result) {
        const token = jwt.sign(
          {
            id_user: idUser,
            email: emailUser,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
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
