import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";
import './SpecificDrink.css'


class SpecificDrink extends Component {

    state = {
        data: "",
        loading: true,
        friendEmail: "",
        message:""
    }

    componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "true"){
            this.getDrink();
        } else {
            this.props.history.push('/unauthorized');
        }
    }

    async getDrink(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ drinkID: this.props.history.location.state.drinkid})
        };

        try{
            const res = await fetch('http://localhost:9090/drinks/drink', requestOptions)
            const data = await res.json()
            this.setState({data, loading: false})

        } catch(error){
            console.log(error)
        }
    }

    async shareDrink (event){
        
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                id: this.props.history.location.state.drinkid,
                friendEmail: this.state.friendEmail,
                email: localStorage.getItem('email')
            })
        };
        
        await fetch('http://localhost:9090/share-drink', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({message: data}))
    }

    shareToggle()  {
       
            const shareContainer = document.getElementById('share-container');
            shareContainer.classList.toggle("share-container-show")
        
    }
      
    render(){       
        const {data, loading, message} = this.state;

        return(
            <div>
                {loading?(

                    <div className="loading">
                        <BarLoader/>
                    </div>

                ):(
                <div>       
                    <div className="headline">
                    
                    <p>{data.counter} people favorited this drink</p>
                    </div>
                    
                 <div className="drink-container">             
                    <ul>
                    {data.drink.map((drink) =>{
                            return(
                                <div key={drink.id}>
                                    <div class="drink-container-header">
                                    <h1>{drink.name}</h1>
                                    <p>{drink.type}</p>
                                    </div>
                                    <div className="info">
                                    <div className="instructions">
                                            <h3>Instuctions</h3> 
                                            <p>{drink.instructions}</p>
                                        </div>

                                        <div className="ingredients">
                                        <h3>Ingredients:</h3>
                                        {data.ingredients.map((ingredient) =>{
                                            return(
                                                <div key={ingredient.id} className="ingredient">
                                                    <p>{ingredient.name}</p>
                                                
                                                </div>
                                            );
                                        })}
                                        </div>
                                  
                                    </div>
                                    <button onClick={() => this.shareToggle()}>Share with a friend</button>
                                </div>
                            );
                        })}

                        
                    </ul>
            
                </div>
                <div className="share-container-hidden" id="share-container"> 
                        <form onSubmit={(event) => {this.shareDrink(event)}}>
                            <div class="drink-container-header">
                                <h1>Share drink</h1>
                            </div>
                            <input placeholder="Send to: Email" type="email" onChange={(event) => {this.setState({friendEmail: event.target.value})}}/>
                            <button>Send </button>
                          
                        </form>
                     

                    </div>

                    <div className={message === "" ? "hidden" : "response-container"}>
                        <h3>{message.response}</h3>
                    </div>
                

                </div>
                )}
                  

            </div>
        )
    }
}

export default withRouter(SpecificDrink)
