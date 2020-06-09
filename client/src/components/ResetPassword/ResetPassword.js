import React, {Component} from 'react';

export default class ResetPassword extends Component {

    state = {
        password :"",
        repeatPassword :"",
        message: ""
    }

    handleSubmit = async(event) => {
        const {password, repeatPassword} = this.state;
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let token = params.get('token');
        let id = params.get('id');
        console.log(id, token)
        event.preventDefault();
    
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                id: id,
                token: token,
                password: password,
                repeatPassword: repeatPassword,
            })     
        }

        await fetch('http://localhost:9090/user/reset-password', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({message: data}))
    }

    render() {
        const {message} = this.state;
        return(
            <div>
                <div className="form-container">
                    <div className="form-container-header">
                        <h1> Reset</h1>
                    </div>
                    <form onSubmit={(event) => this.handleSubmit(event)}>
                        <div className="form-container-body">
                            <input name="password" type="password" placeholder="Password" onChange={(event) => {this.setState({password :event.target.value})}} />
                            <input name="repeatPassword" type="password" placeholder="Repeat Password" onChange={(event) => {this.setState({repeatPassword :event.target.value})}} />
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