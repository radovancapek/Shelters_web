import React, {Component} from "react";
import "./Toolbar.scss";
import {NavLink, withRouter} from "react-router-dom";
import {withTranslation} from "react-i18next";

class PublicToolbar extends Component{

    render() {
        const {t} = this.props;
        return (
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
        )
    };
}

export default withRouter(
    withTranslation()(PublicToolbar)
)
