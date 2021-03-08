import React, {Component} from "react";
import "./Animals.scss";
import AnimalCard from "./AnimalCard/AnimalCard";
import {db} from "../Firebase/Firebase"
import AnimalDetail from "./AnimalDetail/AnimalDetail";

class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            mounted: false,
            selectedAnimal: null
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

    onCollectionUpdate = (querySnapshot) => {
        const animals = [];
        querySnapshot.forEach((doc) => {
            animals.push(doc.data())
        });
        this.setState({animals: animals});
    }

    loadData() {
        db.collection("animals")
            .onSnapshot(this.onCollectionUpdate);
    }

    openDetail = (animal) => {
        this.setState({selectedAnimal: animal});
    }

    closeDetail = () => {
        console.log("close detail");
        this.setState({selectedAnimal: null});
    }

    render() {
        const mounted = this.state.mounted;
        let animalCards;
        if(mounted) {
            animalCards = this.state.animals.map((animal, i) => {
                return (
                    <AnimalCard animal={animal} key={i} className="card" onClick={() => this.openDetail(animal)}/>
                );
            });
        }


        return (
            <div className="page">
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
                {
                }

            </div>

        )
    }
}

export default Animals;
