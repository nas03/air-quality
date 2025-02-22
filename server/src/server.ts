import routes from "@/domain/routes";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
dotenv.config();

const server = express();
const PORT = process.env.PORT || 5500;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(morgan("dev"));

server.use("/api", routes);

const startupServer = () => {
  // server._router.stack.forEach((middleware: any) => {
  // 	if (middleware.route) {
  // 		// routes registered directly on the app
  // 		Object.keys(middleware.route.methods).forEach((method) => {
  // 			console.log(`${method.toUpperCase()} ${middleware.route.path}`);
  // 		});
  // 	} else if (middleware.name === "router") {
  // 		// router middleware
  // 		middleware.handle.stack.forEach((handler: any) => {
  // 			if (handler.route) {
  // 				Object.keys(handler.route.methods).forEach((method) => {
  // 					console.log(`${method.toUpperCase()} ${handler.route.path}`);
  // 				});
  // 			}
  // 		});
  // 	}
  // });
  server.listen(5500, "0.0.0.0", () => {
    console.log("Server is running on port 5500");
  });
};

startupServer();
