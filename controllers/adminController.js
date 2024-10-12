const express = require("express");
const router = express.Router();

const adminRoute = require("../routes/adminRoute");

router.put("/activate", adminRoute.activate);
router.get("/tenants", adminRoute.tenants)

module.exports = router;