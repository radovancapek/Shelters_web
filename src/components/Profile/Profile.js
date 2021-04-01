import React, {Component} from "react";
import "./Profile.scss";
import {db, auth, storage} from "../Firebase/Firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import {defaultLayers, searchService} from "../../Utils/HERE";
import {UPLOADING, WAIT_INTERVAL} from "../../Const";
import TextField from '@material-ui/core/TextField';
import * as Const from "../../Const";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            type: null,
            id: null,
            dataLoaded: false,
            map: null,
            marker: null,
            editMode: false,
            searchResults: [],
            address: "",
            uploadState: "",
            file: null,
            photoUrl: null,
            hasPhoto: true,
            imageStoragePath: null,
            percentUploaded: 0,
            showOpenHoursClass: "",
            openingHours: {
                mondayFrom: "00:00",
                mondayTo: "00:00",
                tuesdayFrom: "00:00",
                tuesdayTo: "00:00",
                wednesdayFrom: "00:00",
                wednesdayTo: "00:00",
                thursdayFrom: "00:00",
                thursdayTo: "00:00",
                fridayFrom: "00:00",
                fridayTo: "00:00",
                saturdayFrom: "00:00",
                saturdayTo: "00:00",
                sundayFrom: "00:00",
                sundayTo: "00:00"
            }
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        const id = this.props.id || auth.currentUser.uid;
        this.setState({id: id});
        const userRef = db.collection("users").doc(id);
        userRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data().openingHours) {
                    this.setState({
                        user: doc.data(),
                        address: doc.data().location.title,
                        openingHours: doc.data().openingHours,
                        imageStoragePath: doc.data().image || null,
                        dataLoaded: true
                    });
                } else {
                    this.setState({
                        user: doc.data(),
                        address: doc.data().location.title,
                        imageStoragePath: doc.data().image || null,
                        dataLoaded: true
                    });
                }
                console.log("image", doc.data().image);
                if (doc.data().image) this.loadPhoto(doc.data().image);
                else this.setState({hasPhoto: false});
                this.state.map ? this.moveMap() : this.loadMap();
            } else {
                this.setState({
                    dataLoaded: true
                })
            }
        }).catch((error) => {
            console.log("Firestore error", error);
        });
    }

    loadPhoto = (image) => {
        console.log("loadPhoto");
        const ref = storage.ref();
        const imageRef = ref.child(image);
        return imageRef.getDownloadURL()
            .then((url) => {
                this.setState({photoUrl: url});
            })
            .catch(function (error) {
                console.log("Error " + error.message);
            });
    }

    handlePhotoChange = (e) => {
        e.preventDefault();
        if (e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            this.setState({
                newFile: e.target.files[0],
                file: e.target.files[0],
                photoUrl: url
            })
        }
    }


    loadMap = () => {
        const lat = this.state.user.location.position.lat;
        const lng = this.state.user.location.position.lng;
        const marker = new window.H.map.Marker({lat, lng});
        const map = new window.H.Map(
            document.getElementById("mapContainer"),
            defaultLayers.vector.normal.map,
            {
                center: {lat: lat, lng: lng},
                zoom: 10,
                pixelRatio: window.devicePixelRatio || 1
            }
        );
        const mapEvents = new window.H.mapevents.MapEvents(map);
        new window.H.mapevents.Behavior(mapEvents);
        this.setState({
            marker: marker
        }, () => {
            map.addObject(this.state.marker);
        });

        this.setState({
            map: map
        });
    }

    moveMap = () => {
        console.log("moveMap");
        const lat = this.state.user.location.position.lat;
        const lng = this.state.user.location.position.lng;
        const marker = new window.H.map.Marker({lat: lat, lng: lng});
        this.state.map.removeObjects(this.state.map.getObjects());
        this.state.map.addObject(marker);
        this.state.map.setCenter({lat: lat, lng: lng});
    }

    handleTextInputChange = (e) => {
        const name = e.target.name;
        const val = e.target.value;
        this.setState(prevState => ({
            user: {
                ...prevState.user, [name]: val
            }
        }));
    }

    switchEditMode = (e) => {
        e.preventDefault();
        this.setState({editMode: true});
    }

    back = (e) => {
        e.preventDefault();
        this.setState({editMode: false, photoUrl: null});
        this.loadData();
    }

    handleUpload = (e) => {
        e.preventDefault();
        this.setState({uploadState: UPLOADING});
        const imageStoragePath = "/userImages/" + this.state.id;
        if (this.state.file) {
            const uploadTask = storage.ref(imageStoragePath).put(this.state.file);
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
                    this.setState({
                        imageStoragePath: imageStoragePath
                    }, () => {
                        this.save();
                    });
                }
            );
        } else {
            this.save();
        }

    }

    save = () => {
        this.setState({uploadState: Const.UPLOADING})
        if (this.state.user.type === Const.SHELTER) {
            db.collection("users").doc(this.state.id).update(
                {
                    name: this.state.user.name,
                    location: this.state.user.location,
                    phone: this.state.user.phone || "",
                    image: this.state.imageStoragePath,
                    openingHours: this.state.openingHours,
                    showOpenHours: this.state.user.showOpenHours
                }
            ).then(() => {
                this.setState({
                    logInRedirect: true,
                    uploadState: "",
                    editMode: false
                });
            }).catch((error) => {
                console.log(error.message);
                this.setState({errorMessage: "Chyba"})
            })
        } else {

        }
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
            this.setState({searchResults: result.items})
        }, (error) => {
            console.log("Error", error);
        });
    }

    handleSearchItemClick = (result) => {
        console.log("title", result.title);
        console.log("address", result.address);
        console.log(result);
        this.setState(prevState => ({
            address: result.title,
            user: {
                ...prevState.user, location: result
            },
            searchResults: []
        }), () => {
            this.moveMap();
        });

    }

    handleTimeChange = (e) => {
        const name = e.target.name;
        const val = e.target.value;
        this.setState(prevState => ({
            openingHours: {
                ...prevState.openingHours, [name]: val
            }
        }));
    }

    handle0penHoursCheckbox = (e) => {
        const checked = e.target.checked;
        this.setState(prevState => ({
            user: {
                ...prevState.user, showOpenHours: checked
            }
        }));
    }

    render() {
        const edit = this.state.editMode;
        if (this.state.dataLoaded && this.state.user) {
            const user = this.state.user;
            let showOpenHoursClass = "";
            if(user.showOpenHours) {
                showOpenHoursClass = " show";
            } else if(edit && !user.showOpenHours) {
                showOpenHoursClass = " hide";
            }
            let searchResults = this.state.searchResults.map((result, i) => {
                return (
                    <div className="result_item" key={i} onClick={() => {
                        this.handleSearchItemClick(result)
                    }}>{result.title}</div>
                );
            });

            const photo = () => {
                if (this.state.hasPhoto) {
                    if (this.state.photoUrl) {
                        return <img src={this.state.photoUrl} alt="userImage" className="photo image"/>;
                    } else {
                        return <CircularProgress/>;
                    }
                } else {
                    return <FontAwesomeIcon icon={faUserCircle} className="photo placeholder"/>;
                }
            }


            return (
                <div className="profile">
                    <div className="profile-photo">
                        <div className="buttons">
                            {(this.state.id === auth.currentUser.uid) && !edit &&
                            <button className="Button" onClick={this.switchEditMode}>Upravit info</button>}
                            {edit &&
                            <button className="Button" onClick={this.handleUpload}>
                                {(this.state.uploadState === Const.UPLOADING) ? (
                                    <CircularProgress progress={this.state.percentUploaded}/>
                                ) : (
                                    Const.SAVE
                                )}
                            </button>}
                            {edit && <button className="Button" onClick={this.back}>Zpět</button>}
                        </div>
                        {photo()}
                        {edit && (
                            <div className="addPhoto">
                                <input id="files" type="file" onChange={this.handlePhotoChange}
                                       className="addPhoto_input"/>
                                <label htmlFor="files" className="addPhoto_label">Nahrát obrázek</label>
                            </div>
                        )}
                    </div>
                    <div className="info">
                        <div className="item name">
                            {edit ? <input className="Input Input_text" name="name" value={user.name}
                                           onChange={this.handleTextInputChange}/> : <h2>{user.name}</h2>}
                        </div>
                        <div className="item address">
                            <div className="label">Adresa:</div>
                            {edit ? (
                                <div className="autocomplete">
                                    <input className="Input Input_text" type="text" value={this.state.address}
                                           placeholder="Adresa"
                                           onChange={this.handleSearchChange}/>
                                    {
                                        this.state.searchResults.length > 0 ?
                                            <div className="searchResults">{searchResults}</div> :
                                            null
                                    }
                                </div>
                            ) : (
                                <div className="value">
                                    <div className="streetAndHouse">
                                        {this.state.user.location.address.street &&
                                        <div className="street">{this.state.user.location.address.street}</div>}
                                        {this.state.user.location.address.houseNumber && <div
                                            className="houseNumber">{this.state.user.location.address.houseNumber}</div>}
                                    </div>
                                    <div
                                        className="city">{this.state.user.location.address.postalCode + " " + this.state.user.location.address.city}</div>
                                </div>
                            )}


                        </div>
                        <div className="item phone">
                            <div className="label">Telefon:</div>
                            {edit ? <input className="Input Input_text" name="phone" value={user.phone || ""}
                                           onChange={this.handleTextInputChange}/> :
                                <div className="value">{user.phone}</div>}
                        </div>
                        <div className="item email">
                            <div className="label">E-mail:</div>
                            <div className="value">{user.email}</div>
                        </div>
                        {edit && (
                            <FormControlLabel
                                control={<Checkbox checked={this.state.user.showOpenHours} onChange={this.handle0penHoursCheckbox}
                                                   name="showOpenHours"
                                                   className="open-hours-checkbox"/>}
                                label="Zobrazit otevírací dobu"
                            />
                        )}
                        <div className={"item open-hours" + showOpenHoursClass}>
                            {!edit && <div className="label">Oteviraci doba:</div>}
                            {user.openingHours && (
                                <div className="days">
                                    <div className="day">
                                        <div className="day-name">Pondělí</div>
                                        {edit ? (
                                            <div className="value">
                                                <TextField
                                                    name="mondayFrom"
                                                    type="time"
                                                    value={this.state.openingHours.mondayFrom}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <TextField
                                                    name="mondayTo"
                                                    type="time"
                                                    value={this.state.openingHours.mondayTo}
                                                    onChange={this.handleTimeChange}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="value">{this.state.openingHours.mondayFrom + " - " + this.state.openingHours.mondayTo}</div>
                                        )}
                                    </div>
                                    <div className="day">
                                        <div className="day-name">Úterý</div>
                                        {edit ? (
                                            <div className="value">
                                                <TextField
                                                    name="tuesdayFrom"
                                                    type="time"
                                                    value={this.state.openingHours.tuesdayFrom}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <TextField
                                                    name="tuesdayTo"
                                                    type="time"
                                                    value={this.state.openingHours.tuesdayTo}
                                                    onChange={this.handleTimeChange}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="value">{this.state.openingHours.tuesdayFrom + " - " + this.state.openingHours.tuesdayTo}</div>
                                        )}
                                    </div>
                                    <div className="day">
                                        <div className="day-name">Středa</div>
                                        {edit ? (
                                            <div className="value">
                                                <TextField
                                                    name="wednesdayFrom"
                                                    type="time"
                                                    value={this.state.openingHours.wednesdayFrom}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <TextField
                                                    name="wednesdayTo"
                                                    type="time"
                                                    value={this.state.openingHours.wednesdayTo}
                                                    onChange={this.handleTimeChange}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="value">{this.state.openingHours.wednesdayFrom + " - " + this.state.openingHours.wednesdayTo}</div>
                                        )}
                                    </div>
                                    <div className="day">
                                        <div className="day-name">Čtvrtek</div>
                                        {edit ? (
                                            <div className="value">
                                                <TextField
                                                    name="thursdayFrom"
                                                    type="time"
                                                    value={this.state.openingHours.thursdayFrom}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <TextField
                                                    name="thursdayTo"
                                                    type="time"
                                                    value={this.state.openingHours.thursdayTo}
                                                    onChange={this.handleTimeChange}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="value">{this.state.openingHours.thursdayFrom + " - " + this.state.openingHours.thursdayTo}</div>
                                        )}
                                    </div>
                                    <div className="day">
                                        <div className="day-name">Pátek</div>
                                        {edit ? (
                                            <div className="value">
                                                <TextField
                                                    name="fridayFrom"
                                                    type="time"
                                                    value={this.state.openingHours.fridayFrom}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <TextField
                                                    name="fridayTo"
                                                    type="time"
                                                    value={this.state.openingHours.fridayTo}
                                                    onChange={this.handleTimeChange}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="value">{this.state.openingHours.fridayFrom + " - " + this.state.openingHours.fridayTo}</div>
                                        )}
                                    </div>
                                    <div className="day">
                                        <div className="day-name">Sobota</div>
                                        {edit ? (
                                            <div className="value">
                                                <TextField
                                                    name="saturdayFrom"
                                                    type="time"
                                                    value={this.state.openingHours.saturdayFrom}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <TextField
                                                    name="saturdayTo"
                                                    type="time"
                                                    value={this.state.openingHours.saturdayTo}
                                                    onChange={this.handleTimeChange}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="value">{this.state.openingHours.saturdayFrom + " - " + this.state.openingHours.saturdayTo}</div>
                                        )}
                                    </div>
                                    <div className="day">
                                        <div className="day-name">Neděle</div>
                                        {edit ? (
                                            <div className="value">
                                                <TextField
                                                    name="sundayFrom"
                                                    type="time"
                                                    value={this.state.openingHours.sundayFrom}
                                                    onChange={this.handleTimeChange}
                                                />
                                                <TextField
                                                    name="sundayTo"
                                                    type="time"
                                                    value={this.state.openingHours.sundayTo}
                                                    onChange={this.handleTimeChange}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="value">{this.state.openingHours.sundayFrom + " - " + this.state.openingHours.sundayTo}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="review">
                        <h3>Recenze</h3>
                        <div className="reviews"></div>
                    </div>
                    <div className="map" id="mapContainer"/>
                </div>
            )
        } else if (this.state.dataLoaded) {
            return (
                <div className="overlay">
                    <div className="absolute_center">Uzivatel nebyl nalezen.</div>
                </div>
            )
        } else {
            return (
                <div className="overlay">
                    <div className="absolute_center"><CircularProgress/></div>
                </div>
            )
        }

    }

}

export default Profile;
