import React, { Component } from 'react';
import BarLoader from "react-spinners/BarLoader";

export default class RandomDrink extends Component {
    
    state = {
        apiDrinks: "",
        loading: true,
        title: "",
        instructions: "",
        type:"",
        ingredients: [],
        message:"",
    }

    componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "true"){
            this.getNewDrink();
        } else {
            this.props.history.push('/unauthorized');
        }
    }
    
    getNewDrink = async() => {
        this.setState({message:""})
        const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
        const drinks = await res.json();
        this.setState({apiDrinks: drinks})
        this.setState({loading: false})
        console.log(this.state.apiDrinks)
    }

    addThisDrink = async() => {
        const {apiDrinks} = this.state;
        
        const info = apiDrinks.drinks[0]
        
        let ingredientsArray = [];
        let counter = 0;
        for (let key in info) {
            counter ++;
            if(counter > 21 && counter < 36){
                if(info[key] !== null){
                    ingredientsArray.push(info[key])
                }
            }
        }
        await this.setState({ingredients:ingredientsArray })
        await this.setState({title : apiDrinks.drinks[0].strDrink })
        await this.setState({instructions : apiDrinks.drinks[0].strInstructions })
        await this.setState({type : apiDrinks.drinks[0].strAlcoholic})
        
        this.fetch();

    }

    fetch = async() => {
        const {title, instructions, type, ingredients} = this.state;
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: localStorage.getItem('email'),
                title: title,
                instructions: instructions,
                type: type,
                ingredients: ingredients
             })     
        }
        
        await fetch('http://localhost:9090/add-random-drink', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({message: data}))
    }

    
    render(){
        const {message, apiDrinks, loading} = this.state;
        return(
                <div>
                    {loading?(
                        <div className="loading">
                            <BarLoader/>
                        </div>
                    ):(
                        <div>
                            <button onClick={() => this.getNewDrink()}>Another one</button>
                            {apiDrinks.drinks.map((drink) => {
                                return(
                                    <div key={drink.idDrink} className="drink-container"> 
                                        <div className="drink-container-header">
                                            <h1>{drink.strDrink}</h1>
                                            <p>{drink.strAlcoholic}</p>
                                        </div>
                                        <div className="info">
                                            <div className="instructions">
                                                <h3>Instuctions</h3> 
                                                <p>{drink.strInstructions}</p>
                                            </div>
                                            <div className="ingredients">
                                                <h3>Ingredients</h3>                                        
                                                <p>{drink.strIngredient1}</p>
                                                <p>{drink.strIngredient2}</p>
                                                <p>{drink.strIngredient3}</p>
                                                <p>{drink.strIngredient4}</p>
                                                <p>{drink.strIngredient5}</p>
                                                <p>{drink.strIngredient6}</p>
                                                <p>{drink.strIngredient7}</p>
                                                <p>{drink.strIngredient8}</p>
                                                <p>{drink.strIngredient9}</p>
                                                <p>{drink.strIngredient10}</p>
                                                <p>{drink.strIngredient11}</p>
                                                <p>{drink.strIngredient12}</p>                                     
                                                <p>{drink.strIngredient13}</p>                                      
                                                <p>{drink.strIngredient14}</p>                                      
                                                <p>{drink.strIngredient15}</p>
                                            </div>
                                    </div>
                                        <button onClick={() => this.addThisDrink()}>Add to database </button>
                                    </div>
                                    
                                );
                            })}
                            <div className={message === "" ? "hidden" : "response-container"}>
                                <h3>{message.response}</h3>
                             </div>
                        </div>
                        
                    )}
                </div>
        )
    }
}