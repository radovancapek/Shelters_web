import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import "./AnimalCard.scss";
import {auth, storage} from "../../Firebase/Firebase"
import {faImage, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ImageGallery from "react-image-gallery";
import onClickOutside from "react-onclickoutside";
import CircularProgress from '@material-ui/core/CircularProgress';
import {withTranslation} from 'react-i18next';
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";


//TODO vzdalenost podle polohy nas a zvirete
class AnimalCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
            loggedIn: false,
            mainImageLoaded: false,
            galleryImagesLoaded: false,
            imageUrl: null,
            imageUrlList: [],
            imageCount: null,
            location: null,
            editAnimal: false,
            isUsersAnimal: false,
            contactAnimal: false,
            shelterRedirect: false
        };
    }

    componentDidMount() {
        this.setState({mounted: true});
        this.loadImage();
        this.getDistance();
        if (this.props.gallery && this.props.animal.images) {
            this.loadImages();
        }

        if ((this.props.loggedId === this.props.animal.user) || (auth.currentUser && (auth.currentUser.uid === this.props.animal.user))) {
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
        if (this.props.location && this.props.animal.location) {
            this.setState({location: this.props.animal.location.position.lat});
        }
    }

    contact = () => {
        this.setState({contactAnimal: true});
    }

    editAnimal = () => {
        this.setState({editAnimal: true});
    }

    shelterProfile = () => {
        this.setState({shelterRedirect: true});
    }

    render() {
        const {t} = this.props;
        const loggedIn = this.props.loggedId != null;
        const adopted = this.props.animal.adopted ? " adopted" : "";
        if (this.state.editAnimal) {
            return (
                <Redirect
                    to={{
                        pathname: "/edit",
                        state: {animal: this.props.animal, animalId: this.props.animalId}
                    }}
                />
            );
        }

        if (this.state.contactAnimal) {
            return (
                <Redirect
                    to={{
                        pathname: "/messages",
                        state: {animal: this.props.animal, animalId: this.props.animalId}
                    }}
                />
            );
        }

        if (this.state.shelterRedirect) {
            return (
                <Redirect
                    to={{
                        pathname: "/profile",
                        state: {id: this.props.animal.user}
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
        let age = "";
        if (this.props.animal.age === 1) {
            age = this.props.animal.age.toString() + " rok";
        } else if (this.props.animal.age > 1 && this.props.animal.age < 5) {
            age = this.props.animal.age.toString() + " roky";
        } else {
            age = this.props.animal.age.toString() + " let";
        }

        const behavior = Object.entries(this.props.animal.behaviorMap).map(([key, value], i) => {
            if (value) {
                return (
                    <div className={"behavior_content_item"} key={i}>{t('animals.behavior.' + key)}</div>
                );
            }
            return null;
        });

        const hasCity = this.props.animal.location && this.props.animal.location.address && this.props.animal.location.address.city;

        return (
            <div className={"animal_card" + adopted} onClick={this.props.onClick}>
                {this.props.largeCard ? (
                        <div className="close">
                            <FontAwesomeIcon className="closeIcon" icon={faTimes} onClick={this.props.close}/>
                        </div>)
                    : null
                }
                <div className="animal_card_name">{this.props.animal.name}</div>

                {this.props.largeCard ? (
                    <div className="gallery_wrapper large">
                        {gallery()}
                    </div>
                ) : (
                    <div className="gallery_wrapper">
                        {gallery()}
                    </div>
                )}

                {this.props.largeCard ? (
                    <div className="large_card_content">
                        <div className="info">
                            <div className="animal_card_info_age">
                                <h3>Věk:</h3>
                                <span>{age}</span>
                            </div>
                            <div className="animal_card_gender">
                                <h3>{t('animals.gender') + ":"}</h3>
                                <span>{t("animals." + this.props.animal.type + "." + this.props.animal.gender)}</span>
                            </div>
                            <div className="animal_card_breed">
                                <h3>{t('animals.breed') + ":"}</h3>
                                {this.props.animal.breed ? (
                                    <span>{this.props.animal.breed}</span>
                                ) : (
                                    <span>{t('unspecified')}</span>
                                )}
                            </div>
                            <div className="animal_card_size">
                                <h3>{t('animals.size') + ":"}</h3>
                                {this.props.animal.size ? (
                                    <span>{t('animals.' + this.props.animal.size)}</span>
                                ) : (
                                    <span>{t('unspecified')}</span>
                                )}
                            </div>
                            <div className="animal_card_weight">
                                <h3>{t('animals.weight') + ":"}</h3>
                                {this.props.animal.weight ? (
                                    <span>{this.props.animal.weight + " kg"}</span>
                                ) : (
                                    <span>{t('unspecified')}</span>
                                )}
                            </div>
                            <div className="animal_card_info_dist">
                                <h3>{t('location') + ":"}</h3>
                                {hasCity ? (
                                    <span>{this.props.animal.location.address.city}</span>
                                ) : (
                                    <span>{t('unspecified')}</span>
                                )}
                            </div>
                        </div>
                        <div className="behavior">
                            <h3>{t('animals.behavior.behavior') + ":"}</h3>
                            <div className="behavior_content">{behavior}</div>
                        </div>
                        <div className="desc">
                            <h3>{t('animals.desc') + ":"}</h3>
                            <div className="desc_text">{this.props.animal.desc}</div>
                        </div>
                        <div className="buttons">
                            {!this.state.isUsersAnimal && (
                                this.props.loggedId ? (
                                    <>
                                        <button className="Button contact" disabled={!loggedIn}
                                                onClick={this.contact}>{t('contact')}</button>
                                        <button className="Button contact" disabled={!loggedIn}
                                                onClick={this.shelterProfile}>{t('shelterProfile')}</button>
                                    </>
                                ) : (
                                    <>
                                        <Tooltip title={t('needToLogin')} placement="top" arrow enterDelay={0}
                                                 enterNextDelay={0} leaveDelay={200}>
                                            <span>
                                                <Button className="Button contact" disabled={!loggedIn}
                                                        onClick={this.contact}>{t('contact')}</Button>
                                            </span>
                                        </Tooltip>
                                        <Tooltip title={t('needToLogin')} placement="top" arrow enterDelay={0}
                                                 enterNextDelay={0} leaveDelay={200}>
                                            <span>
                                                <Button className="Button contact" disabled={!loggedIn}
                                                        onClick={this.shelterProfile}>{t('shelterProfile')}</Button>
                                            </span>
                                        </Tooltip>
                                    </>
                                )

                            )}
                            {this.state.isUsersAnimal &&
                            <button className="Button edit" onClick={this.editAnimal}>{t('edit')}</button>}
                        </div>
                    </div>
                ) : (
                    this.props.swipeCard ?
                        (
                            <div className="large_card_content">
                                <div className="info">
                                    <div className="animal_card_info_age">
                                        <h3>{t('animals.age') + ":"}</h3>
                                        <span>{age}</span>
                                    </div>
                                    <div className="animal_card_info_dist">
                                        <h3>{t('location') + ":"}</h3>
                                        {hasCity &&
                                        <span>{this.props.animal.location.address.city}</span>}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="small_card_content">
                                <div className="animal_card_info_age">
                                    <span>{age}</span>
                                </div>
                                <div className="animal_card_info_dist">
                                    {hasCity &&
                                    <span>{this.props.animal.location.address.city}</span>}
                                </div>
                            </div>
                        )
                )}
                {this.props.animal.adopted && (
                    <div className="small_card_content_adopted">
                        <span className="adopted-text">{t('adopted')}</span>
                    </div>
                )}
            </div>
        )
    }

}

export default withTranslation()(onClickOutside(AnimalCard))
