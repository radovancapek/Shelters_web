import React, {Component} from "react";
import "./AddAnimal.scss";
import {db, storage, auth} from "../../Firebase/Firebase"
import * as Const from "../../../Const"
import Checkbox from '@material-ui/core/Checkbox';
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GalleryImage from "../AnimalCard/GalleryImage";
import CircularProgress from '@material-ui/core/CircularProgress';
import {ANIMALS, UPLOADING, WAIT_INTERVAL} from "../../../Const";
import {v4 as uuidv4} from 'uuid';
import Switch from "@material-ui/core/Switch";
import {Redirect} from "react-router-dom";
import {searchService} from "../../../Utils/HERE";
import Breeds from "../../../assets/files/breeds.json";
import {withTranslation} from "react-i18next";

class AddAnimal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animal: {
                type: Const.DOGS,
                name: "",
                age: "",
                breed: "",
                gender: Const.MALE,
                desc: "",
                behaviorMap: {},
                images: [],
                image: null,
                user: auth.currentUser.uid,
                location: {}
            },
            breeds: Breeds.breeds,
            filteredBreeds: Breeds.breeds,
            showBreeds: false,
            imagesStoragePaths: [],
            genderBool: false,
            image: "",
            filenames: [],
            downloadURLs: [],
            isUploading: false,
            uploadProgress: 0,
            file: null,
            newFile: null,
            url: "",
            mainImageUrl: null,
            mainImageIndex: 0,
            selectedImageIndex: 0,
            urlList: [],
            newFiles: [],
            files: [],
            showImagePlaceholder: true,
            percentUploaded: 0,
            uploadState: null,
            otherActive: false,
            catsActive: false,
            dogsActive: true,
            address: "",
            searchResults: [],
            showSearchResults: false,
            imageUrlList: [],
            galleryImagesLoaded: false,
            imageCount: 0
        };
    }

    componentWillMount() {
        this.timer = null;
    }

    componentDidMount() {
        if (this.props.location.state) {
            const animal = this.props.location.state.animal
            this.setState({
                animal: animal,
                animalId: this.props.location.state.animalId,
                imagesStoragePaths: animal.images || []
            }, () => {
                console.log("new imagesStoragePaths", this.state.imagesStoragePaths);
            });
            if (animal.location) {
                this.setState({address: animal.location.title})
            }
            if (animal.images && animal.images.length > 0) {
                this.loadImages();
            }
        } else {
            const tmpBehaviorMap = {};
            Const.BEHAVIOR_MAP.get(this.state.animal.type).map((behavior) => {
                tmpBehaviorMap[behavior] = false;
                return null;
            });
            this.setState(prevState => ({
                animal: {
                    ...prevState.animal, behaviorMap: tmpBehaviorMap
                }
            }));
        }
    }

    loadImages = () => {
        let images = [];
        const promises = this.props.location.state.animal.images.map(imageUrl => {
            const ref = storage.ref();
            const imageRef = ref.child(imageUrl)
            return imageRef.getDownloadURL()
                .then((url) => {
                    images.push(url.toString());
                    this.setState({urlList: [...this.state.urlList, url]});
                })
                .catch(function (error) {
                    console.log("Error " + error.message);
                });
        });

        Promise.allSettled(promises).then(downloadURLs => {
            this.setState({galleryImagesLoaded: true, imageCount: downloadURLs.length})
        });
    }

    updateInput = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevState => ({
            animal: {
                ...prevState.animal, [name]: value
            }
        }));
    }

    addAnimal = () => {
        const images = this.state.imagesStoragePaths;
        this.setState(prevState => ({
            animal: {
                ...prevState.animal, images: images
            }
        }), () => {
            console.log("animal images", this.state.animal.images);
            if (this.state.animalId) {
                console.log(this.state.animal);
                db.collection(ANIMALS).doc(this.state.animalId)
                    .set(this.state.animal, {merge: true})
                    .then(() => {
                        this.setState({uploadState: 'done'});
                    })
                    .catch((error) => {
                        console.log("addAnimal error", error);
                    })
            } else {
                db.collection(ANIMALS)
                    .add(this.state.animal)
                    .then(() => {
                        this.setState({uploadState: 'done'});
                    })
                    .catch((error) => {
                        console.log("addAnimal error", error);
                    })
            }
        });
    };

    handleChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            this.setState({
                newFile: e.target.files[0],
                files: [...this.state.files, e.target.files[0]],
                urlList: [...this.state.urlList, url],
                showImagePlaceholder: false
            })
            if (!this.state.mainImageUrl) {
                this.setState({
                    mainImageIndex: 0
                })
            }
        }
    }

    handleUpload = (e) => {
        e.preventDefault();
        this.setState({uploadState: UPLOADING});
        const promises = [];
        let files = this.state.files;
        for (let i = 0; i < files.length; i++) {
            const imageStoragePath = "/images/" + this.state.animal.name + "-" + uuidv4();
            if (i === 0) {
                this.setState(prevState => ({
                    animal: {
                        ...prevState.animal, image: imageStoragePath
                    }
                }));
            }
            const uploadTask = storage.ref(imageStoragePath).put(files[i]);
            promises.push(uploadTask);
            uploadTask.on("state_changed",
                snapshot => {
                    const percentUploaded = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    this.setState({percentUploaded});
                },
                error => {
                    console.log(error.code);
                    this.setState({uploadState: 'error'});
                },
                () => {
                    const downloadURL = uploadTask.snapshot.ref.getDownloadURL();
                    this.setState({
                        downloadURLs: [...this.state.downloadURLs, downloadURL],
                        imagesStoragePaths: [...this.state.imagesStoragePaths, imageStoragePath]
                    });
                });

        }
        Promise.allSettled(promises)
            .then(() => {
                console.log('All files uploaded');
                this.addAnimal();
            })
            .catch(err => console.log(err.code));
    }


    handleGenderChange = e => {
        e.target.checked ? this.setState(prevState => ({
            animal: {
                ...prevState.animal, gender: Const.FEMALE
            }
        })) : this.setState(prevState => ({
            animal: {
                ...prevState.animal, gender: Const.MALE
            }
        }));
        this.setState({genderBool: e.target.checked});
    }

    handleCheckboxChange = e => {
        const key = e.target.name;
        const value = e.target.checked;
        const tmpBehaviorMap = this.state.animal.behaviorMap;
        tmpBehaviorMap[key] = value;
        this.setState(prevState => ({
            animal: {
                ...prevState.animal, behaviorMap: tmpBehaviorMap
            }
        }));
    }

    changeAnimalType = (type) => {
        const tmpBehaviorMap = {};
        Const.BEHAVIOR_MAP.get(type).map((behavior) => {
            tmpBehaviorMap[behavior] = false;
            return null;
        });

        this.setState(prevState => ({
            animal: (Object.assign(prevState.animal, {behaviorMap: tmpBehaviorMap}))
        }));

        switch (type) {
            case Const.DOGS:
                this.setState(prevState => ({
                    dogsActive: true,
                    catsActive: false,
                    otherActive: false
                }));
                break;
            case Const.CATS:
                this.setState({
                    dogsActive: false,
                    catsActive: true,
                    otherActive: false,
                });
                break;
            case Const.OTHER:
                this.setState({
                    dogsActive: false,
                    catsActive: false,
                    otherActive: true,
                });
                break;
            default:
                break;
        }
    }

    setMainImage = (index, e) => {
        this.setState(prevState => {
            let urlList = [...prevState.urlList];
            let temp = urlList[index];
            urlList[index] = urlList[0];
            urlList[0] = temp;
            return {urlList};
        })


        this.setState({
            mainImageIndex: index
        });
    }

    updateBreed = (e) => {
        let query = e.target.value;

        this.setState(prevState => ({
            filteredBreeds: this.state.breeds.filter(breed => breed.toLowerCase().includes(query.toLowerCase())),
            animal: {
                ...prevState.animal, breed: query
            },
            showBreeds: true
        }));
    }

    handleBreedInputClick = (e) => {
        e.preventDefault();
        this.setState({
            showBreeds: false
        })
    }

    handleBreedClick = (breed) => {
        this.setState(prevState => ({
            animal: {
                ...prevState.animal, breed: breed
            },
            showBreeds: false
        }));
    }

    handleSearchChange = (e) => {
        clearTimeout(this.timer);

        this.setState({address: e.target.value});

        if (e.target.value.length >= 2) {
            this.timer = setTimeout(this.search, WAIT_INTERVAL);
        }
    }

    search = () => {
        searchService.geocode({
            q: this.state.address,
            in: "countryCode:CZE,SVK,DEU,POL,AUT"
        }, (result) => {
            //let {position, title} = result.items[0];
            console.log(result.items);
            this.setState({searchResults: result.items, showSearchResults: true})

        }, (error) => {
            console.log("Error", error);
        });
    }

    handleSearchItemClick = (result) => {
        this.setState(prevState => ({
            address: result.title,
            animal: {
                ...prevState.animal, location: result
            },
            showSearchResults: false
        }));
    }

    handleSearchClick = (e) => {
        e.preventDefault();
        this.setState({
            showSearchResults: !this.state.showSearchResults
        })
    }

    render() {
        const {t} = this.props;
        if (this.state.uploadState === "done") {
            return (
                <Redirect
                    to={{
                        pathname: "/myanimals"
                    }}
                />
            );
        }
        let galleryImages = this.state.urlList.map((url, i) => {
            if (i !== 0) {
                return (
                    <GalleryImage hover={true} src={url} onClick={(e) => {
                        this.setMainImage(i, e)
                    }} key={i}/>
                );
            }
            return null;
        });

        let behaviorCheckboxes =
            Object.entries(this.state.animal.behaviorMap).map(([key, value], i) => {
                return (
                    <div className={"addAnimal_form_input_behavior_" + i} key={i}>
                        <label>{t('animals.behavior.' + key)}</label>
                        <Checkbox type="checkbox"
                                  className="Input Input_checkbox"
                                  name={key}
                                  checked={value}
                                  onChange={this.handleCheckboxChange}
                        />
                    </div>
                );
            });

        let searchResults = this.state.searchResults.map((result, i) => {
            return (
                <div className="result_item" key={i} onMouseDown={(e) => {
                    e.preventDefault();
                    this.handleSearchItemClick(result);
                }}>{result.title}</div>
            );
        });

        let breeds = this.state.filteredBreeds.map((breed, i) => {
            return (
                <div className="result_item" key={i} onMouseDown={(e) => {
                    e.preventDefault();
                    this.handleBreedClick(breed);
                }}>{breed}</div>
            );
        });

        return (
            <div className="addAnimal">
                <form className="addAnimal_form" onSubmit={this.addAnimal}>
                    <div className="addAnimal_form_buttons">
                        <div
                            className={"Button Button_light Button_small " + this.state.dogsActive}
                            id="buttonDogs"
                            onClick={() => this.changeAnimalType(Const.DOGS)}>{t('animals.dogs.dogs')}
                        </div>
                        <div className={"Button Button_light Button_small " + this.state.catsActive}
                             id="buttonCats"
                             onClick={() => this.changeAnimalType(Const.CATS)}>{t('animals.cats.cats')}
                        </div>
                        <div className={"Button Button_light Button_small " + this.state.otherActive}
                             id="buttonOther"
                             onClick={() => this.changeAnimalType(Const.OTHER)}>{t('animals.other.other')}
                        </div>
                    </div>
                    <div className="Input_wrapper Input_wrapper_name">
                        <span className="Input_label">{t('name')}</span>
                        <input className="Input Input_text addAnimal_form_name" type="text" name="name"
                               onChange={this.updateInput} value={this.state.animal.name}/>
                    </div>
                    <div className="Input_wrapper Input_wrapper_age">
                        <span className="Input_label">{t('animals.age')}</span>
                        <input className="Input Input_text addAnimal_form_age" type="text" name="age"
                               onChange={this.updateInput} value={this.state.animal.age}/>
                    </div>
                    <div className="autocomplete breedWrapper" onBlur={this.handleBreedInputClick}>
                        <div className="Input_wrapper Input_wrapper_breed">
                            <span className="Input_label">{t('animals.breed') + ":"}</span>
                            <input className="Input Input_text addAnimal_form_breed" autoComplete="off" type="text" name="breed"
                                   onChange={this.updateBreed} onFocus={this.updateBreed} value={this.state.animal.breed}/>
                            {
                                this.state.showBreeds ?
                                    <div className="searchResults">{breeds}</div> : null
                            }
                        </div>
                    </div>
                    <div className="addAnimal_form_behavior">
                        {behaviorCheckboxes}
                    </div>
                    <div className="addAnimal_form_gender">
                        <h4>{t('animals.gender') + ":"}</h4>
                        <div className="addAnimal_form_gender_input">
                            <div>{t("animals." + this.state.animal.type + ".male")}</div>
                            <Switch
                                checked={this.state.genderBool}
                                onChange={this.handleGenderChange}
                                name="genderBool"
                                inputProps={{'aria-label': 'secondary checkbox'}}
                            />
                            <div>{t("animals." + this.state.animal.type + ".female")}</div>
                        </div>
                    </div>
                    <div className="addAnimal_form_desc">
                        <textarea name="desc" placeholder={t('animals.desc') + ":"} onChange={this.updateInput}
                                  className="addAnimal_form_desc_textArea" value={this.state.animal.desc}/>
                    </div>
                    <div className="addAnimal_form_map autocomplete">
                        <div className="Input_wrapper">
                            <span className="Input_label">{t('address') + ":"}</span>
                            <input className="Input Input_text" type="text" autoComplete="off" value={this.state.address}
                                   onChange={this.handleSearchChange} onBlur={this.handleSearchClick}/>
                            {
                                this.state.showSearchResults ?
                                    <div className="searchResults">{searchResults}</div> :
                                    null
                            }
                        </div>
                    </div>
                    <div className="addAnimal_form_mainImage">
                        {this.state.urlList[0] ?
                            <GalleryImage main="mainImage" src={this.state.urlList[0]}/>
                            :
                            <FontAwesomeIcon className="imageIcon" icon={faImage}/>
                        }
                    </div>
                    <div className="gallery">
                        {galleryImages}
                        <div className="addImage galleryImage">
                            <input id="files" type="file" onChange={this.handleChange} className="addImage_input"/>
                            <label htmlFor="files" className="addImage_label">+</label>
                        </div>
                    </div>

                    <div className="Button light submit" onClick={this.handleUpload}>
                        {this.state.uploadState === "uploading" ?
                            <CircularProgress progress={this.state.percentUploaded}/>
                            : t('confirm')}</div>
                </form>
            </div>
        )
    }

}

export default withTranslation()(AddAnimal)
