const express = require("express");
const router = express.Router();

const adminRoute = require("../routes/adminRoute");

router.put("/activate", adminRoute.activate);
router.get("/tenants", adminRoute.tenants);
router.post("/addadmin", adminRoute.addadmin);

module.exports = router;