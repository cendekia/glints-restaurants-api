import http from "http";
import express from "express";
import logging from "./config/logging";
import config from "./config/config";
import healthCheckRoutes from "./routes/healthCheck";
import restaurantRoutes from "./routes/restaurant";

const NAMESPACE = "Server";
const router = express();

// Request Logging
router.use((req, res, next) => {
  logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

  res.on("finish", () => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
  });

  next();
});

// Request Parser
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// API Rules
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST PUT");
    return res.status(200).json({});
  }

  next();
});

// Routes
router.use("/api-health", healthCheckRoutes);
router.use("/restaurants", restaurantRoutes);

// Error Handling
router.use((req, res, next) => {
  const error = new Error("Not Found");

  return res.status(404).json({
    message: error.message
  });

  next();
});

// Create Server
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));
