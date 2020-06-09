import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import './AddDrink.css'

class AddDrink extends Component {

    state = {
        title: "",
        type: "Alcoholic",
        description: "",
        message: "",
        ingredients: [],
        newIngredient: "",
        error:""
    }
    
    componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "false"){
            this.props.history.push('/unauthorized')
        }
    }

    addIngredient = (event) => {
        const {ingredients, newIngredient} = this.state;
        this.setState({error:""})
        event.preventDefault()
        if(newIngredient === ""){
            this.setState({error:"Cannot be empty"})
        } else {
            const array = ingredients
            array.push(newIngredient)
            this.setState({ingredients: array})
        }
    }

    removeIngredients = (event) => {
        event.preventDefault()
        const array = []
        this.setState({ingredients: array})
    }

    clearStates = () => {
        const array = []
        this.setState({ingredients: array})
        this.setState({
            title: "", 
            type: "Alcoholic", 
            description: "",  
            newIngredient: ""
        })
    }

    onSubmit = async(event) => {
        const {title, type, ingredients, description} = this.state;
        event.preventDefault();
        this.setState({message:"", error:""})
     
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: title, 
                type: type, 
                ingredients: ingredients,
                description: description,
                email: localStorage.getItem('email')
            })
        }

        try {
            await fetch('http://localhost:9090/drinks/add', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({message: data}))
            .then(this.clearStates())
        } catch(error) {
            console.log(error)
        }
    }

    render(){
        const {message, ingredients, error, type} = this.state;
        return(
            <div className="submit-container">
                <div className="submit-container-header">
                    <h1>Submit your drink</h1>
                </div>
                <div className="submit-container-body">
                    <h2>{message.response}</h2>
                    <form onSubmit={(event) => {this.onSubmit(event)}} method="POST" id="submit">
                            <button className={type === "Non Alcoholic" ? "select-button" : null} type="button" onClick={() => {this.setState({type: "Non Alcoholic"})}} id="virgin-button"> Virgin</button>
                            <button className={type === "Alcoholic" ? "select-button" : null} type="button" onClick={() => {this.setState({type: "Alcoholic"}); }} id="alcoholic-button">Alcoholic</button>
                            <input type="text" name="title" placeholder="Title" onChange={(event) => {this.setState({title: event.target.value})}}></input>
                            <h3>Ingredients</h3>
                            <p>{error}</p>
                            <div className="add-ingredients">
                                {ingredients.map((ingredient, index) => {
                                    return(
                                        <p className="add-ingredient" key={"ingredient" + index}>{ingredient}</p>
                                        );
                                })}
                            </div>
                            <input type="text" name="ingredient" placeholder="Ingredient name " onChange={(event) => {this.setState({newIngredient: event.target.value})}}></input>
                            <button onClick={(event) => this.addIngredient(event)}> Add Ingredient</button>
                            <button onClick={(event) => this.removeIngredients(event)}> Remove Ingredients</button>
                            <textarea type="text" name="how-to" placeholder="How to?" onChange={(event) => {this.setState({description: event.target.value})}}  rows="5"></textarea>
                            <button>Submit</button>
                        </form>
                </div>
            </div>
        )
    }
}

export default withRouter(AddDrink)