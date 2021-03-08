import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons";
import onClickOutside from "react-onclickoutside";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import * as Const from "../../Const"
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animalType: Const.CATS,
            small: false,
            medium: false,
            large: false,
            behaviorMap: {}
        }
    }

    componentDidMount() {
        this.setBehaviorMap(this.state.animalType);
    }

    handleClickOutside = evt => {
        this.props.onClickOutside();
    };

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.checked
        });
    };

    valuetext(value) {
        return `${value}°C`;
    }

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

    filter = () => {
        this.props.filter();
    }

    render() {
        const { small, medium, large } = this.state;

        let behaviorCheckboxes =
            Object.entries(this.state.behaviorMap).map(([key, value], i) => {
                return (
                    <div key={i}>
                        <FormControlLabel
                            control={<Checkbox type="checkbox"
                                name={key}
                                checked={value}
                                onChange={this.handleCheckboxChange}
                                className="swipe_menu_obsah_checkbox" />}
                            label={key}
                        />
                    </div>
                );
            });

        return (
            <div className={this.props.menuOpen ? 'swipe_menu open' : 'swipe_menu'} onClick={this.props.onClick}>
                <FontAwesomeIcon icon={faBars} className="swipe_menu_icon" />
                <div className="swipe_menu_obsah">
                    <FormControl component="fieldset" className="swipe_menu_obsah_animal">
                        <h3>Mám zájem o:</h3>
                        <RadioGroup aria-label="animalType" name="animalTypeRadioGroup" value={this.state.animalType} onChange={this.handleAnimalTypeChange}>
                            <FormControlLabel value="dogs" control={<Radio />} label="Psi" />
                            <FormControlLabel value="cats" control={<Radio />} label="Kočky" />
                            <FormControlLabel value="other" control={<Radio />} label="Ostatní" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl component="fieldset">
                        <h3>Velikost zvířete:</h3>
                        <FormGroup className="swipe_menu_obsah_size">
                            <FormControlLabel
                                control={<Checkbox checked={small} onChange={this.handleChange} name="small" className="swipe_menu_obsah_checkbox" />}
                                label="Malý"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={medium} onChange={this.handleChange} name="medium" />}
                                label="Střední"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={large} onChange={this.handleChange} name="large" />}
                                label="Velký"
                            />
                        </FormGroup>
                    </FormControl>
                    <h3>Věk zvířete:</h3>
                    <Slider
                        defaultValue={[0, 20]}
                        getAriaValueText={this.valuetext}
                        aria-labelledby="track-inverted-range-slider"
                        valueLabelDisplay="on"
                        min={0}
                        max={20}
                    />
                    <div className="swipe_menu_obsah_behavior">{behaviorCheckboxes}</div>
                    <button className="Button swipe_menu_button" onClick={this.filter}>Filtrovat</button>
                </div>
            </div>
        )
    }
}

export default onClickOutside(Menu);
