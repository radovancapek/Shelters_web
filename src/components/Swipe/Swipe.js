import React, { Component } from "react";
import AnimalCard from "../Animals/AnimalCard/AnimalCard";
import { db } from "../Firebase/Firebase"
import "./Swipe.scss";
import Menu from "./Menu";

class Swipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            mounted: false,
            index: 0,
            menuOpen: false
        }
    }

    componentDidMount() {
        this.loadData();
        this.setState({ mounted: true });
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
        db.collection("dogs")
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
        this.setState({
            menuOpen: false
        });
    }

    filter = () => {
        this.setState(prevState => ({
            index: prevState.index + 1,
        }));
        // TODO filtrovani na zaklade dat co posleme z menu
    }

    render() {
        const mounted = this.state.mounted;

        return (
            <div className="swipe">
                <Menu menuOpen={this.state.menuOpen} onClick={this.open} onClickOutside={this.close} animalType={this.props.animalType} filter={this.filter} />
                {mounted && this.state.animals.length > 0 ? (
                    <AnimalCard largeCard="true" animal={this.state.animals[this.state.index]}></AnimalCard>
                ) : (null)}
                <div className="buttons">
                    <button onClick={this.like}>líbí</button>
                    <button >nelíbí</button>
                </div>
            </div>
        )
    }
}

export default Swipe;
