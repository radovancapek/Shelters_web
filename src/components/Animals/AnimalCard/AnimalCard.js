import React, {Component} from "react";
import "./AnimalCard.scss";
import {storage} from "../../Firebase/Firebase"
import {faImage, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ImageGallery from "react-image-gallery";
import onClickOutside from "react-onclickoutside";
import CircularProgress from "@material-ui/core/CircularProgress";

//TODO vzdalenost podle polohy nas a zvirete
class AnimalCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
            galleryImagesLoaded: false,
            imageUrl: null,
            imageUrlList: []
        };
    }

    componentDidMount() {
        this.setState({mounted: true});
        this.loadImage();
        if (this.props.gallery)
            this.loadImages();
    }

    handleClickOutside = () => {
        if (this.props.onClickOutside) {
            this.props.onClickOutside();
        }
    };

    loadImage = () => {
        const storageRef = storage.ref();
        if (this.props.animal.image) {
            const imageRef = storageRef.child(this.props.animal.image);
            imageRef.getDownloadURL()
                .then(this.setImageUrl)
                .catch(function (error) {
                    console.log("Error " + error.message);
                });
        }
    }

    loadImages = () => {
        let images = [];

        const promises = this.props.animal.images.map(imageUrl => {
            const ref = storage.ref();
            const imageRef = ref.child(imageUrl)

            imageRef.getDownloadURL()
                .then((url) => {
                    images.push(url.toString());
                    this.setState({imageUrlList: [...this.state.imageUrlList, url]});
                })
                .catch(function (error) {
                    console.log("Error " + error.message);
                });
            return 0;
        });

        Promise.allSettled(promises).then(downloadURLs => {
            this.setState({imageUrlList: images, galleryImagesLoaded: true})
        })
    }

    setImageUrl = (url) => {
        this.setState({imageUrl: url});
    }

    render() {
        let images = [];

        this.state.imageUrlList.map((url, i) => {
            images.push({original: url, thumbnail: url});
            return 0;
        });

        const gallery = () => {
            if (this.props.gallery) {
                if (images > 0 || this.state.galleryImagesLoaded) {
                    return (
                        <ImageGallery items={images} showBullets={true} lazyLoad={true}/>
                    );
                } else {
                    return (
                        <FontAwesomeIcon className="imageIcon" icon={faImage}/>
                    );
                }
            } else {
                if (this.state.imageUrl) {
                    return (
                        <img className="animal_card_image" alt={this.props.animal.name}
                             src={this.state.imageUrl}/>
                    );
                } else {
                    return (
                        <FontAwesomeIcon className="imageIcon" icon={faImage}/>
                    );
                }
            }

        }

        return (
            <div className="animal_card" onClick={this.props.onClick}>
                {this.props.largeCard ? (
                    <div className="close">
                        <FontAwesomeIcon className="closeIcon" icon={faTimes} onClick={this.props.close}/>
                    </div>) : null}
                <div className="animal_card_name">{this.props.animal.name}</div>
                <div className="gallery_wrapper">
                    {gallery()}
                </div>

                {this.props.largeCard ? (
                    <div className="large_card_content">
                        <div className="info">
                            <div className="animal_card_info_age">
                                <h3>Věk:</h3>
                                <span>{this.props.animal.age}</span>
                            </div>
                            <div className="animal_card_sex">
                                <h3>Pohlaví:</h3>
                                <span>pes</span>
                            </div>
                            <div className="animal_card_info_dist">
                                <h3>Vzdálenost:</h3>
                                <span>TODO km</span>
                            </div>
                        </div>
                        <div className="desc">
                            <h3>Popis:</h3>
                            <div className="desc_text">{this.props.animal.desc}</div>
                        </div>
                        <div className="buttons">
                            <button className="Button contact" onClick={this.contact}>Kontaktovat</button>
                        </div>
                    </div>
                ) : (
                    this.props.swipeCard ?
                        (
                            <div className="large_card_content">
                                <div className="info">
                                    <div className="animal_card_info_age">
                                        <h3>Věk:</h3>
                                        <span>{this.props.animal.age}</span>
                                    </div>
                                    <div className="animal_card_info_dist">
                                        <h3>Vzdálenost:</h3>
                                        <span>TODO km</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="small_card_content">
                                <div className="animal_card_info_age">
                                    <span>{this.props.animal.age}</span>
                                </div>
                                <div className="animal_card_info_dist">
                                    <span>TODO km</span>
                                </div>
                            </div>
                        )
                )}
            </div>
        )
    }

}

export default onClickOutside(AnimalCard);
