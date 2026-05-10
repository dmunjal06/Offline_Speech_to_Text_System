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

    const audioPath = path.resolve(req.file.path);

    console.log("Audio Path:", audioPath);

    // run python whisper script
    const scriptPath = path.join(__dirname, "../../speech-engine/transcribe.py");
    exec(`python "${scriptPath}" "${audioPath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error("PYTHON ERROR:", error);
          console.error("STDERR:", stderr);
          return res.status(500).json({ error: error.message });
        }

        try {
          let jsonStart = stdout.indexOf("{");
          let jsonString = stdout.slice(jsonStart);

          const result = JSON.parse(jsonString);

          res.json({
            message: "Transcription successful",
            transcription: result.text,
          });
        } catch (parseError) {
          console.error("PARSE ERROR:", stdout);
          res.status(500).json({ error: "Error parsing transcription" });
        }
      }
    );
  });
};

module.exports = uploadSpeech;
