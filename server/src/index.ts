import routes from "@/api/routes";
import cors from "cors";
import { config } from "dotenv";
import express, { Request, Response } from "express";

config();

const server = express();
const PORT = process.env.PORT || 5500;

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(cors());
server.use("/api", routes);
server.use("/", (req: Request, res: Response) => {
  res.send("Welcome to AirQ");
});
server.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});

export default server;
