import React, { Component } from "react";
import "./AddAnimal.scss";
import { db, storage } from "../../Firebase/Firebase"
import * as Const from "../../../Const"
import Checkbox from '@material-ui/core/Checkbox';
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GalleryImage from "../AnimalCard/GalleryImage";
import CircularProgress from '@material-ui/core/CircularProgress';


class AddAnimal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animalType: Const.DOGS,
            name: "",
            age: "",
            image: "",
            filenames: [],
            downloadURLs: [],
            isUploading: false,
            uploadProgress: 0,
            file: null,
            newFile: null,
            url: "",
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


    addAnimal = e => {
        e.preventDefault();
        db.collection(this.state.animalType).add(
            {
                name: this.state.name,
                age: parseInt(this.state.age, 10),
                desc: this.state.desc,
                behaviorMap: this.state.behaviorMap
            }
        )
        this.setState({
            name: ""
        });
    };

    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            newFile: e.target.files[0],
            files: [...this.state.files, e.target.files[0]],
            urlList: [...this.state.urlList, URL.createObjectURL(e.target.files[0])],
            url: URL.createObjectURL(e.target.files[0]),
            showImagePlaceholder: false
        })
    }

    handleUpload = (e) => {
        e.preventDefault();
        this.setState({ uploadState: "uploading" });
        const promises = [];
        let files = this.state.files;

        for (let i = 0; i < files.length; i++) {
            console.log("aaa " + files[i].name);
            const uploadTask = storage.ref(`/images/${files[i].name}`).put(files[i]);
            uploadTask.on("state_changed",
                snapshot => {
                    const percentUploaded = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    this.setState({ percentUploaded });
                },
                error => {
                    console.log(error.code);
                    this.setState({ uploadState: 'error' });
                },

                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    console.log(downloadURL);
                    this.setState({
                        uploadState: 'done',
                        downloadURLs: [...this.state.downloadURLs, downloadURL]
                    })
                    // the web storage url for our file
                });
        }
        Promise.all(promises)
            .then(() => alert('All files uploaded'))
            .catch(err => console.log(err.code));
    }

    handleCheckboxChange = e => {
        const key = e.target.name;
        const value = e.target.checked;
        const tmpBehaviorMap = this.state.behaviorMap;
        tmpBehaviorMap[key] = value;
        console.log(e.target.name + " " + e.target.checked);
        this.setState(prevState => ({
            behaviorMap: tmpBehaviorMap
        }));
    }

    changeAnimalType = (type) => {
        const tmpBehaviorMap = {};
        Const.BEHAVIOR_MAP.get(type).map((behavior) => {
            tmpBehaviorMap[behavior] = false;
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

    render() {
        let galleryImages = this.state.urlList.map((url, i) => {
            return (
                <GalleryImage src={url} key={i} />
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
                        onChange={this.updateInput} value={this.state.name} />
                    <input className="Input Input_text addAnimal_form_age" type="text" name="age" placeholder="Vek"
                        onChange={this.updateInput} value={this.state.age} />
                    <div className="addAnimal_form_behavior">
                        {behaviorCheckboxes}
                    </div>
                    <div className="addAnimal_form_desc">
                        <textarea name="desc" placeholder="Popis" onChange={this.updateInput}
                            className="addAnimal_form_desc_textArea" />
                    </div>
                    <div className="addAnimal_form_map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1500.3485347041005!2d15.088005942110781!3d50.77046800835521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47093416ce5bd3a1%3A0x860b20000c4b372!2sTUL%20Halls%20of%20Residence!5e0!3m2!1scs!2scz!4v1593419624930!5m2!1scs!2scz"
                            frameBorder="0"
                            allowFullScreen=""
                            aria-hidden="false"
                            tabIndex="0"
                            title="koleje"
                            className="addAnimal_form_map_iframe" />
                    </div>
                    <div className="addAnimal_form_mainImage">
                        {this.state.showImagePlaceholder ?
                            <FontAwesomeIcon className="imageIcon" icon={faImage} />
                            :
                            null
                        }
                    </div>
                    <div className="gallery">
                        {galleryImages}
                        <div className="addImage galleryImage">
                            <input id="files" type="file" onChange={this.handleChange} className="addImage_input" />
                            <label for="files" className="addImage_label">+</label>
                        </div>
                    </div>

                    <div className="Button light submit" onClick={this.addAnimal}>
                        {this.state.uploadState === "uploading" ?
                            <CircularProgress progress={this.state.percentUploaded} />
                            : "Potvrdit"}</div>
                </form>
            </div>
        )
    }

}

export default AddAnimal;
