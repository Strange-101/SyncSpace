const express = require("express");
const sequelize = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  let databaseStatus = "disconnected";

  try {
    await sequelize.authenticate();
    databaseStatus = "connected";
  } catch (err) {
    databaseStatus = "disconnected";
  }

  const statusCode = databaseStatus === "connected" ? 200 : 503;

  res.status(200).json({
    status: databaseStatus === "connected" ? "healthy" : "unhealthy",
    database: {
      status: databaseStatus,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
  });
});

module.exports = router;
