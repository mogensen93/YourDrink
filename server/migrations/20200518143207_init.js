
exports.up = function(knex) {
    return knex.schema
        .createTable('drink', (table) => {
            table.increments('id').primary();
            table.string('name').unique();
            table.string('instructions');
            table.string('type');
        })
        .createTable('ingredient', (table) => {
            table.increments('id').primary();
            table.string('name').unique();
        })
        .createTable('ingredients', (table) => {
            table.integer('drink_id').unsigned().notNullable();
            table.foreign('drink_id').references('drink.id');
            table.integer('ingredient_id').unsigned().notNullable();
            table.foreign('ingredient_id').references('ingredient.id');
            table.unique(['drink_id', 'ingredient_id']);
        })
        .createTable('user', (table) => {
            table.increments('id').primary();
            table.string('email').unique();
            table.string('name');
            table.string('password');
        })     
        .createTable('password_reset', (table) => {
            table.increments('id').primary();
            table.string('token');
            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('user.id');
        })
        .createTable('user_drink_relation', (table) => {
            table.integer('drink_id').unsigned().notNullable();
            table.foreign('drink_id').references('drink.id');
            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('user.id');
            table.unique(['drink_id', 'user_id']);
        });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('user_drink_relation')
    .dropTableIfExists('ingredients')
    .dropTableIfExists('password_reset')
    .dropTableIfExists('drink')
    .dropTableIfExists('ingredient')
    .dropTableIfExists('user');

};
