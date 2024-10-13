const express = require("express");
const router = express.Router();

const adminRoute = require("../routes/adminRoute");

router.put("/activate", adminRoute.activate);
router.get("/tenants", adminRoute.tenants);
router.post("/addadmin", adminRoute.addadmin);
router.post("/addclient", adminRoute.addclient);

module.exports = router;