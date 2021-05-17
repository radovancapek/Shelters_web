import React, {Component} from "react";
import Layout from "./components/Layout/Layout";
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "./components/home/Home";
import Profile from "./components/Profile/Profile";
import "./theme.scss"
import Animals from "./components/Animals/Animals"
import Swipe from "./components/Swipe/Swipe"
import AddAnimal from "./components/Animals/AddAnimal/AddAnimal";
import Login from "./components/Login/Login";
import Registration from "./components/Login/Registration";
import Messages from "./components/Messages/Messages";
import MyAnimals from "./components/Animals/MyAnimals";
import PrivateRoute from "./PrivateRoute";
import LikedAnimals from "./components/Animals/LikedAnimals";
import MyProfile from "./components/Profile/MyProfile";
import i18n from './i18nextConf';
import NotFound from "./components/NotFound"
import {ErrorBoundary} from 'react-error-boundary'

class App extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            authenticated: false,
            theme: "lighttheme"
        }
        i18n.changeLanguage();
    }

    changeTheme = () => {
        if (this.state.theme === "lighttheme") {
            this.setState({theme: "darktheme"});
        } else {
            this.setState({theme: "lighttheme"});
        }
    }

    render() {
        return (
            <ErrorBoundary FallbackComponent={NotFound}>
                <div id="App" className={this.state.theme}>
                    <Layout changeTheme={this.changeTheme}>
                        <Switch>
                            <Route exact path="/">
                                <Redirect to="/home"/>
                            </Route>
                            <Route path="/home" component={Home}/>
                            <PrivateRoute path="/choice"
                                          component={Swipe}/>
                            <PrivateRoute path="/profile"
                                          component={Profile}/>
                            <PrivateRoute path="/my-profile"
                                          component={MyProfile}/>
                            <Route path="/animals" component={Animals}/>
                            <PrivateRoute path="/add"
                                          component={AddAnimal}/>
                            <PrivateRoute path="/edit"
                                          component={AddAnimal}/>
                            <PrivateRoute path="/my-animals"
                                          component={MyAnimals}/>
                            <PrivateRoute path="/liked-animals"
                                          component={LikedAnimals}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/registration" component={Registration}/>
                            <PrivateRoute path="/messages"
                                          component={Messages}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Layout>
                </div>
            </ErrorBoundary>
        )
    };
}

export default App;
