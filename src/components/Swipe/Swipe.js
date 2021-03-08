import React, { Component } from "react";
import AnimalCard from "../Animals/AnimalCard/AnimalCard";
import { db } from "../Firebase/Firebase"
import "./Swipe.scss";
import Menu from "./Menu";
import AnimalDetail from "../Animals/AnimalDetail/AnimalDetail";

class Swipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            mounted: false,
            index: 0,
            menuOpen: false,
            selectedAnimal: null
        }
    }

    componentDidMount() {
        this.loadData();
        this.setState({ mounted: true });
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        window.onpopstate = e => {
            e.preventDefault();
            this.closeDetail();
        }

    }

    onCollectionUpdate = (querySnapshot) => {
        const dogs = [];
        console.log(this.props.animalType);
        querySnapshot.forEach((doc) => {
            //if(doc.data().type === this.props.animalType) {
            dogs.push(doc.data())
            //}
        });
        dogs.sort(() => Math.random() - 0.5);
        this.setState({ animals: dogs });
    }

    loadData() {
        db.collection("animals")
            .onSnapshot(this.onCollectionUpdate);
    }

    like = () => {
        this.setState(prevState => ({
            index: prevState.index + 1,
        }));
    }

    open = () => {
        this.setState({
            menuOpen: true
        });
    }
    close = () => {
        if(!this.state.selectedAnimal) {
            this.setState({
                menuOpen: false
            });
        }
    }

    filter = () => {
        this.setState(prevState => ({
            index: prevState.index + 1,
        }));
        // TODO filtrovani na zaklade dat co posleme z menu
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

        return (
            <div className="swipe">
                <Menu menuOpen={this.state.menuOpen} onClick={this.open} onClickOutside={this.close} animalType={this.props.animalType} filter={this.filter} />
                {mounted && this.state.animals.length > 0 ? (
                    this.state.selectedAnimal ?
                        <AnimalDetail animal={this.state.selectedAnimal} close={this.closeDetail}/>
                        :
                        (
                            <div className="swipe_animal_card_wrapper">
                                <AnimalCard swipeCard="true" onClickOutside={null} animal={this.state.animals[this.state.index]} onClick={() => this.openDetail(this.state.animals[this.state.index])}/>
                            </div>
                        )
                ) : (null)}
                <div className="buttons">
                    <button className="Button" onClick={this.like}>líbí</button>
                    <button className="Button">nelíbí</button>
                </div>
            </div>
        )
    }
}

export default Swipe;
