const express = require("express");
const router = express.Router();
const uploadSpeech = require("../controllers/speechController");

router.post("/upload", uploadSpeech);

module.exports = router;
