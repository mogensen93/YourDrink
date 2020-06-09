const router = require("express").Router();
const nodemailer = require("nodemailer");
const mailcredentials = require("../config/mailcredentials");

/* Models */
const Drink = require('../models/Drink.js')
const Ingredient = require('../models/Ingredient.js')
const Ingredients = require('../models/Ingredients.js')
const User_drink_relation = require('../models/User_drink_relation')
const User = require('../models/User')



router.get("/drinks", async(req, res) => {
    const drinks = await Drink.query().select('name','id').from('drink')
    res.send({drinks})
})

router.post("/drinks/filter", async(req, res) => {
    const {type} = req.body;
   console.log(req.body)

    if (type == "All"){
        const drinks = await Drink.query().select('name','id').from('drink')
        res.send({drinks})

    } else {
        const drinks = await Drink.query().select('name','id').from('drink').where({type: type })
        res.send({drinks})
    }
})  


router.post("/my-drinks", async(req, res) => {
    const {email} = req.body;
   
    const user = await User.query().select().where({email: email})
    const name = user.name
    const userID = user[0].id

    const drinks = await User_drink_relation.query()
    .select('drink.*')
    .join('drink', 'user_drink_relation.drink_id', 'drink.id').where({'user_drink_relation.user_id': userID}).orderBy('drink.name'); 

    console.log(drinks)
    res.send({drinks, name})
})  

router.post("/add-to-my-drinks", async(req, res) => {
    const {drink_id, email} = req.body;

    const user = await User.query().select('id').where({email: email})
    const userID = user[0].id 
    const existingRelations = await User_drink_relation.query().select().where({user_id : userID}).where({drink_id: drink_id})
    const drink = await Drink.query().select('name').where({id: drink_id})
    const drinkName = drink[0].name
    if(!existingRelations[0]){
        const addRelation = await User_drink_relation.query().insert({
            drink_id: drink_id,
            user_id: userID
        })
        
        res.send({response: drinkName + " is added to favorites"})
    } else {
 
        res.send({response: drinkName + " is already a Favorite"})
    }

})

router.post("/remove-relation", async(req, res) => {
    const {email, drink_id} = req.body;
    console.log(email)
    console.log(drink_id)

    const user = await User.query().select('id').where({email: email})
    const userID = user[0].id 
    const removeRelation = await User_drink_relation.query().delete().where({user_id: userID}).where({drink_id: drink_id})
    
    const drinks = await User_drink_relation.query()
    .select('drink.*')
    .join('drink', 'user_drink_relation.drink_id', 'drink.id').where({'user_drink_relation.user_id': userID}); 

    res.send({drinks})
})

router.post("/drinks/drink", async(req, res ) => {
    const {drinkID} = req.body;
    console.log(drinkID)
    const drink = await Drink.query().select().where({id: drinkID})
    const ingredients = await Ingredients.query()
    .select('ingredient.*')
    .join('ingredient', 'ingredients.ingredient_id', 'ingredient.id').where({'ingredients.drink_id': drinkID});
   
    console.log(ingredients)
    const favorites = await User_drink_relation.query().select().where({drink_id: drinkID})
 
    var counter = 0
    for ( const object in favorites ){
        counter++;
    }

    res.send({ingredients, drink, counter})
})

router.post("/share-drink", async(req, res) => {
    const {friendEmail,email, id} = req.body;
    console.log(email, id, friendEmail)
    const sender = await User.query().select("name").where({email: email}).limit(1)
    const drink = await Drink.query().select().where({id: id}).limit(1)
    const ingredients = await Ingredients.query()
    .select('ingredient.*')
    .join('ingredient', 'ingredients.ingredient_id', 'ingredient.id').where({'ingredients.drink_id': id});

    ingredientArray = []
    for (var key in ingredients) {
        // var val = Ingredients[key];
        ingredientName = " " + ingredients[key].name 
            ingredientArray.push(ingredientName)
    }   
    
    const name = sender[0].name
    const drinkName = drink[0].name
    const instructions = drink[0].instructions
    const type = drink[0].type
    const emailIngredients = ingredientArray.toString()
  
    let transporter = nodemailer.createTransport({
        host: mailcredentials.SMTP,
        port: 587,
        secure: false, 
        auth: {
          user: mailcredentials.email, 
          pass: mailcredentials.password, 
        },
        tls: {
            rejectUnauthorized: false
        }
      });
    
      const mailTemplate = await transporter.sendMail({
        from: `"Your Drinks" <min.dummy.mail93@gmail.com>`, 
        to: friendEmail , 
        subject: `How to make a ${drinkName}`, 
        text: `Hello! ${name} has sent you a drink. You are going to need the following ingredients: ${emailIngredients}. ${instructions}. ` , // plain text body
        html: `<h3>${name} just sent you a drink  </h3> 
        <h4>${drinkName}</h4>
        <p> ${instructions}.</p>
        <p>You are going to need: ${emailIngredients}.</p>`, 
      });

    transporter.sendMail(mailTemplate, function(error, data){
        if(error){
            console.log('Error', error);
        } else {
            console.log('Email has been sent');
        }
    })

    res.send({response: `A ${drinkName} has been sent! `})
})

router.post("/drinks/add", async(req, res) => {
    const {email, title, description, type, ingredients  } = req.body;
    if ( title  === "" || description  === "" || type  === "" ) {
        console.log('Some fields are missing')
        res.send({response: "Some fields are missing"});
    } else {

        // Drink
        const drinks = await Drink.query().select().where({name: title}).limit(1)
        const drink = drinks[0];
        if(!drink){
            const newDrink = await Drink.query().insert({
                name: title,
                instructions: description,
                type: type
        })
            console.log(newDrink.id)
            const user = await User.query().select('id').where({email: email}).limit(1)
            const userID = user[0].id
            const drink_owner = await User_drink_relation.query().insert({
                drink_id: newDrink.id,
                user_id: userID
            })
            console.log('New drink added')
        } else {
            console.log('Drink already there')
            return res.send({response: "Drink already there"})
        }

        // Ingredient
        const newDrink = await Drink.query().select().where({name: title}).limit(1)

        ingredients.map(async(ingredient) => {
            const findIngredients = await Ingredient.query().select().where({name: ingredient}).limit(1)
            const findIngredient = findIngredients[0];
    
            if(!findIngredient){
                console.log("Ingredient "+ ingredient +": not found, inserting new")
                const newIngredient = await Ingredient.query().insert({
                     name: ingredient
                })
              
                // Insert new ingredient in joined table with drink
                const insertIntoIngredients = await Ingredients.query().insert({
                    drink_id: newDrink[0].id,
                    ingredient_id: newIngredient.id
                })
    
                console.log(newIngredient)

                
            } else {
                // Ingredient found, insert into joined table with drink
                const insertIntoIngredients = await Ingredients.query().insert({
                    drink_id: newDrink[0].id,
                    ingredient_id: findIngredient.id
                })
            }
        })
        res.send({response: title + " Has been added"})
    }   
})

router.post("/add-random-drink", async(req, res) => {
    const {
        email,
        title, 
        instructions, 
        type,
        ingredients
    } = req.body;

    const drinks = await Drink.query().select().where({name: title}).limit(1)
    const user = await User.query().select('id').where({email: email}).limit(1)
    const userID = user[0].id

        const drink = drinks[0];
        if(!drink){
            const newDrink = await Drink.query().insert({
                name: title,
                instructions: instructions,
                type: type
        })
            console.log(newDrink.id)

            const drink_owner = await User_drink_relation.query().insert({
                drink_id: newDrink.id,
                user_id: userID
            })
            console.log('New drink added')
        } else {
            
            const drink_owner_relation = await User_drink_relation.query().select().where({
                drink_id: drinks[0].id,
                user_id: userID
            }).limit(1)

            if(!drink_owner_relation){
                const drink_owner = await User_drink_relation.query().insert({
                    drink_id: drinks[0].id,
                    user_id: userID
                })

            } else {
                console.log('User already has this drink as favorite')
                return res.send({response:"You already have this drink as favorite"})
            }
            
        }

    const newDrink = await Drink.query().select().where({name: title}).limit(1)
        
    ingredients.forEach ( async(name) => {
        console.log(name)

        const findIngredients = await Ingredient.query().select().where({name: name}).limit(1)
        const findIngredient = findIngredients[0];

        if(!findIngredient){
            console.log("Ingredient : not found, inserting new")
            const newIngredient = await Ingredient.query().insert({
                name: name  
            })
        
            const insertIntoIngredients = await Ingredients.query().insert({
                drink_id: newDrink[0].id,
                ingredient_id: newIngredient.id
            })

            console.log(insertIntoIngredients)
        } else {
    
            console.log('Ingredient already exists')
            
            const insertIntoIngredients = await Ingredients.query().insert({
                drink_id: newDrink[0].id,
                ingredient_id: findIngredient.id
            })
            console.log(insertIntoIngredients)
        }
    })
    res.send({response:"Drink has been added to the database and favorites"})
})
  


module.exports = router;