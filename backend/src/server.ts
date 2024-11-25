import 'dotenv/config';

import { createServer } from 'http';
import path from 'path';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';

import { version } from '../package.json';
import { errorHandler } from './middlewares/errorHandler';
import { initSocket } from './events/socket';
import { routes } from './routes/routes';
import { Database } from './database';
import { logger } from './utils/logger';

const app = express();
const PORT = parseInt(process.env.PORT);

app.use(compression());

app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginOpenerPolicy: false,
	}),
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(errorHandler);

app.get('*.js', (req, res, next) => {
	req.url = `${req.url}.gz`;

	res
		.set('Content-Encoding', 'gzip')
		.set('Content-Type', 'application/javascript')
		.set('Cache-Control', 'public, max-age=31557600');

	next();
});

app.use(express.static(path.join(__dirname + '/dist')));

app.get('/*', (_, res) => {
	res.sendFile(path.join(__dirname, '/dist', 'index.html'));
});

const server = createServer(app);
const socket = initSocket(server);

async function init() {
	try {
		await Database.initialize();

		server.listen(PORT);

		server.on('listening', () => {
			logger.message(`${version} - Servidor iniciado na porta ${PORT}`, 'info');
		});
	} catch (err) {
		logger.message(`Erro ao iniciar servidor: ${err.message || err}`, 'error');
	}
}

init();

export { server, socket };