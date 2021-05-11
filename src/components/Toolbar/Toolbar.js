import React, {Component} from "react";
import "./Toolbar.scss";
import {Link, withRouter} from "react-router-dom";
import PrivateToolbar from "./PrivateToolbar";
import PublicToolbar from "./PublicToolbar";
import {auth, db} from "../Firebase/Firebase"
import {withTranslation} from 'react-i18next';

class Toolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toolbar: null,
            user: null,
            anchorEl: null
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.loadData(user.uid);
            } else {
                this.setState({toolbar: <PublicToolbar/>});
            }
        });
    }

    loadData = (uid) => {
        const userRef = db.collection("users").doc(uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({
                    user: doc.data(),
                    toolbar: <PrivateToolbar logout={this.logout} user={doc.data()}/>
                });
            } else {
                this.setState({
                    dataLoaded: true
                })
            }
        }).catch((error) => {
            console.log("Firestore error", error);
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
        const {t} = this.props;
        return (
            <div className="toolbar">
                <div className="toolbar_logo">
                    {!this.props.home ?
                        <Link to="/home" className="toolbar_items_item_home">{t('toolbar.home')}</Link>
                        : null}
                </div>
                {this.state.toolbar}

            </div>
        );
    }
}

export default withRouter(
    withTranslation()(Toolbar)
)
