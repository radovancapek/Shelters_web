import React, {Component} from "react";
import {withTranslation} from "react-i18next";


class NotFound extends Component {


    render() {
        const {t} = this.props;
        return (
            <div className="notFound">
                <div>{t('pageNotFound')}</div>
            </div>
        );
    }
}

export default withTranslation()(NotFound)
