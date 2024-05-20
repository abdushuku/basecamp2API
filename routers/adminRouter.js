const express = require("express");
const router = express.Router();
const postController = require("../controller/postController.js");

router.post("/users/:userId/edit", postController.userEditPost);
router.post("/users/:userId/delete", postController.userDeletePost);

module.exports = router;