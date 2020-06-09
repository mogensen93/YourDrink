import React, {Component} from 'react';

export default class ResetPassword extends Component {

    state = {
        name :"",
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
                newName: this.state.setItemname,
                oldName: localStorage.getItem('name'),
                email: localStorage.getItem('email')
            })     
        }
        await fetch('http://localhost:9090/user/change-name', requestOptions)
        .then(res => res.json())
        .then(data => this.setState({message: data}))
        .then(localStorage.setItem('name', this.state.name))
        .then(this.props.updateName())
    }

    render() {
        const {message} = this.state;
        return(

            
            <div>
              
            <div className="form-container">
                <div className="form-container-header">
                    <h1> Change Name</h1>
                 
                </div>   
          
                
                <form onSubmit={(event) => this.handleSubmit(event)}>
                    <div className="form-container-body">
                        <input name="name" type="text" placeholder="New Name" onChange={(event) => {this.setState({name :event.target.value})}} />
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