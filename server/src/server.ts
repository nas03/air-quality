import routes from "@/domain/routes";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { CacheService } from "./services/cacheService";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 5500;
const cacheService = new CacheService();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(morgan("dev"));

server.use("/api", routes);

const serverInstance = server.listen(5500, "0.0.0.0", () => {
    console.log("Server is running on port 5500");
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
    console.log('Received shutdown signal, closing connections...');
    
    try {
        // Close Redis connection
        await cacheService.quit();
        console.log('Redis connection closed successfully');
        
        // Close server
        serverInstance.close(() => {
            console.log('Server closed successfully');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}

export default server;
