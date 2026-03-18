const express = require("express");
const cors = require("cors");
require("dotenv").config();

const speechRoutes = require("./routes/speechRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/speech", speechRoutes);

app.get("/", (req, res) => {
  res.send("Awaaz Setu Backend Server Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
