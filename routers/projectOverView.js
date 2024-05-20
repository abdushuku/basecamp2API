const express = require("express");
const router = express.Router();
const postController = require("../controller/postController.js");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file , cb) => {
      cb(null, "public/image")
    },
    filename:(req, file , cb) =>{
      console.log(file);
      cb(null , Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage : storage});

router.post("/members", postController.memberAdd);
router.post("/overView/addTopic/:id", postController.addTopic);
router.post("/overView/addTask/:id", postController.addTask);
router.post("/overView/addAttachment/:id", upload.single('image'), postController.addAttachment)
router.post("/overView/deleteAttachment/:id", postController.deleteAttachment)

module.exports = router;