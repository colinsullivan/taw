import TAWServer from "./TAWServer";

console.log("Waiting to start the TAW server...");
var server;
if (process.env.NODE_ENV == "production") {
  setTimeout(function () {
    server = new TAWServer();
  }, 20000);
} else {
  server = new TAWServer();
}

