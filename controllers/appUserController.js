const express = require("express");
const router = express.Router();

const appUserRoute = require("../routes/appUserRoute");

router.post("/savespreadsheets", appUserRoute.saveSpreadsheet);

module.exports = router;