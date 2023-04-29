const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const storage = require("../utils/cloud_storage");

module.exports = {
  async getAll(req, res, next) {
    try {
      const data = await User.getAll();
      console.log(`Usuarios: ${data}`);
      return res.status(201).json(data);
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error ao obter os usuarios ",
      });
    }
  },

  async register(req, res, next) {
    try {
      const user = req.body;
      const data = await User.create(user);

      return res.status(201).json({
        success: true,
        message: "O Registro foi realizado corretamente",
        data: {
          id: data.id,
        },
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error no  Registro do usuario",
        error: error,
      });
    }
  },

  async login(req, res, next) {
    try {
      const email = req.body.email;
      const password = req.body.password;

      const myUser = await User.findByEmail(email);

      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: "O Email Não foi encontrado",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, myUser.password);

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email },
          keys.secretOrKey,
          {
            //  expiresIn:
          }
        );

        const data = {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          email: myUser.email,
          gender: myUser.gender,
          birthdate: myUser.birthdate,
          weight: myUser.weight,
          height: myUser.height,
          image: myUser.image,
          session_token: `JWT ${token}`,
        };
        return res.status(201).json({
          success: true,
          message: "O Usuário está sendo autenticado",
          data: data,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "A Senha está incorreta",
        });
      }
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error no Login do usuario",
        error: error,
      });
    }
  },

  async update(req, res, next) {
    try {
      console.log("usuario", req.body.user);
      const user = JSON.parse(req.body.user); //cliente deve enviar um objeto com os dados dos usario
      console.log("Usuario Passado", user);

      const files = req.files;

      if (files.length > 0) {
        //Cliente enviar um arquivo

        const pathImage = `image_${Date.now()}`; //Nome do arquivo
        const url = await storage(files[0], pathImage);

        if (url != undefined && url != null) {
          user.image = url;
        }
      }

      await User.update(user); // Guardar imagem na base de dados
      return res.status(201).json({
        success: true,
        message: "Os dados do usuário foram atualizados corretamente",
        data: user,
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error ao atualizar os dados do  usuario",
        error: error,
      });
    }
  },

  async updateWithoutImage(req,res,next){

    try{

     console.log('usuario',req.body);
     const user = req.body; //cliente deve enviar um objeto com os dados dos usario 
     console.log('Usuario Passado',user);

     await User.update(user); // Guardar imagem na base de dados
     return res.status(201).json({
        success : true ,
        message: 'Os dados do usuÃ¡rio foram atualizados corretamente',
        data:user

     });

    }catch(error){

        console.log(`Error: ${error}`);
        return res.status(501).json({
            success: false,
            message: 'Error ao atualizar os dados do  usuario',
            error: error

        });

    }

}
};
