import React, {Component} from "react";
import "./Toolbar.scss";
import {NavLink} from "react-router-dom";
import PrivateToolbar from "./PrivateToolbar";
import PublicToolbar from "./PublicToolbar";
import ShelterToolbar from "./ShelterToolbar";

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openedMenu: false,
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    handleClick() {
        this.setState({openedMenu: !this.state.openedMenu});
    }

    handleClickOutside() {
        this.setState({openedMenu: false});
        console.log("a");
    }

    render() {
        let toolbar;
        if(this.props.shelterLogged) {
            toolbar = <ShelterToolbar />
        } else if(this.props.logged) {
            toolbar = <PrivateToolbar />
        } else {
            toolbar = <PublicToolbar />
        }
        return (
            <div className="toolbar">
                <div className="toolbar_logo">
                    {!this.props.home ?
                        <NavLink to="/home" className="toolbar_items_item_home">HOME</NavLink>
                        : null}
                </div>
                {toolbar}
            </div>
        );
    }
}

export default Toolbar;
