
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('ingredients').del()
  .then(() => {
    return knex('ingredient').del()
  }).then(() => {
    return knex('drink').del()
    })
    .then(function () {
      // Inserts seed entries
      return knex('drink').insert([
        {name: "Rom and Coke", instructions: 'half and half', type:"Alcoholic"},
        {name: "Filur", instructions: '1/3 orange juice, 1/3 red soda, 1/3 gin', type:"Alcoholic"},
        {name: "Virgin mojito", instructions: 'Place mint leaves and lime juice in a glass and muddle them together. Add the honey simple syrup. Add the sparkling water. Garnish with lime slices, a sprig of mint, and/or fresh fruit.', type:"Non Alcoholic"},
      ]). then(() => {
        return knex('ingredient').insert([
          {name:"Orange Juice"},
          {name:"Gin"},
          {name:"Red Soda"},
          {name:"Rom"},
          {name:"Coca Cola"},
          {name:"Fresh lime juice"},
          {name:"Honey Simple Syrup"},
          {name:"Fresh mint leaves"},
          {name:"Sparkling water"},
          {name:"Ice"},

        ]).then(() => {
          return knex('ingredients').insert([
            {drink_id: 1, ingredient_id:4 },
            {drink_id: 1, ingredient_id:5 },
            {drink_id: 2, ingredient_id:1 },
            {drink_id: 2, ingredient_id:2 },
            {drink_id: 2, ingredient_id:3 },
            {drink_id: 3, ingredient_id:6 },
            {drink_id: 3, ingredient_id:7 },
            {drink_id: 3, ingredient_id:8 },
            {drink_id: 3, ingredient_id:9 },
            {drink_id: 3, ingredient_id:10 },

          ])
        })
      });
    });
};
