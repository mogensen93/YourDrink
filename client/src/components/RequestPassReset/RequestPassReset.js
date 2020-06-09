import React, {Component} from 'react';

export default class RequestPassReset extends Component {

    state = {
        email: "",
        message: "",
    }

    handleSubmit = async(event) => {
        const {email} = this.state;
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: email,
            })     
        }
        await fetch('http://localhost:9090/user/request-pass-reset', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({message: data}))
    }

    render() {
        const {message} = this.state;
        return(
            <div>
            <div className="form-container">

                    <div className="form-container-header">
                        <h1> Request Reset</h1>
                    </div>

            <form onSubmit={(event) => this.handleSubmit(event)}>
            <div className="form-container-body">
                <input name="email" placeholder="Email" onChange={(event) => {this.setState({email :event.target.value})}} />
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