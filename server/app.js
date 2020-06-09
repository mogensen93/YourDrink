const express = require('express')
const app = express();


/* CORS */
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:9090"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* EXPRESS */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* KNEX */
const { Model } = require('objection');
const Knex = require('knex');
const knexFile = require("./knexfile.js");
const knex = Knex(knexFile.development);

/* Give the knex instance to objection */
Model.knex(knex);


/* Set up routes with our server instance */
const userRoute = require("./routes/user");
const drinksRoute = require("./routes/drinks");

app.use(userRoute);
app.use(drinksRoute);

/* server listen */
const port = process.env.PORT || 9090;

const server = app.listen(port, (error) => {
    if(error){
        console.log('Error with Express')
    }
    console.log("server is running on port:", server.address().port);
})