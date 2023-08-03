import setupKnex, { Knex } from 'knex';

const db = process.env.NODE_ENV === 'test' ? 'test.db' : 'app.db';

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: `./database/${db}`,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
};

export const knex = setupKnex(config);
