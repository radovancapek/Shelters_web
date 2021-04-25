import React, {Component} from "react";
import "./Animals.scss";
import AnimalCard from "./AnimalCard/AnimalCard";
import {db} from "../Firebase/Firebase"
import AnimalDetail from "./AnimalDetail/AnimalDetail";
import ScrollUpButton from "react-scroll-up-button";
import Filter from "../../Utils/Filter";
import {withTranslation} from "react-i18next";

class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            animalsFull: [],
            animalDocuments: [],
            animalDocumentsFull: [],
            mounted: false,
            selectedAnimalDocument: null,
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
        if(this.unsubscribe) this.unsubscribe();
    }

    loadData() {
        let animals = [];
        let animalDocuments = [];
        this.subscribe = db.collection("animals").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    animals.push(doc.data());
                    animalDocuments.push(doc);
                });
                this.setState({
                    animalsLoaded: true,
                    animals: animals,
                    animalsFull: animals,
                    animalDocuments: animalDocuments,
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
        this.setState({selectedAnimalDocument: animal});
    }

    closeDetail = () => {
        this.setState({selectedAnimalDocument: null});
    }

    filter = (filterData) => {
        this.closeFilter();
        const filterBehavior = filterData.behaviorMap;
        console.log(filterData);

        const filteredAnimalDocuments = this.state.animalDocumentsFull.filter(animalDocument => {
            const animal = animalDocument.data();
            for (let key in filterBehavior) {
                if (filterBehavior[key]) {
                    if (!animal.behaviorMap[key]) {
                        return false;
                    }
                }
            }
            let breedFilter = true;
            if (animal.breed) {
                breedFilter = (animal.breed.includes(filterData.breed)) || (filterData.breed.length === 0);
            } else breedFilter = filterData.breed.length === 0;
            return (
                (animal.type === filterData.animalType) &&
                (filterData.size.includes(animal.size) || (filterData.size.length === 0)) &&
                ((animal.age >= filterData.age[0]) && (animal.age <= filterData.age[1])) &&
                (filterData.gender.includes(animal.gender) || (filterData.gender.length === 0) &&
                    breedFilter)
            );
        })
        this.setState({animalDocuments: filteredAnimalDocuments});
    }

    render() {
        const {t} = this.props;
        const mounted = this.state.mounted;
        let animalCards;
        if (mounted) {
            animalCards = this.state.animalDocuments.map((animalDocument, i) => {
                return (
                    <AnimalCard animal={animalDocument.data()} animalId={animalDocument.id} key={i} className="card"
                                location={this.state.userLocation}
                                onClick={() => this.openDetail(animalDocument)}/>
                );
            });
        }
        return (
            <div className="animals">
                <div className="actions"><Filter menuOpen={this.state.filterOpened} openFilter={this.openFilter}
                                                 onClose={this.closeFilter}
                                                 filter={this.filter}/>
                    <div className="order">
                        <div className="order_label">{t('order')}</div>
                        <div className="order_content"></div>
                    </div>
                </div>

                {mounted ? (
                    <div className="wrapper">
                        {
                            this.state.selectedAnimalDocument ?
                                <AnimalDetail animal={this.state.selectedAnimalDocument.data()}
                                              animalId={this.state.selectedAnimalDocument.id}
                                              close={this.closeDetail}/> :
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


export default withTranslation()(Animals)

