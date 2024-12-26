import routes from '@/domain/routes';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
dotenv.config();

const server = express();
const PORT = process.env.PORT || 5500;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(morgan('dev'));

server.use('/api', routes);

server.listen(PORT, () => {
	console.log('Server is listening on PORT: ', PORT);
});
