const express = require("express");
const router = express.Router()
const postController = require("../controller/postController.js")

router.post("/comment/add/:id", postController.addComments)
router.put("/comment/update/:commentid", postController.udateCommit)
router.delete("/comment/delete/:commentid", postController.deleteComments)


module.exports = router;