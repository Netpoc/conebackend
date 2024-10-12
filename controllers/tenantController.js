const express = require("express");
const router = express.Router();

const tenantRoute = require("../routes/tenantRoute");

router.post('/adduser', tenantRoute.sendlink);


module.exports = router;