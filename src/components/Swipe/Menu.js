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

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dog: true,
            cat: false,
            others: false,
            small: false,
            medium: false,
            large: false,
            behaviorMap: {}
        }
    }

    componentDidMount() {
        const tmpBehaviorMap = {};
        Const.BEHAVIOR_MAP.get(this.props.animalType).map((behavior) => {
            tmpBehaviorMap[behavior] = false;
        });
        this.setState({
            behaviorMap: tmpBehaviorMap
        });
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

    filter = () => {
        this.props.filter();
    }

    render() {
        const { dog, cat, others, small, medium, large } = this.state;

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
                    <FormControl component="fieldset">
                        <h2>Mám zájem o:</h2>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox checked={dog} onChange={this.handleChange} name="dog" className="swipe_menu_obsah_checkbox" />}
                                label="Pes"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={cat} onChange={this.handleChange} name="cat" />}
                                label="Kočka"
                            />
                            <FormControlLabel
                                control={<Checkbox checked={others} onChange={this.handleChange} name="others" />}
                                label="Ostatní"
                            />
                        </FormGroup>
                    </FormControl>
                    <FormControl component="fieldset">
                        <h2>Velikost zvířete:</h2>
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
                    <h2>Věk zvířete:</h2>
                    <Slider
                        defaultValue={[0, 20]}
                        getAriaValueText={this.valuetext}
                        aria-labelledby="track-inverted-range-slider"
                        valueLabelDisplay="on"
                        min={0}
                        max={20}
                    />
                    <div>{behaviorCheckboxes}</div>
                    <button className="swipe_menu_button" onClick={this.filter}>Filtrovat</button>
                </div>
            </div>
        )
    }
}

export default onClickOutside(Menu);
