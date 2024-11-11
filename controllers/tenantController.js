const express = require("express");
const router = express.Router();

const tenantRoute = require("../routes/tenantRoute");

router.post('/adduser', tenantRoute.sendlink);
router.put('/update-profile', tenantRoute.updateProfile);
router.post('/tenant/register', tenantRoute.createAppUser);

module.exports = router;