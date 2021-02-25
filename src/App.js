import React, {Component} from "react";
import Layout from "./components/Layout/Layout";
import {Route, Switch, Redirect} from "react-router-dom";
import ProfilePage from "./components/Profile/ProfilePage";
import Home from "./components/home/Home";
import style from "./index.css"
import Animals from "./components/Animals/Animals"
import Swipe from "./components/Swipe/Swipe"
import AddAnimal from "./components/Animals/AddAnimal/AddAnimal";
import Login from "./components/Login/Login";
import Registration from "./components/Login/Registration";
import Messages from "./components/Messages/Messages";
import MyAnimals from "./components/Animals/MyAnimals";
import PrivateRoute from "./PrivateRoute";

class App extends Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            authenticated: false
        }
    }

    componentDidMount() {
        console.log("app did mount");
    }

    render() {
        return (
            <div id="App" className={style.lighttheme}>
                <Layout>
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/home"/>
                        </Route>
                        <Route path="/home" component={Home}/>
                        <PrivateRoute path="/choice"
                                      component={Swipe}/>
                        <PrivateRoute path="/profile"
                                      component={ProfilePage}/>
                        <Route path="/animals" component={Animals}/>
                        <PrivateRoute path="/add"
                                      component={AddAnimal}/>
                        <PrivateRoute path="/myanimals"
                                      component={MyAnimals}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/registration" component={Registration}/>
                        <PrivateRoute path="/messages"
                                      component={Messages}/>
                    </Switch>
                </Layout>
            </div>
        )
    };
}

export default App;
