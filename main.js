var TAWServer = require("./lib/TAWServer.js").default;

console.log("Waiting to start the TAW server...");
var server;
setTimeout(function () {
  server = new TAWServer();
}, 20000);

