import React, {Component} from "react";
import "./Reviews.scss";
import {withTranslation} from 'react-i18next';

class Reviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }

    loadData = () => {

    }

    render() {
        const {t} = this.props;
        return (
            <div className="reviews">

            </div>
        );
    }
}

export default  withTranslation()(Reviews)

