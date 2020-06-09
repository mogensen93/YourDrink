import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

/* Profile Components */
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import Register from './components/Register/Register';
import RequestPassReset from './components/RequestPassReset/RequestPassReset';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Unauthorized from './components/Unauthorized/Unauthorized';
import Profile from './components/Profile/Profile';
import ChangeEmail from './components/ChangeEmail/ChangeEmail'
import ChangeName from './components/ChangeName/ChangeName'
import ChangePassword from './components/ChangePassword/ChangePassword';

/* Drink Components */
import RandomDrink from './components/Api/RandomDrink';
import AddDrink from './components/AddDrink/AddDrink';
import AllDrinks from './components/AllDrinks/AllDrinks';
import SpecificDrink from './components/SpecificDrink/SpecificDrink';
import Favorites from './components/Favorites/Favorites';

class App extends Component {

  state = {
    loggedIn: false,
    name: ""
  }

  componentDidMount(){
    this.checkIfLoggedIn();
    this.changeName();
  }

  checkIfLoggedIn = () => {
    let loggedIn = JSON.parse(localStorage.getItem('loggedIn'))
    this.setState({loggedIn})
  }

  changeName = () => {
    let name = localStorage.getItem('name')
    this.setState({name})
  }


  render() {
    const {loggedIn} = this.state;
    return(
      <Router>
        <div className="App">

          <nav>
            <ul>
              {loggedIn
              ?( 
                <div>
                  <li>
                    <Link to="/favorites">Favorites</Link>
                  </li>
                  <li>
                    <Link to="/drinks">All Drinks</Link>
                  </li>
                  <li>
                    <Link to="/random">Random Drink</Link>
                  </li>
                  <li>
                    <Link to="/submit">Submit</Link>
                  </li>
                  <li>
                    <Link to="/profile"> {this.state.name}</Link>
                  </li>

                  <li>
                    <Link to="/logout">Log out</Link>
                  </li>
                </div> 
              ):( 
                <div>
                  <li>
                    <Link to="/request-reset-password">Reset Password</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                    <li>
                    <Link to="/">Login</Link>
                  </li>
                </div>
              )}
            </ul>
          </nav>

          <Switch>

            <Route path="/favorites">
              <Favorites/>
            </Route>

            <Route path="/drinks/:drinkid">
              <SpecificDrink />
            </Route>

            <Route path="/drinks">
              <AllDrinks /> 
            </Route>

            <Route path="/submit">
              <AddDrink />
            </Route>

            <Route path="/random">
             <RandomDrink />
            </Route>    

            <Route exact path="/"
              component = {props => <Login {...props} updateLocalstorage={this.checkIfLoggedIn} updateName={this.changeName} />}>
            </Route>
              
            <Route path="/logout"
              component = {props => <Logout {...props} updateLocalstorage={this.checkIfLoggedIn} updateName={this.changeName} />}>
            </Route>

            <Route path="/register">
              <Register/>
            </Route>

            <Route path="/request-reset-password">
              <RequestPassReset/>
            </Route>

            <Route path="/profile"
              component = {props => <Profile {...props} updateLocalstorage={this.checkIfLoggedIn} />}>
            </Route>    

            <Route path="/change-email">
              <ChangeEmail/>
            </Route>

            <Route path="/change-name">
              <ChangeName updateName={this.changeName}/>
            </Route>

            <Route path="/change-password">
              <ChangePassword/>
            </Route>

            <Route path="/reset-password">
              <ResetPassword/>
            </Route>

            <Route path="/unauthorized">
              <Unauthorized/>
            </Route>

          </Switch>

        </div>
      </Router>
    );
  }
}


export default App;
