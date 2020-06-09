const { Model } = require('objection')

class Password_reset extends Model {
    static get tableName(){
        return "Password_reset";
    }
}

module.exports = Password_reset;