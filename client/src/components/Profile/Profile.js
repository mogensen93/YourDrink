import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import BarLoader from "react-spinners/BarLoader";
import './Profile.css'


class Profile extends Component {

    state = {
        loading: true,
    }

    componentDidMount(){
        const loggedIn = localStorage.getItem("loggedIn");
        if (loggedIn === "false"){
            this.props.history.push('/unauthorized');
        } else {
            this.setState({loading:false})
        }
    }

    deleteProfile = async() => {
        console.log("roks")

        const requestOptions = {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
            body: JSON.stringify({ 
                email: localStorage.getItem('email')
            })     
        }
        await fetch('http://localhost:9090/user/delete', requestOptions)
        localStorage.setItem('loggedIn', false)
        localStorage.setItem('email', null)
        localStorage.setItem('name', null)
        this.props.updateLocalstorage();
        this.props.history.push('/')
    
    }

    render(){       
        const {loading} = this.state;

        return(
            <div>
                {loading?(
                    <div className="loading">
                        <BarLoader/>
                    </div>
                ):(
                <div className="profile-container">
                    <div className="profile-container-header">
                        <h1>Profile</h1>
                        <p>{localStorage.getItem('name')}</p>
                    </div>

                    <div className="profile-container-body">
                        <h2>Email</h2>
                        <p>{localStorage.getItem('email')}</p>
                        <Link to="/change-email"><button>Change email</button>    </Link>

                        <h2>Name</h2>
                        <p>{localStorage.getItem('name')}</p>
                        <Link to="/change-name"><button>Change name</button>    </Link>

                        <h2>Password</h2>
                        <Link to="/change-password"><button>Change password</button>    </Link>

                        <h2>Delete Profile</h2>
                        <button onClick={() => this.deleteProfile()}>Delete Profile</button>
                    </div>

                </div>
                )}
            </div>
        );
    }
}

export default withRouter(Profile)
