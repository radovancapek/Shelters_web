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
import {CATS, DOGS, FEMALE, MALE, OTHER, SIZE_BIG, SIZE_MEDIUM, SIZE_SMALL} from "../Const"
import {breeds} from "../assets/files/breeds.json";
import {withTranslation} from "react-i18next";

class Filter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animalType: Const.DOGS,
            small: false,
            medium: false,
            big: false,
            dogs: false,
            cats: false,
            other: false,
            size: Const.SIZE_UNKNOWN,
            age: [0, 20],
            weight: [0, 80],
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
        const name = e.target.name;
        const checked = e.target.checked;
        this.setState({animalType: e.target.value})

        this.setState({
            [name]: checked
        }, () => {
            if (this.state.dogs) this.setBehaviorMap(DOGS);
            else if (this.state.cats) this.setBehaviorMap(CATS);
            else if (this.state.other) this.setBehaviorMap(OTHER);
            else this.setBehaviorMap(DOGS);
        });
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

    handleWeightChange = (event, newValue) => {
        this.setState({weight: newValue});
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
        result.type = [];
        result.gender = [];
        if (this.state.small) result.size.push(SIZE_SMALL);
        if (this.state.medium) result.size.push(SIZE_MEDIUM);
        if (this.state.big) result.size.push(SIZE_BIG);
        if (this.state.dogs) result.size.push(DOGS);
        if (this.state.cats) result.size.push(CATS);
        if (this.state.other) result.size.push(OTHER);
        if (this.state.male) result.gender.push(MALE);
        if (this.state.female) result.gender.push(FEMALE);
        result.age = this.state.age;
        result.animalWeight = this.state.weight;
        result.behaviorMap = this.state.behaviorMap;
        result.breed = this.state.breed;
        this.props.filter(result);
        this.props.onClose();
    }


    render() {
        const {t} = this.props;
        const {small, medium, big, dogs, cats, other} = this.state;

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
                    <FormControl component="fieldset" className="filter_obsah_type">
                        <h3>{t('wantedType') + ":"}</h3>
                        <FormGroup className="size_group">
                            <FormControlLabel
                                control={<Checkbox checked={dogs} onChange={this.handleAnimalTypeChange} name="dogs"
                                                   className="filter_obsah_checkbox"/>}
                                label={t('animals.dogs.dogs')}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={cats} onChange={this.handleAnimalTypeChange} name="cats"/>}
                                label={t('animals.cats.cats')}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={other} onChange={this.handleAnimalTypeChange}
                                                   name="other"/>}
                                label={t('animals.other.other')}
                            />
                        </FormGroup>
                    </FormControl>

                    <div className="autocomplete filter_obsah_breed" onBlur={this.handleBreedInputClick}>
                        <h3 className="Input_label">{t('animals.breed') + ":"}</h3>
                        <div className="Input_wrapper_breed">
                            <input className="Input Input_text addAnimal_form_breed" autoComplete="off" type="text"
                                   name="breed"
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
                    <div className="filter_obsah_weight">
                        <h3>{t('animals.weight') + " (kg):"}</h3>
                        <Slider
                            defaultValue={[0, 80]}
                            onChange={this.handleWeightChange}
                            aria-labelledby="track-inverted-range-slider"
                            valueLabelDisplay="on"
                            min={0}
                            max={80}
                        />
                    </div>
                    <FormControl component="fieldset" className="filter_obsah_gender">
                        <h3>{t('animals.gender') + ":"}</h3>
                        <FormGroup className="gender_group">
                            <FormControlLabel
                                control={<Checkbox checked={this.state.male} onChange={this.handleGenderChange}
                                                   name={MALE} className="filter_obsah_checkbox"/>}
                                label={t("animals.other.male")}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={this.state.female} onChange={this.handleGenderChange}
                                                   name={FEMALE}/>}
                                label={t("animals.other.female")}
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

export default withTranslation()(onClickOutside(Filter)
)
