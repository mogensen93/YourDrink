import React, {Component} from 'react';

export default class ResetPassword extends Component {

    state = {
        email :"",
        message: ""
    }

    componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "false"){
            this.props.history.push('/unauthorized');
        }
    }

    handleSubmit = async(event) => {
        const {message} = this.state;
        event.preventDefault();
    
        const requestOptions = {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                newEmail: this.state.email,
                oldEmail: localStorage.getItem('email')
            })     
        }
        await fetch('http://localhost:9090/user/change-email', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({message: data}))
        .then(localStorage.setItem('email', this.state.email))
        .then(console.log(message))
    }

    render() {
        const {message} = this.state;
        return(

            
            <div>
              
            <div className="form-container">
                <div className="form-container-header">
                    <h1> Change Email</h1>
                 
                </div>   
          
                
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="form-container-body">
                        <input name="email" type="email" placeholder="New Email" onChange={(event) => {this.setState({email :event.target.value})}} />
                        <button>Submit</button>
                    </div>
                </form>
            </div>
            <div className={message === "" ? "hidden" : "response-container"}>
                <h3>{message.response}</h3>
            </div>
        </div>
        );
    }
}