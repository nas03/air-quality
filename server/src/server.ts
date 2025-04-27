import routes from "@/domain/routes";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import { CacheService } from "./services/cacheService";

dotenv.config();

const server = express();
const cacheService = new CacheService();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(morgan("dev"));
server.use("/api", routes);

// Load SSL certificates
const privateKey = fs.readFileSync("/etc/letsencrypt/live/api.nas03.xyz/privkey.pem", "utf8");
const certificate = fs.readFileSync("/etc/letsencrypt/live/api.nas03.xyz/fullchain.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
const httpsServer = https.createServer(credentials, server);

// Redirect all HTTP to HTTPS
const httpApp = express();
httpApp.use((req, res) => {
	res.redirect(`https://${req.headers.host}${req.url}`);
});

// Start HTTP server (port 80 for redirection)
http.createServer(httpApp).listen(80, () => {
	console.log("HTTP server redirecting to HTTPS");
});

// Start HTTPS server (port 443)
const serverInstance = httpsServer.listen(443, "0.0.0.0", () => {
	console.log("HTTPS Server is running on port 443");
});

// Handle graceful shutdown
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

async function gracefulShutdown() {
	console.log("Received shutdown signal, closing connections...");

	try {
		await cacheService.quit();
		console.log("Redis connection closed successfully");

		serverInstance.close(() => {
			console.log("Server closed successfully");
			process.exit(0);
		});
	} catch (error) {
		console.error("Error during shutdown:", error);
		process.exit(1);
	}
}

export default server;
