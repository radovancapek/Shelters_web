import React, {Component} from "react";
import "./Filter.scss";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars} from "@fortawesome/free-solid-svg-icons";
import onClickOutside from "react-onclickoutside";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import * as Const from "../Const"
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Switch from "@material-ui/core/Switch";
import {FEMALE, MALE, SIZE_BIG, SIZE_MEDIUM, SIZE_SMALL} from "../Const";

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animalType: Const.DOGS,
            small: false,
            medium: false,
            big: false,
            size: Const.SIZE_UNKNOWN,
            age: [0, 20],
            behaviorMap: {},
            gender: Const.MALE,
            genderFemale: false,
            male: false,
            female: false
        }
    }

    componentDidMount() {
        if ("geolocation" in navigator) {
            console.log("Available");
            navigator.permissions
                .query({ name: "geolocation" })
                .then(function (result) {
                    if (result.state === "granted") {
                        console.log(result.state);
                        //If granted then you can directly call your function here
                    } else if (result.state === "prompt") {
                        console.log(result.state);
                    } else if (result.state === "denied") {
                        console.log(result.state);
                        //If denied then you have to show instructions to enable location
                    }
                    result.onchange = function () {
                        console.log(result.state);
                    };
                });
        } else {
            console.log("Not Available");
        }
        this.setBehaviorMap(this.state.animalType);
    }

    handleClickOutside = evt => {
        this.props.onClose();
    };

    handleSizeChange = (event) => {
        console.log("size " + event.target.checked);
        this.setState({
            [event.target.name]: event.target.checked
        });
    };

    setBehaviorMap = (type) => {
        const tmpBehaviorMap = {};
        Const.BEHAVIOR_MAP.get(type).map((behavior) => {
            tmpBehaviorMap[behavior] = false;
            return null;
        });
        this.setState({
            behaviorMap: tmpBehaviorMap
        });
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

    handleAnimalTypeChange = e => {
        this.setState({animalType: e.target.value})
        this.setBehaviorMap(e.target.value);
    }

    handleGenderChange = (event) => {
        this.setState({
            [event.target.name]: event.target.checked
        });
    }

    handleAgeChange = (event, newValue) => {
        console.log(newValue);
        this.setState({age: newValue});
    }

    filter = () => {
        let result = {};
        result.size = [];
        result.gender = [];
        if (this.state.small) result.size.push(SIZE_SMALL);
        if (this.state.medium) result.size.push(SIZE_MEDIUM);
        if (this.state.big) result.size.push(SIZE_BIG);
        if (this.state.male) result.gender.push(MALE);
        if (this.state.female) result.gender.push(FEMALE);
        result.animalType = this.state.animalType;
        result.age = this.state.age;
        result.behaviorMap = this.state.behaviorMap;
        this.props.filter(result);
        this.props.onClose();
    }

    render() {
        const {small, medium, big} = this.state;

        let behaviorCheckboxes =
            Object.entries(this.state.behaviorMap).map(([key, value], i) => {
                return (
                    <div className="filter_obsah_behavior_item" key={i}>
                        <FormControlLabel
                            control={<Checkbox type="checkbox"
                                               name={key}
                                               checked={value}
                                               onChange={this.handleCheckboxChange}
                                               className="filter_obsah_checkbox"/>}
                            label={key}
                        />
                    </div>
                );
            });

        return (
            <div className={this.props.menuOpen ? 'filter open' : 'filter'} onClick={this.props.onClick}>
                <div className="filter_label" onClick={this.props.openFilter}>Filtrovat</div>
                <FontAwesomeIcon icon={faBars} className="filter_icon"/>
                <div className="filter_obsah">
                    <FormControl component="fieldset" className="filter_obsah_animal">
                        <h3>Mám zájem o:</h3>
                        <RadioGroup aria-label="animalType" name="animalTypeRadioGroup" value={this.state.animalType}
                                    onChange={this.handleAnimalTypeChange}>
                            <FormControlLabel value="dogs" control={<Radio/>} label="Psi"/>
                            <FormControlLabel value="cats" control={<Radio/>} label="Kočky"/>
                            <FormControlLabel value="other" control={<Radio/>} label="Ostatní"/>
                        </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset" className="filter_obsah_size">
                        <h3>Velikost zvířete:</h3>
                        <FormGroup className="size_group">
                            <FormControlLabel
                                control={<Checkbox checked={small} onChange={this.handleSizeChange} name="small"
                                                   className="filter_obsah_checkbox"/>}
                                label="Malý"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={medium} onChange={this.handleSizeChange} name="medium"/>}
                                label="Střední"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={big} onChange={this.handleSizeChange} name="big"/>}
                                label="Velký"
                            />
                        </FormGroup>
                    </FormControl>
                    <div className="filter_obsah_age">
                        <h3>Věk zvířete:</h3>
                        <Slider
                            defaultValue={[0, 20]}
                            onChange={this.handleAgeChange}
                            aria-labelledby="track-inverted-range-slider"
                            valueLabelDisplay="on"
                            min={0}
                            max={20}
                        />
                    </div>
                    <FormControl component="fieldset" className="filter_obsah_gender">
                        <h3>Pohlaví:</h3>
                        <FormGroup className="gender_group">
                            <FormControlLabel
                                control={<Checkbox checked={this.state.male} onChange={this.handleGenderChange}
                                                   name={MALE} className="filter_obsah_checkbox"/>}
                                label="Pes"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.female} onChange={this.handleGenderChange}
                                                   name={FEMALE}/>}
                                label="Fena"
                            />
                        </FormGroup>
                    </FormControl>
                    <div className="filter_obsah_behavior">{behaviorCheckboxes}</div>
                    <button className="Button filter_button" onClick={this.filter}>Filtrovat</button>
                </div>
            </div>
        )
    }
}

export default onClickOutside(Filter);