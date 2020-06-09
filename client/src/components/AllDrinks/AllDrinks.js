import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import './AllDrinks.css'

class AllDrinks extends Component {
    
    state = {
        drinks: "",
        loading: true,
        drinkid: "",
        message:""
    }

    async componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "true"){
            const res = await fetch('http://localhost:9090/drinks', {credentials: 'include'})
            const data = await res.json();
            this.setState({drinks: data})
            this.setState({loading: false})
        } else {
            this.props.history.push('/unauthorized')
        }
    }

    async filterDrinks(type){
        this.setState({message:""})
        this.setState({loading: true})
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                type: type,
            })     
        }
        
        await fetch('http://localhost:9090/drinks/filter', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({drinks: data}))
        .then(this.setState({loading: false}))
    }

    goToDrink = async(id) => {
        this.props.history.push({
            pathname: 'drinks/drink/'+id,
            state: {drinkid: id}})
    }

    AddRelation = async(id) => {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: localStorage.getItem('email'),
                drink_id: id
            })     
        }
        
        await fetch('http://localhost:9090/add-to-my-drinks', requestOptions)
        .then(res => res.json())
        .then(message => this.setState({message: message}))
    }
    
    render(){
        const {loading, message, drinks} = this.state;
        return(
                <div>
                    {loading?(
                        <div>
                            <h2>Loading Drinks</h2>
                        </div>
                    ):(
                        <div>
                            <button onClick={() => {this.filterDrinks("Non alcoholic")}}> Virgin</button>
                            <button onClick={() => {this.filterDrinks("Alcoholic")}}> Alcoholic</button>
                            <button onClick={() => {this.filterDrinks("All")}}> All</button>
                            <div className={message === "" ? "hidden" : "response-container"}>
                                <h3>{message.response}</h3>
                            </div>
                            <div className="drinks-container">
                                {drinks.drinks.map((drink) => {
                                    return(
                                        <div key={drink.id} className="drink-container-grid" > 
                                            <div className="drink-container-header"> 
                                                <h3>{drink.name}</h3>
                                            </div>
                                            <div className="button-container">
                                                <button className="button-left"onClick={() => {this.AddRelation(drink.id)}}> Add to favorites </button>
                                                <button className="button-right" onClick={() => {this.goToDrink(drink.id)}}> See Drink </button>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    )}

                </div>
            )
    }
}

export default withRouter (AllDrinks);