const express = require("express");
const router = express.Router();

const adminRoute = require("../routes/adminRoute");

router.put("/activate", adminRoute.activate);
router.put("/deactivate", adminRoute.deactivate);
router.get("/tenants", adminRoute.tenants);
router.post("/addadmin", adminRoute.addadmin);
router.delete("/deleteclient", adminRoute.deleteClient);

module.exports = router;