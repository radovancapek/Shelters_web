import React, {Component} from "react";
import "./Toolbar.scss";
import {Link, withRouter} from "react-router-dom";
import PrivateToolbar from "./PrivateToolbar";
import PublicToolbar from "./PublicToolbar";
import { auth } from "../Firebase/Firebase"

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toolbar: null
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({toolbar: <PrivateToolbar logout={this.logout} />});
            } else {
                this.setState({toolbar: <PublicToolbar />});
            }
        });
    }

    logout = () => {
        auth.signOut().then(() => {
            this.props.history.push('/');
        }).catch((error) => {
            console.log("logout error " + error.message);
        });
    }


    render() {

        let toolbar;
        if(auth.currentUser) {
            toolbar = <PrivateToolbar />
        } else {
            toolbar = <PublicToolbar />
        }


        return (
            <div className="toolbar">
                <div className="toolbar_logo">
                    {!this.props.home ?
                        <Link to="/home" className="toolbar_items_item_home">HOME</Link>
                        : null}
                </div>
                {this.state.toolbar || toolbar}
            </div>
        );
    }
}

export default withRouter(Toolbar);
