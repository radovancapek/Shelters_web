import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import DogsSwipe from "../Dogs/DogsSwipe/DogsSwipe";
import DogsList from "../Dogs/DogsList/DogsList";
import Dogs from "./Dogs";

function DogsPage() {
    return (
        <Dogs>
            <Switch>
                <Redirect from="/dogs" exact to="/dogs/swipe" />
                <Route path="/dogs/swipe" component={DogsSwipe} />
                <Route path="/dogs/list" component={DogsList} />
            </Switch>
        </Dogs>
    )
}

export default DogsPage;
