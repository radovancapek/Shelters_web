import React, {Component} from "react";
import AnimalCard from "../Animals/AnimalCard/AnimalCard";
import {db} from "../Firebase/Firebase"
import "./Swipe.scss";

class Swipe extends Component { constructor(props) {
    super(props);
    this.state = {
        animals: [],
        mounted: false,
        index: 0
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
    this.setState({animals: dogs});
}

loadData(){
    db.collection("dogs")
        .onSnapshot(this.onCollectionUpdate);
}

like = () => {
    this.setState(prevState => ({
        index: prevState.index + 1,
    }));
}

render() {
    const mounted = this.state.mounted;

    return (
            <div className="swipe">
                <div className="swipe_menu"></div>
                {mounted && this.state.animals.length > 0 ? (
                    <AnimalCard largeCard="true" animal={this.state.animals[this.state.index]} className="top"></AnimalCard>
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
