import React, {Component} from "react";
import "./Profile.scss";
import {withTranslation} from "react-i18next";
import Profile from "./Profile";

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }


    render() {
        return (
            <Profile/>
        )
    }

}

export default withTranslation()(MyProfile)
