import React, {Component} from "react";
import "./Toolbar.scss";
import {NavLink} from "react-router-dom";
import { withRouter } from "react-router";
import {withTranslation} from "react-i18next";

class PrivateToolbar extends Component {
    render() {
        const {t} = this.props;
        return (
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
                {t.id
                    ? <li className="toolbar_items_item">
                    <NavLink to="/myanimals" className="toolbar_items_item_link">
                    <p className="toolbar_items_item_text">{t('toolbar.myAnimals')}</p>
                    </NavLink>
                    </li> : null
                }
                <li className="toolbar_items_item">
                    <NavLink to="/messages" className="toolbar_items_item_link">
                        <p className="toolbar_items_item_text">{t('toolbar.messages')}</p>
                    </NavLink>
                </li>
                <li className="toolbar_items_item">
                    <NavLink to="/add" className="toolbar_items_item_link">
                        <p className="toolbar_items_item_text">{t('toolbar.addAnimal')}</p>
                    </NavLink>
                </li>
                <li className="toolbar_items_item">
                    <NavLink to="/profile" className="toolbar_items_item_link">
                        <p className="toolbar_items_item_text">{t('toolbar.profile')}</p>
                    </NavLink>
                </li>
                <li className="toolbar_items_item">
                    <p className="toolbar_items_item_text" onClick={this.props.logout}>{t('toolbar.logout')}</p>
                </li>
            </ul>
        );
    }
};

export default withRouter(
    withTranslation()(PrivateToolbar)
)
