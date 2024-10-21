import 'reflect-metadata';
import pg from 'pg';
import { DataSource, QueryRunner } from 'typeorm';

pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number);

export const Database = new DataSource({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	type: 'postgres',
	synchronize: false,
	logging: process.env.LOG_SQL === 'TRUE',
	entities: [`${__dirname}/models/**.{js,ts}`],
});

export async function getQueryRunner(start = true): Promise<QueryRunner> {
	const qr = Database.createQueryRunner();

	if (start) {
		await qr.connect();
		await qr.startTransaction();
	}

	return qr;
}

export async function commit(qr: QueryRunner): Promise<void> {
	if (!qr) {
		return;
	}

	await qr.commitTransaction();

	release(qr);
}

export async function rollback(qr: QueryRunner): Promise<void> {
	if (!qr) {
		return;
	}

	if (qr.isTransactionActive) {
		await qr.rollbackTransaction();
	}

	release(qr);
}

export async function release(qr: QueryRunner): Promise<void> {
	await qr.release();
}