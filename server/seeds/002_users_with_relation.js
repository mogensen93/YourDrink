
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('user_drink_relation').del()
  .then(() => {
    return knex('user').del()
    })
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([
        { email: 'admin@admin.com', name: "Rasmus", password: "123" },
        { email: 'test@test.dk', name: 'Claus', password: "123"},
      ]);
    }).then(function () {
      // Inserts seed entries
      return knex('user_drink_relation').insert([
        { user_id:1 ,drink_id: 1},
        { user_id:1 ,drink_id: 3},
        { user_id:2 ,drink_id: 2},
      ]);
    });
};
