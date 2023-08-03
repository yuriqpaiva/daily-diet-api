import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', table => {
    table.uuid('id').primary();
    table.uuid('session_id').notNullable().index();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.boolean('is_diet').notNullable().defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals');
}

