import React, {Component} from 'react';
import BarLoader from "react-spinners/BarLoader";

export default class logout extends Component{

    async componentDidMount(){
        localStorage.setItem('loggedIn', false)
        localStorage.setItem('email', null)
        localStorage.setItem('name', null)
        this.props.updateLocalstorage();
        this.props.history.push('/')
    }
   render(){
    return(
        <div className="loading">
        <BarLoader/>
    </div>
    );
    }
}