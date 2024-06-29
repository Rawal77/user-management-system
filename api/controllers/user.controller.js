const { showError } = require("../lib");
const User = require("../model/user.model");
const bcrypt = require("bcryptjs");

class UserController {
  index = async (req, res, next) => {
    try {
      const user = await User.find();
      res.json(user);
    } catch (error) {
      showError(error, next);
    }
  };
  show = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      res.json(user);
    } catch (error) {
      showError(error, next);
    }
  };
  store = async (req, res, next) => {
    try {
      const { name, email, password, confirm_password, age } = req.body;
      if (await User.findOne({ email })) {
        next({
          status: 422,
          message: `Email already exist`,
        });
      } else {
        if (password === confirm_password) {
          const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
          await User.create({
            name,
            email,
            password: hash,
            confirm_password,
            age,
          });
          res.status(201).json({
            success: `User successfully created`,
          });
        } else {
          next({
            status: 422,
            message: `password doesn't match`,
          });
        }
      }
    } catch (error) {
      showError(error, next);
    }
  };
  update = async (req, res, next) => {
    try {
      const { name, email, age } = req.body;
      await User.findByIdAndUpdate(req.params.id, { name, email, age });
      res.json({
        success: `user details successfully updated`,
      });
    } catch (error) {
      showError(error, next);
    }
  };
  destroy = async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({
        success: `User successfully deleted`,
      });
    } catch (error) {
      showError(error, next);
    }
  };
  updatePassword = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      const passwordUser = user.password;
      const { old_password, new_password, confirm_password } = req.body;
      if (bcrypt.compareSync(old_password, passwordUser)) {
        if (new_password === confirm_password) {
          const hash = bcrypt.hashSync(new_password, bcrypt.genSaltSync(10));
          await User.findByIdAndUpdate(req.params.id, { password: hash });
          res.json({
            success: `Password successfully changed`,
          });
        } else {
          next({
            status: 422,
            message: `Confirm password and password doesn't match`,
          });
        }
      } else {
        next({
          status: 422,
          message: `Password is not correct`,
        });
      }
    } catch (error) {
      showError(error, next);
    }
  };
}

module.exports = new UserController();
