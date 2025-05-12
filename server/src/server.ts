import routes from "@/domain/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";

dotenv.config();

const server = express();

server.use(
	cors({
		origin: (origin, callback) => {
			// if (origin === "http://localhost:443") return callback(null, true);
			// if (origin === "http://localhost:5173") return callback(null, true);
			// if (origin === "http://13.213.59.37") return callback(null, true);
			// if (origin && /^https:\/\/([a-zA-Z0-9-]+\.)*nas03\.xyz$/.test(origin))
			// 	return callback(null, true);
			// callback(new Error("Not allowed by CORS"));
			return callback(null, true);
		},
		credentials: true,
	}),
);

server.use(express.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));

server.use(morgan("dev"));
server.use("/api", routes);

if (process.env.NODE_ENV === "production") {
	const privateKey = fs.readFileSync("/etc/letsencrypt/live/api.nas03.xyz/privkey.pem", "utf8");
	const certificate = fs.readFileSync(
		"/etc/letsencrypt/live/api.nas03.xyz/fullchain.pem",
		"utf8",
	);
	const credentials = { key: privateKey, cert: certificate };
	const httpsServer = https.createServer(credentials, server);
	const httpApp = express();
	httpApp.use((req, res) => {
		res.redirect(`https://${req.headers.host}${req.url}`);
	});

	http.createServer(httpApp).listen(80, () => {
		console.log("HTTP server redirecting to HTTPS");
	});

	httpsServer.listen(443, "0.0.0.0", () => {
		console.log("HTTPS Server is running on port 443");
	});
} else {
	server.listen(443, "0.0.0.0", () => {
		console.log("HTTP Server is running on port 443");
	});
}

export default server;
