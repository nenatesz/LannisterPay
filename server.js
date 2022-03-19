const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const router = require("./src/routes/fee.route")
require('dotenv').config();


// SETUP DATABASE CONNECTION
const mongodbUrl = process.env.MONGODBURL;
mongoose.connect(mongodbUrl).then(
    () => { console.log("db connected")},
    err => { console.log(err) }
);

mongoose.connection.on('error', err => {
    logError(err);
});


// EXPRESS SETUP
const app = express();
app.use(express.json());
// LOG OUTPUTS
app.use(morgan('combined'));
app.use(cors());

app.use("/", router);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));

// FOR TESTING
module.exports = app;