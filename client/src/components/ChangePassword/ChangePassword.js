import React, {Component} from 'react';

export default class ResetPassword extends Component {

    state = {
        currentPassword: "",
        newPassword :"",
        newRepeatPassword :"",
        message: ""
    }

    componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "false"){
            this.props.history.push('/unauthorized');
        }
    }

    handleSubmit = async(event) => {

        event.preventDefault();
        const requestOptions = {
            method: "PATCH",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: localStorage.getItem('email'),
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword,
                repeatPassword: this.state.newRepeatPassword,

            })     
        }
        await fetch('http://localhost:9090/user/change-password', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({message: data}))
     
    }

    render() {
        const {message} = this.state;
        return(

            
            <div>
              
            <div className="form-container">
                <div className="form-container-header">
                    <h1> Change password</h1>
                </div>
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="form-container-body">
                        <input name="currentPassword" type="password" placeholder="Current password" onChange={(event) => {this.setState({currentPassword :event.target.value})}} />
                        <input name="newPassword" type="password" placeholder="New Password" onChange={(event) => {this.setState({newPassword :event.target.value})}} />
                        <input name="newRepeatPassword" type="password" placeholder="Repeat" onChange={(event) => {this.setState({newRepeatPassword :event.target.value})}} />
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