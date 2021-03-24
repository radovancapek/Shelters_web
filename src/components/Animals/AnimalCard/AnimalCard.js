import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import "./AnimalCard.scss";
import {auth, storage} from "../../Firebase/Firebase"
import {faImage, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ImageGallery from "react-image-gallery";
import onClickOutside from "react-onclickoutside";
import CircularProgress from '@material-ui/core/CircularProgress';


//TODO vzdalenost podle polohy nas a zvirete
class AnimalCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
            mainImageLoaded: false,
            galleryImagesLoaded: false,
            imageUrl: null,
            imageUrlList: [],
            imageCount: null,
            location: null,
            editAnimal: false,
            isUsersAnimal: false
        };
    }

    componentDidMount() {
        this.setState({mounted: true});
        this.loadImage();
        this.getDistance();
        if (this.props.gallery && this.props.animal.images) {
            this.loadImages();
        }

        if(auth.currentUser.uid === this.props.animal.user) {
            this.setState({isUsersAnimal: true});
        }

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
            return imageRef.getDownloadURL()
                .then((url) => {
                    images.push(url.toString());
                    this.setState({imageUrlList: [...this.state.imageUrlList, url]});
                })
                .catch(function (error) {
                    console.log("Error " + error.message);
                });
        });

        Promise.allSettled(promises).then(downloadURLs => {
            this.setState({galleryImagesLoaded: true, imageCount: downloadURLs.length})
        })
    }

    setImageUrl = (url) => {
        this.setState({imageUrl: url});
    }

    handleImageLoaded = () => {
        this.setState({mainImageLoaded: true});
    }

    handleImageError = () => {
        this.setState({mainImageLoaded: false});
    }

    getDistance = () => {
        //console.log(this.props.location);
        if(this.props.location && this.props.animal.location) {
            this.setState({location: this.props.animal.location.position.lat});
        }
    }

    contact = () => {

    }

    editAnimal = () => {
        this.setState({editAnimal: true});
    }

    render() {
        if(this.state.editAnimal) {
            return (
                <Redirect
                    to={{
                        pathname: "/edit",
                        state: { animal: this.props.animal, animalId: this.props.animalId }
                    }}
                />
            );
        }

        let images = [];

        this.state.imageUrlList.map((url, i) => {
            images.push({original: url, thumbnail: url});
            return 0;
        });

        const gallery = () => {
            if (this.props.gallery) {
                if (this.state.galleryImagesLoaded) {
                    if (this.state.imageCount > 0) {
                        return (
                            <ImageGallery items={images} showBullets={true} lazyLoad={true}/>
                        );
                    } else {
                        return (
                            <div className="placeholder">
                                <FontAwesomeIcon className="imageIcon" icon={faImage}/>
                                <div className="placeholder_text">Nemá obrázek</div>
                            </div>
                        );
                    }
                } else {
                    return (
                        <CircularProgress/>
                    );
                }
            } else {
                if (this.props.animal.image) {
                    if (this.state.imageUrl) {
                        return (
                            <img className="animal_card_image" alt={this.props.animal.name}
                                 src={this.state.imageUrl} onLoad={this.handleImageLoaded}
                                 onError={this.handleImageError}/>
                        );
                    } else {
                        return (
                            <div className="placeholder">
                                <CircularProgress/>
                            </div>
                        );
                    }
                } else {
                    return (
                        <div className="placeholder">
                            <FontAwesomeIcon className="imageIcon" icon={faImage}/>
                            <div className="placeholder_text">Nemá obrázek</div>
                        </div>
                    );
                }
            }

        }

        return (
            <div className="animal_card" onClick={this.props.onClick}>
                {this.props.largeCard ? (
                        <div className="close">
                            <FontAwesomeIcon className="closeIcon" icon={faTimes} onClick={this.props.close}/>
                        </div>)
                    : null
                }
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
                            <div className="animal_card_gender">
                                <h3>Pohlaví:</h3>
                                <span>{this.props.animal.gender}</span>
                            </div>
                            <div className="animal_card_info_dist">
                                <h3>Vzdálenost:</h3>
                                <span>{this.state.location}</span>
                            </div>
                        </div>
                        <div className="desc">
                            <h3>Popis:</h3>
                            <div className="desc_text">{this.props.animal.desc}</div>
                        </div>
                        <div className="buttons">
                            {!this.state.isUsersAnimal && <button className="Button contact" onClick={this.contact}>Kontaktovat</button>}
                            {this.state.isUsersAnimal && <button className="Button edit" onClick={this.editAnimal}>Editovat</button>}
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
                                        <span>{this.state.location}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="small_card_content">
                                <div className="animal_card_info_age">
                                    <span>{this.props.animal.age}</span>
                                </div>
                                <div className="animal_card_info_dist">
                                    <span>{this.state.location}</span>
                                </div>
                            </div>
                        )
                )}
            </div>
        )
    }

}

export default onClickOutside(AnimalCard);
