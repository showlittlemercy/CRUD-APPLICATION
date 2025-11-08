const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// allow requests from frontend (adjust origin if needed)
app.use(cors({ origin: 'https://crud-application-u6ak.onrender.com' }));

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
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
