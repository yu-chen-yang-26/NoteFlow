export function up(knex, Promise) {
    return knex.schema.createTable('test', (table) => {
        table.increments();
        table.string('email').notNullable();
        table.string('name').notNullable();
        table.string('password').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export function down(knex, Promise) {
    return knex.schema.dropTable('test');
}
