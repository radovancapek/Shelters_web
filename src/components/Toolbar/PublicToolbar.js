import React, {Component} from "react";
import "./Toolbar.scss";
import {NavLink, withRouter} from "react-router-dom";
import {withTranslation} from "react-i18next";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import MenuItem from "@material-ui/core/MenuItem";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class PublicToolbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null
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
