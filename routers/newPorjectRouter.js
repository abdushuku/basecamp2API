const express = require("express");
const router = express.Router();
const postController = require("../controller/postController.js");

router.post("/add/project", postController.addProject);
router.put("/update/project", postController.updateProject);
router.delete("/delete/:id", postController.deletProject);

module.exports = router;