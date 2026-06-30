const express = require("express");
const client = require("prom-client");

const router = express.Router();

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

router.get("/", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = router;
