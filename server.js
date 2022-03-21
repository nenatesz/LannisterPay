const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/routes/fee.route")
require('dotenv').config();

// EXPRESS SETUP
const app = express();
app.use(express.json());

// LOG OUTPUTS
app.use(morgan('combined'));

app.use(cors());


app.use("/", router);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`));


module.exports = app;