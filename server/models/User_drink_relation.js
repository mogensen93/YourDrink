const { Model } = require('objection')

class User_drink_relation extends Model {
    static get tableName(){
        return "user_drink_relation";
    }
}

module.exports = User_drink_relation;