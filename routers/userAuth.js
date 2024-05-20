const express = require("express");
const router = express.Router();
const postController = require("../controller/postController.js")

router.post("/signup", postController.signup)
router.post("/login", postController.login)
router.post("/delete", postController.deleteuser )

module.exports = router;