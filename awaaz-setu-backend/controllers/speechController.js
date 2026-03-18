const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");

// storage for uploaded audio
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("audio");

const uploadSpeech = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const audioPath = req.file.path;

    // run python whisper script
    exec(
      `python ../speech-engine/transcribe.py ${audioPath}`,
      (error, stdout, stderr) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        try {
          const result = JSON.parse(stdout);

          res.json({
            message: "Transcription successful",
            transcription: result.text,
          });
        } catch (parseError) {
          res.status(500).json({ error: "Error parsing transcription" });
        }
      }
    );
  });
};

module.exports = uploadSpeech;
