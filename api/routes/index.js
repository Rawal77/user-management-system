const express = require("express");
const router = express.Router();

const userRoute = require("./user.route");

router.use("/users", userRoute);

router.use((req, res, next) => {
  next({
    status: 404,
    message: `Resource not found`,
  });
});

module.exports = router;
