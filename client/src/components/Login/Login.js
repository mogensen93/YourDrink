import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'

class Login extends Component {
    state = {
        email: "",
        password: "",
        message:"",
        name:""
    }

    componentDidMount = () => {
        const loggedIn = localStorage.getItem('loggedIn')
        if(loggedIn === "true"){
            this.props.history.push('/drinks')
        } 
    }

    handleSubmit = async(event) => {
        const {email, password} = this.state;
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: email,
                password: password,
             })     
        }
        await fetch('http://localhost:9090/user/login', requestOptions)
        .then(res => res.json())
        .then(data => 
            {
                this.setState({message: data})
                console.log(data.response)
        
                if(data.response === "Correct"){
                    localStorage.setItem("loggedIn", true)
                    localStorage.setItem("email", email)
                    localStorage.setItem("name", data.name)
                
                    this.props.updateLocalstorage();
                    this.props.updateName()
                    this.props.history.push('/drinks')
                    
                    console.log('success')
                } 
        })
    }

    render() {
         const {message} = this.state;
        return(
            <div>
            <div className="form-container"> 
                
                <div className="form-container-header">
                    <h1> Login</h1>
                </div>

                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="form-container-body">
                        <input name="email" type="email" placeholder="Email" onChange={(event) => {this.setState({email :event.target.value})}} />
                        <input name="password" type="password" placeholder="Password" onChange={(event) => {this.setState({password :event.target.value})}} />
                        <button>Login</button>
                
                    </div>
                </form>
            </div>
                <div className={message === "" ? "hidden" : "response-container"}>
                <h3>{message.response}</h3>
            </div></div>

        )
    }

}

export default withRouter(Login)