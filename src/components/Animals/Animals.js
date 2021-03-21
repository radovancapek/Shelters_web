import React, {Component} from "react";
import "./Animals.scss";
import AnimalCard from "./AnimalCard/AnimalCard";
import {db} from "../Firebase/Firebase"
import AnimalDetail from "./AnimalDetail/AnimalDetail";
import ScrollUpButton from "react-scroll-up-button";
import Filter from "../../Utils/Filter";
import {SIZE_MEDIUM, SIZE_SMALL} from "../../Const";

class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            animalsFull: [],
            animalDocumentsFull: [],
            mounted: false,
            selectedAnimal: null,
            filterOpened: false
        }
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
            for(let key in filterBehavior) {
                if(filterBehavior[key]) {
                    if(!animal.behaviorMap[key]) {
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
        const mounted = this.state.mounted;
        let animalCards;
        if (mounted) {
            animalCards = this.state.animals.map((animal, i) => {
                return (
                    <AnimalCard animal={animal} key={i} className="card" onClick={() => this.openDetail(animal)}/>
                );
            });
        }
        return (
            <div className="animals">
                <Filter menuOpen={this.state.filterOpened} openFilter={this.openFilter} onClose={this.closeFilter}
                        filter={this.filter}/>
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

export default Animals;
