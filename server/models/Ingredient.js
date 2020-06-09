const { Model } = require('objection')

class Ingredient extends Model {
    static get tableName(){
        return "ingredient";
    }
}

module.exports = Ingredient