import React, {Component} from "react";
import "./Toolbar.scss";
import {NavLink} from "react-router-dom";
import {withRouter} from "react-router";
import {withTranslation} from "react-i18next";
import {SHELTER} from "../../Const";

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
            </ul>
        );
    }
};

export default withRouter(
    withTranslation()(PrivateToolbar)
)
