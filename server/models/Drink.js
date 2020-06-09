const { Model } = require('objection')

class Drink extends Model {
    static get tableName(){
        return "drink";
    }
}

module.exports = Drink