import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

dotenv.config();
export const dataSourceOption: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/db/entities/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.js'],
  seeds: ['dist/db/seeders/**/*{.ts,.js}'],
  synchronize: false,
  logger: 'debug',
};

const dataSource = new DataSource(dataSourceOption);
export default dataSource;
