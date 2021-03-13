import React, {Component} from "react";
import "./AddAnimal.scss";
import {db, storage, auth} from "../../Firebase/Firebase"
import * as Const from "../../../Const"
import Checkbox from '@material-ui/core/Checkbox';
import {faImage} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import GalleryImage from "../AnimalCard/GalleryImage";
import CircularProgress from '@material-ui/core/CircularProgress';
import {ANIMALS, UPLOADING} from "../../../Const";
import {v4 as uuidv4} from 'uuid';
import Switch from "@material-ui/core/Switch";


class AddAnimal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animalType: Const.DOGS,
            name: "",
            age: "",
            genderBool: false,
            gender: Const.MALE,
            image: "",
            filenames: [],
            imagesStoragePaths: [],
            downloadURLs: [],
            isUploading: false,
            uploadProgress: 0,
            file: null,
            newFile: null,
            url: "",
            mainImageUrl: null,
            mainImageIndex: 0,
            mainImageStoragePath: null,
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
            behaviorMap: {}
        };
    }

    componentDidMount() {
        const tmpBehaviorMap = {};
        Const.BEHAVIOR_MAP.get(this.state.animalType).map((behavior) => {
            tmpBehaviorMap[behavior] = false;
            return null;
        });
        this.setState({
            behaviorMap: tmpBehaviorMap
        });
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }


    addAnimal = () => {
        db.collection(ANIMALS).add(
            {
                type: this.state.animalType,
                name: this.state.name,
                age: parseInt(this.state.age, 10),
                gender: this.state.gender,
                desc: this.state.desc,
                behaviorMap: this.state.behaviorMap,
                image: this.state.mainImageStoragePath,
                images: this.state.imagesStoragePaths,
                user: auth.currentUser.uid
            }
        ).then(() => {
            this.setState({uploadState: 'done'})
        })
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
        console.log("uid " + auth.currentUser.uid);
        this.setState({uploadState: UPLOADING});
        const promises = [];
        let files = this.state.files;
        for (let i = 0; i < files.length; i++) {
            const imageStoragePath = "/images/" + this.state.name + "-" + uuidv4();
            if (i === this.state.mainImageIndex) {
                this.setState({mainImageStoragePath: imageStoragePath});
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
                    })
                    // the web storage url for our file
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
        e.target.checked ? this.setState({gender: Const.FEMALE}) : this.setState({gender: Const.MALE});
        this.setState({genderBool: e.target.checked});
    }

    handleCheckboxChange = e => {
        const key = e.target.name;
        const value = e.target.checked;
        const tmpBehaviorMap = this.state.behaviorMap;
        tmpBehaviorMap[key] = value;
        this.setState(prevState => ({
            behaviorMap: tmpBehaviorMap
        }));
    }

    changeAnimalType = (type) => {
        const tmpBehaviorMap = {};
        Const.BEHAVIOR_MAP.get(type).map((behavior) => {
            tmpBehaviorMap[behavior] = false;
            return null;
        });
        this.setState({
            behaviorMap: tmpBehaviorMap,
            animalType: type
        })
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

    setMainImage = (i, e) => {
        this.setState({
            mainImageIndex: i
        });
    }

    render() {
        console.log(this.state.gender);
        let galleryImages = this.state.urlList.map((url, i) => {
            let selected = "";
            if (i === this.state.mainImageIndex) {
                selected = " selected";
            }
            return (
                <GalleryImage src={url} selected={selected} onClick={(e) => {
                    this.setMainImage(i, e)
                }} key={i}/>
            );
        });

        let behaviorCheckboxes =
            Object.entries(this.state.behaviorMap).map(([key, value], i) => {
                return (
                    <div className={"addAnimal_form_input_behavior_" + i} key={i}>
                        <label>{key}</label>
                        <Checkbox type="checkbox"
                                  className="Input Input_checkbox"
                                  name={key}
                                  checked={value}
                                  onChange={this.handleCheckboxChange}
                        />
                    </div>
                );
            });

        return (
            <div className="addAnimal">
                <form className="addAnimal_form" onSubmit={this.addAnimal}>
                    <div className="addAnimal_form_buttons">
                        <div
                            className={"Button Button_light Button_small " + this.state.dogsActive}
                            id="buttonDogs"
                            onClick={() => this.changeAnimalType(Const.DOGS)}>Pes
                        </div>
                        <div className={"Button Button_light Button_small " + this.state.catsActive}
                             id="buttonCats"
                             onClick={() => this.changeAnimalType(Const.CATS)}>Kocka
                        </div>
                        <div className={"Button Button_light Button_small " + this.state.otherActive}
                             id="buttonOther"
                             onClick={() => this.changeAnimalType(Const.OTHER)}>Ostatni
                        </div>
                    </div>
                    <input className="Input Input_text addAnimal_form_name" type="text" name="name"
                           placeholder="Jmeno"
                           onChange={this.updateInput} value={this.state.name}/>
                    <input className="Input Input_text addAnimal_form_age" type="text" name="age" placeholder="Vek"
                           onChange={this.updateInput} value={this.state.age}/>
                    <div className="addAnimal_form_behavior">
                        {behaviorCheckboxes}
                    </div>
                    <div className="addAnimal_form_gender">
                        <h4>Pohlaví: </h4>
                        <div className="addAnimal_form_gender_input">
                            <div>Pes</div>
                            <Switch
                                checked={this.state.genderBool}
                                onChange={this.handleGenderChange}
                                name="genderBool"
                                inputProps={{'aria-label': 'secondary checkbox'}}
                            />
                            <div>Fena</div>
                        </div>
                    </div>
                    <div className="addAnimal_form_desc">
                        <textarea name="desc" placeholder="Popis" onChange={this.updateInput}
                                  className="addAnimal_form_desc_textArea"/>
                    </div>
                    <div className="addAnimal_form_map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1500.3485347041005!2d15.088005942110781!3d50.77046800835521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47093416ce5bd3a1%3A0x860b20000c4b372!2sTUL%20Halls%20of%20Residence!5e0!3m2!1scs!2scz!4v1593419624930!5m2!1scs!2scz"
                            frameBorder="0"
                            allowFullScreen=""
                            aria-hidden="false"
                            tabIndex="0"
                            title="koleje"
                            className="addAnimal_form_map_iframe"/>
                    </div>
                    <div className="addAnimal_form_mainImage">
                        {this.state.urlList[this.state.mainImageIndex] ?
                            <GalleryImage src={this.state.urlList[this.state.mainImageIndex]}/>
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
                            : "Potvrdit"}</div>
                </form>
            </div>
        )
    }

}

export default AddAnimal;
