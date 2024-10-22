const express = require("express");
const router = express.Router();

const tenantRoute = require("../routes/tenantRoute");

router.post('/adduser', tenantRoute.sendlink);
router.put('/update-profile', tenantRoute.updateProfile);


module.exports = router;