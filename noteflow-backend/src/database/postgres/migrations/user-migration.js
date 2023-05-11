export function up(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.string('uuid');
    table.string('email');
    table.string('name');
    table.string('password');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('jwt');
    table.boolean('verified').defaultTo(false);
  });
}

export function down(knex, Promise) {
    return knex.schema.dropTable('users');
}
