const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postUserRegister = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    conn.query(
      `SELECT id_user, email, password FROM users WHERE email = ?`,
      [req.body.email],
      (error, result) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        if (result.length > 0) {
          res.status(409).send({
            message: "Usuário já cadastrado",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ error: errBcrypt });
            }

            conn.query(
              `INSERT INTO users (email, password) VALUES (?,?)`,
              [req.body.email, hash],
              (error, result) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }

                const response = {
                  message: "Usuário criado com sucesso",
                  userCreated: {
                    id_user: result.insertId,
                    email: req.body.email,
                  },
                };

                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
};

exports.postUserLogin = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }

    const insertQuery = `SELECT id_user, email, password FROM users WHERE email = ?`;
    conn.query(insertQuery, [req.body.email], (error, result, fields) => {
      conn.release();
      if (error) {
        return res.status(500).send({ error: error, type: "Erro de query" });
      }

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

        return res.status(401).send({ message: "Falha na autenticação" });
      });
    });
  });
};
