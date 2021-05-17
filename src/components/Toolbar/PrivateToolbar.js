import React, {Component} from "react";
import "./Toolbar.scss";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router";
import {withTranslation} from "react-i18next";
import {CONVERSATIONS, SHELTER} from "../../Const";
import {auth, db} from "../Firebase/Firebase";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Select from "@material-ui/core/Select";
import i18n from "../../i18nextConf";
import Switch from "react-switch";

class PrivateToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            checked: false
        };
    }

    componentDidMount() {
        //TODO loadData
    }

    loadData = () => {
        db.collection("users").doc(auth.currentUser.uid).get()
            .then(doc => {
                if (doc.exists && doc.data().conversations) {
                    if (doc.data().conversations.length > 0) {
                        this.loadConversations(doc.data().conversations);
                    }
                    this.setState({
                        user: doc.data(),
                        conversations: doc.data().conversations
                    });
                }
            })
    }

    handleChange = (checked) => {
        this.setState({ checked });
        this.props.changeTheme();
    }

    loadConversations = (ids) => {
        ids.forEach(id => {
            this.unsubscribe2 = db.collection(CONVERSATIONS).doc(id).collection("messages").where("read", "==", true)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {

                    })
                })
        })
    }
    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null
        });
    };

    handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    }

    render() {
        const {t} = this.props;
        return (
            <>
                <ul className="toolbar_items">
                    <li className="toolbar_items_item">
                        <NavLink to="/choice" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.choice')}</p>
                        </NavLink>
                    </li>
                    <li className="toolbar_items_item">
                        <NavLink to="/animals" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.browse')}</p>
                        </NavLink>
                    </li>
                    {this.props.user.type === SHELTER
                        ? <li className="toolbar_items_item">
                            <NavLink to="/my-animals" className="toolbar_items_item_link">
                                <p className="toolbar_items_item_text">{t('toolbar.myAnimals')}</p>
                            </NavLink>
                        </li> : null
                    }
                    <li className="toolbar_items_item">
                        <NavLink to="/liked-animals" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.likedAnimals')}</p>
                        </NavLink>
                    </li>
                    <li className="toolbar_items_item">
                        <NavLink to="/messages" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.messages')}</p>
                        </NavLink>
                    </li>
                    {this.props.user.type === SHELTER
                        ? <li className="toolbar_items_item">
                            <NavLink to="/add" className="toolbar_items_item_link">
                                <p className="toolbar_items_item_text">{t('toolbar.addAnimal')}</p>
                            </NavLink>
                        </li> : null
                    }

                    <li className="toolbar_items_item">
                        <NavLink to="/my-profile" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.profile')}</p>
                        </NavLink>
                    </li>
                    <li className="toolbar_items_item">
                        <div className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text" onClick={this.props.logout}>{t('toolbar.logout')}</p>
                        </div>
                    </li>
                    <li className="toolbar_items_item">
                        <div className="toolbar_items_item_link">
                            <div className="language">
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={i18n.language}
                                    onChange={this.handleLanguageChange}
                                >
                                    <MenuItem value={'cs'}>CZ</MenuItem>
                                    <MenuItem value={'en'}>EN</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </li>
                    <li className="toolbar_items_item">
                        <div className="toolbar_items_item_link">
                            <Switch onChange={this.handleChange}
                                    checked={this.state.checked}
                                    offHandleColor="#f0a500"
                                    onHandleColor="#f0a500"
                                    onColor="#f5f7fa"
                                    offColor="#1a1c20"
                                    height={20}
                                    width={40}
                                    activeBoxShadow="null"
                                    checkedIcon={<span
                                        style={{display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        color: "#1a1c20"}}
                                    >☼</span>}
                                    uncheckedIcon={<span
                                        style={{display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: "100%",
                                        color: "#f5f7fa"}}
                                    >☾</span>}
                            />
                        </div>
                    </li>
                </ul>
                <div className="toolbar_menuIcon" aria-controls="fade-menu" onClick={this.handleClick}>
                    <FontAwesomeIcon className="closeIcon" icon={faBars}/>
                </div>
                <Menu className=""
                      id="fade-menu"
                      anchorEl={this.state.anchorEl}
                      keepMounted
                      open={this.state.anchorEl !== null}
                      onClose={this.handleClose}
                      TransitionComponent={Fade}>
                    <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                        <NavLink to="/choice" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.choice')}</p>
                        </NavLink>
                    </MenuItem>
                    <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                        <NavLink to="/animals" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.browse')}</p>
                        </NavLink>
                    </MenuItem>
                    {this.props.user.type === SHELTER
                        ? <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                            <NavLink to="/my-animals" className="toolbar_items_item_link">
                                <p className="toolbar_items_item_text">{t('toolbar.myAnimals')}</p>
                            </NavLink>
                        </MenuItem> : null
                    }
                    <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                        <NavLink to="/liked-animals" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.likedAnimals')}</p>
                        </NavLink>
                    </MenuItem>
                    <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                        <NavLink to="/messages" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.messages')}</p>
                        </NavLink>
                    </MenuItem>
                    {this.props.user.type === SHELTER
                        ? <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                            <NavLink to="/add" className="toolbar_items_item_link">
                                <p className="toolbar_items_item_text">{t('toolbar.addAnimal')}</p>
                            </NavLink>
                        </MenuItem> : null
                    }

                    <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                        <NavLink to="/my-profile" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.profile')}</p>
                        </NavLink>
                    </MenuItem>
                    <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                        <div className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text" onClick={this.props.logout}>{t('toolbar.logout')}</p>
                        </div>
                    </MenuItem>
                </Menu>
            </>

        );
    }
};

export default withRouter(
    withTranslation()(PrivateToolbar)
)
