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
import {FEMALE, MALE, SIZE_BIG, SIZE_MEDIUM, SIZE_SMALL} from "../Const";
import { breeds } from "../assets/files/breeds.json";
import {withTranslation} from "react-i18next";

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
            female: false,
            selectedBreeds: [],
            filteredBreeds: breeds,
            showBreeds: false,
            breed: ""
        }
    }

    componentDidMount() {
        this.setBehaviorMap(this.state.animalType);
    }

    handleClickOutside = evt => {
        console.log("click outside");
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

    handleBreedChange = (e) => {
        this.setState({
            selectedBreeds: e.target.value
        });
    }

    updateBreed = (e) => {
        let query = e.target.value;

        this.setState(prevState => ({
            filteredBreeds: breeds.filter(breed => breed.toLowerCase().includes(query.toLowerCase())),
            breed: query,
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
        this.setState({
            breed: breed,
            showBreeds: false
        });
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
        result.breed = this.state.breed;
        this.props.filter(result);
        this.props.onClose();
    }


    render() {
        const {t} = this.props;
        const {small, medium, big} = this.state;

        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;

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
                            label={t('animals.behavior.' + key)}
                        />
                    </div>
                );
            });

        let breedOptions = this.state.filteredBreeds.map((breed, i) => {
            return (
                <div className="result_item" key={i} onMouseDown={(e) => {
                    e.preventDefault();
                    this.handleBreedClick(breed);
                }}>{breed}</div>
            );
        });

        return (
            <div className={this.props.menuOpen ? 'filter open' : 'filter'} onClick={this.props.onClick}>
                <div className="filter_label" onClick={this.props.openFilter}>{t('filter')}</div>
                <FontAwesomeIcon icon={faBars} className="filter_icon"/>
                <div className="filter_obsah">
                    <FormControl component="fieldset" className="filter_obsah_animal">
                        <h3>{t('wantedType') + ":"}</h3>
                        <RadioGroup aria-label="animalType" name="animalTypeRadioGroup" value={this.state.animalType}
                                    onChange={this.handleAnimalTypeChange}>
                            <FormControlLabel value="dogs" control={<Radio/>} label={t('animals.dogs.dogs')}/>
                            <FormControlLabel value="cats" control={<Radio/>} label={t('animals.cats.cats')}/>
                            <FormControlLabel value="other" control={<Radio/>} label={t('animals.other.other')}/>
                        </RadioGroup>
                    </FormControl>


                    <div className="autocomplete filter_obsah_breed" onBlur={this.handleBreedInputClick}>
                        <h3 className="Input_label">{t('animals.breed') + ":"}</h3>
                        <div className="Input_wrapper_breed">
                            <input className="Input Input_text addAnimal_form_breed" autoComplete="off" type="text" name="breed"
                                   onChange={this.updateBreed} onFocus={this.updateBreed} value={this.state.breed}/>
                            {
                                this.state.showBreeds ?
                                    <div className="searchResults">{breedOptions}</div> : null
                            }
                        </div>
                    </div>

                    <FormControl component="fieldset" className="filter_obsah_size">
                        <h3>{t('animals.size') + ":"}</h3>
                        <FormGroup className="size_group">
                            <FormControlLabel
                                control={<Checkbox checked={small} onChange={this.handleSizeChange} name="small"
                                                   className="filter_obsah_checkbox"/>}
                                label={t('animals.size_small')}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={medium} onChange={this.handleSizeChange} name="medium"/>}
                                label={t('animals.size_medium')}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={big} onChange={this.handleSizeChange} name="big"/>}
                                label={t('animals.size_big')}
                            />
                        </FormGroup>
                    </FormControl>
                    <div className="filter_obsah_age">
                        <h3>{t('animals.age') + ":"}</h3>
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
                        <h3>{t('animals.gender') + ":"}</h3>
                        <FormGroup className="gender_group">
                            <FormControlLabel
                                control={<Checkbox checked={this.state.male} onChange={this.handleGenderChange}
                                                   name={MALE} className="filter_obsah_checkbox"/>}
                                label={t("animals." + this.state.animalType + ".male")}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.female} onChange={this.handleGenderChange}
                                                   name={FEMALE}/>}
                                label={t("animals." + this.state.animalType + ".female")}
                            />
                        </FormGroup>
                    </FormControl>
                    <div className="filter_obsah_behavior">{behaviorCheckboxes}</div>
                    <button className="Button filter_button" onClick={this.filter}>{t('filter')}</button>
                </div>
            </div>
        )
    }
}

export default
    withTranslation()(onClickOutside(Filter)
)
