import React, {Component} from "react";
import "./AddAnimal.scss";
import {auth, db, storage, timestamp} from "../../Firebase/Firebase"
import * as Const from "../../../Const"
import {
    ACTIVE,
    ANIMALS,
    CATS,
    DISABLED,
    DOGS,
    OTHER,
    SIZE_BIG,
    SIZE_MEDIUM,
    SIZE_SMALL,
    UPLOADING,
    WAIT_INTERVAL
} from "../../../Const"
import Checkbox from '@material-ui/core/Checkbox';
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GalleryImage from "../AnimalCard/GalleryImage";
import CircularProgress from '@material-ui/core/CircularProgress';
import {v4 as uuidv4} from 'uuid';
import Switch from "@material-ui/core/Switch";
import {Redirect} from "react-router-dom";
import {searchService} from "../../../Utils/HERE";
import Breeds from "../../../assets/files/breeds.json";
import {withTranslation} from "react-i18next";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Slider from "@material-ui/core/Slider";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

class AddAnimal extends Component {

    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
            edit: false,
            back: false,
            adopted: false,
            delete: false,
            openDeleteDialog: false,
            animal: {
                type: Const.DOGS,
                adopted: false,
                name: "",
                age: "",
                size: SIZE_SMALL,
                weight: 0,
                chip: "",
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
            otherActive: "",
            catsActive: "",
            dogsActive: ACTIVE,
            address: "",
            searchResults: [],
            showSearchResults: false,
            imageUrlList: [],
            galleryImagesLoaded: false,
            imageCount: 0
        };
    }

    componentDidMount() {
        if (this.props.location.state) {
            const animal = this.props.location.state.animal
            const mergedAnimal = {...this.state.animal, ...animal};
            this.setState(prevState => ({
                animal: mergedAnimal,
                edit: true,
                animalId: this.props.location.state.animalId,
                imagesStoragePaths: animal.images || []
            }));
            animal.type === DOGS ? this.setState({dogsActive: ACTIVE}) : this.setState({dogsActive: DISABLED});
            animal.type === CATS ? this.setState({catssActive: ACTIVE}) : this.setState({catsActive: DISABLED});
            animal.type === OTHER ? this.setState({otherActive: ACTIVE}) : this.setState({otherActive: DISABLED});
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
                ...prevState.animal, images: images,
                ...prevState.animal, age: parseInt(prevState.animal.age)
            }
        }), () => {
            console.log("typeof", typeof this.state.animal.age);
            if (this.state.animalId) {
                db.collection(ANIMALS).doc(this.state.animalId)
                    .set(this.state.animal, {merge: true})
                    .then(() => {
                        this.setState({uploadState: 'done'});
                    })
                    .catch((error) => {
                        console.log("addAnimal error", error);
                    })
            } else {
                this.setState(prevState => ({
                    animal: {
                        ...prevState.animal, created: timestamp.now(),
                    }
                }), () => {
                    db.collection(ANIMALS)
                        .add(this.state.animal)
                        .then(() => {
                            this.setState({uploadState: 'done'});
                        })
                        .catch((error) => {
                            console.log("addAnimal error", error);
                        })
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
                    },
                    imagesStoragePaths: [...this.state.imagesStoragePaths, imageStoragePath]
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
                        downloadURLs: [...this.state.downloadURLs, downloadURL]
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

    handleBack = () => {
        this.setState({
            back: true
        });
    }

    handleOpenDialog = () => {
        this.setState({openDeleteDialog: true});
    }

    handleDialogClose = () => {
        this.setState({
            openDeleteDialog: false
        });
    }

    handleAdopted = () => {
        db.collection(ANIMALS).doc(this.state.animalId)
            .update({"adopted": !this.state.animal.adopted})
            .then(() => {
                this.setState({adopted: true});
            })
            .catch((error) => {
                console.log("adopt animal error", error);
            })
    }

    handleDelete = () => {
        db.collection("animals").doc(this.state.animalId).delete().then(() => {
            console.log("Document successfully deleted!");
            this.setState({delete: true});
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
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

    handleWeightChange = (event, newValue) => {
        const newWeight = newValue;
        this.setState(prevState => ({
            animal: {
                ...prevState.animal, weight: newWeight
            }
        }));
    }

    changeAnimalType = (type) => {
        if (this.state.edit) {
            return;
        }
        const tmpBehaviorMap = {};
        Const.BEHAVIOR_MAP.get(type).map((behavior) => {
            tmpBehaviorMap[behavior] = false;
            return null;
        });

        this.setState(prevState => ({
            animal: (Object.assign(prevState.animal, {
                behaviorMap: tmpBehaviorMap,
                type: type
            }))
        }));

        switch (type) {
            case Const.DOGS:
                this.setState(prevState => ({
                    dogsActive: ACTIVE,
                    catsActive: "",
                    otherActive: ""
                }));
                break;
            case Const.CATS:
                this.setState({
                    dogsActive: "",
                    catsActive: ACTIVE,
                    otherActive: "",
                });
                break;
            case Const.OTHER:
                this.setState({
                    dogsActive: "",
                    catsActive: "",
                    otherActive: ACTIVE,
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
        if ((this.state.uploadState === "done") || this.state.back || this.state.delete || this.state.adopted) {
            return (
                <Redirect
                    to={{
                        pathname: "/my-animals"
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
                    <div className="addAnimal_form_gender">
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
                            <input className="Input Input_text addAnimal_form_breed" autoComplete="off" type="text"
                                   name="breed"
                                   onChange={this.updateBreed} onFocus={this.updateBreed}
                                   value={this.state.animal.breed}/>
                            {
                                this.state.showBreeds ?
                                    <div className="searchResults">{breeds}</div> : null
                            }
                        </div>
                    </div>
                    <div className="Input_wrapper Input_wrapper_chip">
                        <span className="Input_label">{t('animals.chip') + ":"}</span>
                        <input className="Input Input_text addAnimal_form_chip" type="text" name="chip"
                               onChange={this.updateInput} value={this.state.animal.chip}/>
                    </div>
                    <div className="Input_wrapper_size">
                        <h4>{t('animals.size') + ":"}</h4>
                        <RadioGroup aria-label="animalSize" name="size" value={this.state.animal.size}
                                    onChange={this.updateInput}>
                            <FormControlLabel value={SIZE_SMALL} control={<Radio/>} label={t('animals.' + SIZE_SMALL)}/>
                            <FormControlLabel value={SIZE_MEDIUM} control={<Radio/>}
                                              label={t('animals.' + SIZE_MEDIUM)}/>
                            <FormControlLabel value={SIZE_BIG} control={<Radio/>} label={t('animals.' + SIZE_BIG)}/>
                        </RadioGroup>
                    </div>
                    <div className="Input_wrapper_weight">
                        <h4>{t('animals.weight') + ": (kg)"}</h4>
                        <Slider
                            value={this.state.animal.weight}
                            name="weight"
                            onChange={this.handleWeightChange}
                            valueLabelDisplay="on"
                            min={0}
                            max={80}
                            marks={[
                                {
                                    value: 0,
                                    label: '0',
                                },
                                {
                                    value: 80,
                                    label: '80',
                                }]}
                        />
                    </div>
                    <div className="addAnimal_form_behavior">
                        {behaviorCheckboxes}
                    </div>
                    <div className="addAnimal_form_desc">
                        <textarea name="desc" placeholder={t('animals.desc') + ":"} onChange={this.updateInput}
                                  className="addAnimal_form_desc_textArea" value={this.state.animal.desc}/>
                    </div>
                    <div className="addAnimal_form_map autocomplete">
                        <div className="Input_wrapper">
                            <span className="Input_label">{t('address') + ":"}</span>
                            <input className="Input Input_text" type="text" autoComplete="off"
                                   value={this.state.address}
                                   onChange={this.handleSearchChange} onBlur={this.handleSearchClick}/>
                            {
                                this.state.showSearchResults ?
                                    <div className="searchResults">{searchResults}</div> :
                                    null
                            }
                        </div>
                    </div>
                    <div className="addAnimal_form_imagesWrapper">
                        <div className="mainImage">
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
                    </div>

                    <div className="buttons">
                        <div className="Button light submit" onClick={this.handleUpload}>
                            {this.state.uploadState === "uploading" ?
                                <CircularProgress progress={this.state.percentUploaded}/>
                                : t('save')}
                        </div>
                        {this.state.edit && (
                            <>
                                <div className="Button light submit" onClick={this.handleBack}>
                                    {t('back')}
                                </div>
                                {this.state.animalId && (
                                    this.state.animal.adopted ? (
                                        <div className="Button light submit" onClick={this.handleAdopted}>
                                            {t('returnToOffer')}
                                        </div>
                                    ) : (
                                        <div className="Button light submit" onClick={this.handleAdopted}>
                                            {t('adopted')}
                                        </div>
                                    )
                                )}

                                <div className="Button light submit" onClick={this.handleOpenDialog}>
                                    {t('delete')}
                                </div>
                            </>
                        )}
                    </div>

                </form>
                <Dialog className="dialog" open={this.state.openDeleteDialog} onClose={this.handleDialogClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{t('reallyWantToDelete')}</DialogTitle>
                    <DialogActions>
                        <button className="Button dialog_confirm_button" onClick={this.handleDialogClose}>
                            {t('close')}
                        </button>
                        <button className="Button dialog_close_button"
                                onClick={this.handleDelete}>
                            {t('delete')}
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}

export default withTranslation()(AddAnimal)
