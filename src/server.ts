import express, { urlencoded } from 'express';
import cors from 'cors';
import { mainRouter } from './routers/main';

const server = express();
server.use(cors());
server.use(urlencoded({ extended: true }));
server.use(express.json());

server.use(express.static('public'));

server.use(mainRouter);

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});