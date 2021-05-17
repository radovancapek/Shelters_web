import React, {Component} from "react";
import "./Reviews.scss";
import {withTranslation} from 'react-i18next';
import {auth, db, timestamp} from "../Firebase/Firebase";
import {REVIEWS} from "../../Const";
import Rating from '@material-ui/lab/Rating';

class Reviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
            reviews: [],
            newReview: "",
            newValue: 0
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        this.unsubscribe = db.collection("users").doc(this.props.uid).collection(REVIEWS).orderBy("created", "desc")
            .onSnapshot(querySnapshot => {
                let reviews = [];
                querySnapshot.forEach(doc => {
                    reviews.push(doc.data());
                });
                this.setState({mounted: true, reviews: reviews});
            })
    }

    setValue = (value) => {
        this.setState({newValue: value})
    }

    addReview = () => {
        db.collection("users").doc(this.props.uid).collection(REVIEWS)
            .add({
                rating: this.state.newValue,
                text: this.state.newReview,
                created: timestamp.now(),
                name: auth.currentUser.displayName || ""
            })
            .then(doc => {
                console.log("Message sent", doc);
            }).catch(error => {
            console.log("Error", error);
        })
        this.setState({newReview: "", newValue: 0});
    }

    handleTextInputChange = (e) => {
        this.setState({newReview: e.target.value});
    }

    render() {
        const {t} = this.props;
        let reviews;
        if (this.state.mounted) {
            reviews = this.state.reviews.map((review, i) => {
                const time = review.created.toDate().toLocaleDateString("cs-CZ");
                return (
                    <div className="review" key={i}>
                        <div className="review_rating">
                                {review.name ? (<span className="name">{review.name}</span>) :
                                    <span className="name">{t('anonymous')}</span>}
                            <div className="date_rating">

                                <span className="created">{time}</span>
                                <Rating className="stars" name="read-only" value={review.rating} readOnly/>
                            </div>

                        </div>
                        <div className="review_text">
                            {review.text}
                        </div>
                    </div>
                );
            });
        }
        return (
            <div className="reviews">
                <div className="headerHolder">
                    <h3>{t('reviews')}</h3>
                    <div className="reviewWrapper">
                        {reviews}
                    </div>
                </div>

                {(this.props.uid !== auth.currentUser.uid) &&
                <div className="addRating">
                    <div className="top">
                        <Rating name="simple-controlled"
                                className="starRating"
                                value={this.state.newValue}
                                onChange={(event, newValue) => {
                                    this.setValue(newValue);
                                }}/>
                        <button className="Button" onClick={this.addReview}>{t('addReview')}</button>
                    </div>

                    <textarea className="Input Input_text" name="newReview" value={this.state.newReview}
                              onChange={this.handleTextInputChange}/>
                </div>
                }
            </div>
        );
    }
}

export default withTranslation()(Reviews)

