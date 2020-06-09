import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";

class Favorites extends Component {
    
    state = {
        data: "",
        loading: true,
        message: ""
    }

    componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "true"){
            this.getDrinks();
        } else {
            this.props.history.push('/unauthorized');
        }
    }

    async getDrinks(){
        const {data} = this.state;
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: localStorage.getItem('email')
             })     
        }
        
        await fetch('http://localhost:9090/my-drinks', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({data: data}))
        .then(() => {
            if(data.response === "false"){
                console.log("false")
                this.props.history.push('/unauthorized')
            } else {
            this.setState({loading: false})
            this.loadDrinks();
            }
        })
    }  
        
    loadDrinks =  () => {
        const {data} = this.state;
        if(data.drinks.length === 0){
            this.setState({message: "No favorite drinks"})
        } else {
            const counter = data.drinks.length
            if(data.drinks.length === 1){
            console.log(counter)
            this.setState({message: "You have " + counter + " favorite drink"})
            } else {
                this.setState({message: "You have " + counter + " favorite drinks"})
            }
        }
    }

    goToDrink = async(id) => {
        console.log(id)
        this.props.history.push({
            pathname: 'drinks/drink/'+id,
            state: {drinkid: id}})
    }

    removeDrink = async(id) => {
        console.log(id)
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: localStorage.getItem('email'),
                drink_id: id
            })
            
        }
        
        await fetch('http://localhost:9090/remove-relation', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({data: data}))
        .then(
            () => {
                const {data} = this.state;

                if(data.drinks.length === 0){
                    this.setState({message: "No favorite drinks"})
                } else {
                    const counter = data.drinks.length
                    if(data.drinks.length === 1){
                        console.log(counter)
                        this.setState({message: "You have " + counter + " favorite drink"})
                    } else {
                        this.setState({message: "You have " + counter + " favorite drinks"})
                    }
                }
            }
        )
    }
    
    render(){
        const {loading, data, message} = this.state;
        return(
                <div>
                    {loading?(
                        <div className="loading">
                          <BarLoader/>
                        </div>
                    ):( 
                        <div className="headline"> 
                        <p>{message}</p>
                        <div className="drinks-container">
                            {data.drinks.map((drink) => {
                                return(
                                    <div key={drink.id} className="drink-container-grid"> 
                                        <div className="drink-container-header"> 
                                            <h3>{drink.name}</h3>
                                        </div>
                                        <div className="button-container">
                                            <button className="button-left" onClick={() => {this.removeDrink(drink.id)}}> Remove</button>
                                            <button className="button-right" onClick={() => {this.goToDrink(drink.id)}}> See drink</button>
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

export default withRouter (Favorites);