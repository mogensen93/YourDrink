const { Model } = require('objection')

class Ingredients extends Model {
    static get tableName(){
        return "ingredients";
    }
}

module.exports = Ingredients;