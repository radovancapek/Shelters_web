import React, {Component} from "react";
import "./Toolbar.scss";
import {NavLink, withRouter} from "react-router-dom";
import {withTranslation} from "react-i18next";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Select from "@material-ui/core/Select";
import i18n from "../../i18nextConf";
import Switch from "react-switch";

class PublicToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            checked: false
        };
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

    handleChange = (checked) => {
        this.setState({ checked });
        this.props.changeTheme();
    }

    render() {
        const {t} = this.props;
        return (
            <div>
                <ul className="toolbar_items">
                    <li className="toolbar_items_item">
                        <NavLink to="/animals" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.browse')}</p>
                        </NavLink>
                    </li>
                    <li className="toolbar_items_item">
                        <NavLink to="/registration" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.registration')}</p>
                        </NavLink>
                    </li>
                    <li className="toolbar_items_item">
                        <NavLink to="/login" className="toolbar_items_item_link">
                            <p className="toolbar_items_item_text">{t('toolbar.login')}</p>
                        </NavLink>
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
                            <NavLink to="/animals" className="toolbar_items_item_link">
                                <p className="toolbar_items_item_text">{t('toolbar.browse')}</p>
                            </NavLink>
                        </MenuItem>
                        <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                            <NavLink to="/registration" className="toolbar_items_item_link">
                                <p className="toolbar_items_item_text">{t('toolbar.registration')}</p>
                            </NavLink>
                        </MenuItem>
                        <MenuItem className="toolbar_items_item" onClick={this.handleClose}>
                            <NavLink to="/login" className="toolbar_items_item_link">
                                <p className="toolbar_items_item_text">{t('toolbar.login')}</p>
                            </NavLink>
                        </MenuItem>
                </Menu>
            </div>
        )
    };
}

export default withRouter(
    withTranslation()(PublicToolbar)
)
