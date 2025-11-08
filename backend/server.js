const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// FRONTEND_URL should match the origin exactly (protocol + domain + port if any).
const FRONTEND_URL = process.env.FRONTEND_URL || "https://showlittlemercy.github.io";

// Setup CORS options
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests without origin (like tools, mobile apps) if you want
    if (!origin) {
      return callback(null, true);
    }
    if (origin === FRONTEND_URL) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle pre‑flight requests

// parse requests of content‑type: application/json
app.use(bodyParser.json());

// parse requests of content‑type: application/x‑www‑form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the CRUD App backend." });
});

// routes
require("./routes/record.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
