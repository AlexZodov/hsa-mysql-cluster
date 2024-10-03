import { DataSource } from 'typeorm';
import { entities } from './entities';
import { config } from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as process from 'process';

dotenvExpand.expand(config());

export const dataSource = new DataSource({
  type: 'mysql',
  synchronize: false,
  logging: true,
  entities,
  migrations: ['./src/database/migrations/*.ts'],
  replication: {
    master: {
      url: process.env.DATABASE_URL,
    },
    slaves: process.env.DATABASE_REPLICA_URLS?.split(',').map((url) => ({
      url,
    })),
  },
});
