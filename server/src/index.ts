import routes from "@/api/routes";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import morgan from "morgan";
config();

const server = express();
const PORT = process.env.PORT || 5500;

server.use(morgan("dev"));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors());
server.use("/api", routes);

server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

export default server;
