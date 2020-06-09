import React, {Component} from 'react';

export default class Register extends Component {

    state = {
        email: "",
        name: "",
        password: "",
        repeatPassword: "",
        message: "",
    }

    handleSubmit = async(event) => {
        const {email, name, password, repeatPassword} = this.state;
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: email,
                name: name,
                password: password,
                repeatPassword: repeatPassword,
            })     
        }
        await fetch('http://localhost:9090/user/register', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({message: data}))
    }

    render() {
        const {message} = this.state;
        return(
            <div>
            <div className="form-container">
                      <div className="form-container-header">
                        <h1> Register</h1>
                    </div>

            <form onSubmit={(event) => this.handleSubmit(event)}>
            <div className="form-container-body">
                <input name="email" placeholder="Email" onChange={(event) => {this.setState({email :event.target.value})}} />
                <input name="name" placeholder="name" onChange={(event) => {this.setState({name :event.target.value})}} />
                <input name="password" type="password" placeholder="Password" onChange={(event) => {this.setState({password :event.target.value})}} />
                <input name="repeatPassword" type="password" placeholder="Repeat Password" onChange={(event) => {this.setState({repeatPassword :event.target.value})}} />
                <button>Sign up</button>
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