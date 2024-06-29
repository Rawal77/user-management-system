const express = require("express");
const router = express.Router();

const user = require("../controllers/user.controller");

router.route("/").get(user.index).post(user.store);
router.route("/:id").get(user.show).patch(user.update).delete(user.destroy);
router.patch("/update/:id", user.updatePassword);

module.exports = router;
