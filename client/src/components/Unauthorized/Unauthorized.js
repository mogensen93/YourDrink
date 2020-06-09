import React, {Component} from 'react';

import {Link} from "react-router-dom";

export default class Unauthorized extends Component {
    render() {
        return(
            <div>
                <h1> Sorry..</h1>
                <p>It seems like you are trying to reach an Unauthorized page.</p>
                <p>In order to access such you must be logged in.</p>
                <Link to="/login"><button>Login</button></Link>
            </div>
        );
    }
}