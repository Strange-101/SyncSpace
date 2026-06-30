const client = require("prom-client");

const loginCounter = new client.Counter({
  name: "syncspace_logins_total",
  help: "Total number of successful user logins",
});

const signupCounter = new client.Counter({
  name: "syncspace_signups_total",
  help: "Total number of successful user signups",
});

const activeUsers = new client.Gauge({
  name: "syncspace_active_users",
  help: "Current number of connected users",
});

module.exports = {
  loginCounter,
  signupCounter,
  activeUsers,
};
