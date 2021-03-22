import React, {Component} from "react";
import "./Animals.scss";
import AnimalCard from "./AnimalCard/AnimalCard";
import {db} from "../Firebase/Firebase"
import AnimalDetail from "./AnimalDetail/AnimalDetail";
import ScrollUpButton from "react-scroll-up-button";
import Filter from "../../Utils/Filter";
import {geolocated} from "react-geolocated";

class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            animalsFull: [],
            animalDocumentsFull: [],
            mounted: false,
            selectedAnimal: null,
            filterOpened: false,
            userLocation: null
        }
    }

    getPosition = () => {
        console.log("4");
        navigator.geolocation.getCurrentPosition((result) => {
            console.log("5");
            console.log("result", result);
            this.setState({userLocation: result});
        }, (error) => {
            console.log("6");
            console.log("User location error", error);
        }, {timeout: 5000});
    }

    componentDidMount() {
        // if(!this.props.isGeolocationAvailable) {
        //     console.log("Location unavailable.");
        // } else if(!this.props.isGeolocationEnabled) {
        //     console.log("Location not enabled.");
        // } else {
        //     console.log("coords", this.props.coords);
        // }


        if (navigator.permissions && navigator.permissions.query) {
            console.log("1");
            navigator.permissions
                .query({name: "geolocation"})
                .then((result) => {
                    console.log("2");
                    if (result.state === "granted") {
                        this.getPosition();
                    } else if (result.state === "prompt") {
                        window.confirm("Povolením sdílení polohy umožníte aplikaci určit vzdálenost od zobrazených zvířat.");
                        this.getPosition();
                    } else if (result.state === "denied") {
                        console.log(result.state);
                        //If denied then you have to show instructions to enable location
                    }
                    result.onchange = function () {
                        console.log(result.state);
                    };
                }).catch(reason => {
                console.log("reason", reason);
            });
        } else if (navigator.geolocation) {
            console.log("3");
            this.getPosition();
        } else {
            console.log("Location unavailable.")
        }
        this.loadData();
        this.setState({mounted: true});
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        window.onpopstate = e => {
            e.preventDefault();
            this.closeDetail();
        }
    }

    componentWillUnmount() {
        this.setState({mounted: false});
    }

    loadData() {
        let animals = [];
        let animalDocuments = [];
        db.collection("animals").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    animals.push(doc.data());
                    animalDocuments.push(doc);
                });
                this.setState({
                    animalsLoaded: true,
                    animals: animals,
                    animalsFull: animals,
                    animalDocumentsFull: animalDocuments
                });
            });
    }

    openFilter = () => {
        this.setState({filterOpened: true});
    }

    closeFilter = () => {
        this.setState({filterOpened: false});
    }

    openDetail = (animal) => {
        this.setState({selectedAnimal: animal});
    }

    closeDetail = () => {
        this.setState({selectedAnimal: null});
    }

    filter = (filterData) => {
        this.closeFilter();
        const filterBehavior = filterData.behaviorMap;
        console.log(filterData);
        const filteredAnimals = this.state.animalsFull.filter(animal => {
            for (let key in filterBehavior) {
                if (filterBehavior[key]) {
                    if (!animal.behaviorMap[key]) {
                        return false;
                    }
                }
            }
            return (
                (animal.type === filterData.animalType) &&
                (filterData.size.includes(animal.size) || (filterData.size.length === 0)) &&
                ((animal.age >= filterData.age[0]) && (animal.age <= filterData.age[1])) &&
                (filterData.gender.includes(animal.gender) || (filterData.gender.length === 0))
            );
        })
        this.setState({animals: filteredAnimals});
    }

    filterBehavior = () => {

    }

    render() {
        console.log("location ", this.state.userLocation);
        const mounted = this.state.mounted;
        let animalCards;
        if (mounted) {
            animalCards = this.state.animals.map((animal, i) => {
                return (
                    <AnimalCard animal={animal} key={i} className="card" location={this.state.userLocation}
                                onClick={() => this.openDetail(animal)}/>
                );
            });
        }
        return (
            <div className="animals">
                <div className="actions"><Filter menuOpen={this.state.filterOpened} openFilter={this.openFilter}
                                                 onClose={this.closeFilter}
                                                 filter={this.filter}/>
                    <div className="order">
                        <div className="order_label">Seřadit</div>
                        <div className="order_content"></div>
                    </div>
                </div>

                {mounted ? (
                    <div className="wrapper">
                        {
                            this.state.selectedAnimal ?
                                <AnimalDetail animal={this.state.selectedAnimal} close={this.closeDetail}/> :
                                animalCards
                        }
                    </div>
                ) : (
                    <div>loading</div>
                )}
                <ScrollUpButton/>
            </div>

        )
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
    isGeolocationEnabled: false
})(Animals);
