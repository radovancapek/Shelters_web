import React, {Component} from "react";
import AnimalCard from "../Animals/AnimalCard/AnimalCard";
import {db, auth} from "../Firebase/Firebase"
import "./Swipe.scss";
import Filter from "../../Utils/Filter";
import AnimalDetail from "../Animals/AnimalDetail/AnimalDetail";
import firebase from "firebase";
import CircularProgress from '@material-ui/core/CircularProgress';
import {withTranslation} from "react-i18next";

class Swipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animals: [],
            animalDocuments: [],
            animalDocumentsFull: [],
            currentUser: auth.currentUser,
            mounted: false,
            animalsLoaded: false,
            index: 0,
            menuOpen: false,
            selectedAnimalDocument: null
        }
    }

    componentDidMount() {
        this.loadData();
        this.setState({
            mounted: true
        });
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        window.onpopstate = e => {
            e.preventDefault();
            this.closeDetail();
        }

    }

    loadData = () => {
        let likedAnimals = [];
        let dislikedAnimals = [];
        let swipedAnimals = [];
        const userRef = db.collection("users").doc(this.state.currentUser.uid);
        userRef.get().then((user) => {
            if (user.exists) {
                likedAnimals = user.data().likedAnimals || [];
                dislikedAnimals = user.data().dislikedAnimals || [];
                swipedAnimals = likedAnimals.concat(dislikedAnimals);
                this.queryAnimals(swipedAnimals);

            } else {
                console.log("Firestore error");
            }
        });
    }

    queryAnimals = (swipedAnimals) => {
        let animals = [];
        let animalDocuments = [];
        db.collection("animals").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (!swipedAnimals.includes(doc.id)) {
                        animals.push(doc.data());
                        animalDocuments.push(doc);
                    }
                });
                // animals.sort(() => Math.random() - 0.5);
                let animal = animalDocuments.pop();
                this.setState({
                    animalsLoaded: true,
                    animals: animals,
                    animal: animal,
                    animalDocuments: animalDocuments,
                    animalDocumentsFull: animalDocuments
                });
            });
    }

    swipe = (list) => {
        let array = [...this.state.animalDocuments];
        let animal = array.pop();
        let full = [...this.state.animalDocumentsFull];
        let index = full.indexOf(animal)
        if (index !== -1) {
            full.splice(index, 1);
            this.setState({animalDocumentsFull: array});
        }
        const userRef = db.collection("users").doc(this.state.currentUser.uid);
        userRef.update({
            [list]: firebase.firestore.FieldValue.arrayUnion(this.state.animal.id)
        }).then(() => {
            this.setState({animalDocuments: array, animal: animal});
        }).catch(e => {
            console.log("error " + e.message);
        })
    }

    open = () => {
        if (this.state.animalsLoaded) {
            this.setState({menuOpen: true});
        }
    }
    close = () => {
        if (!this.state.selectedAnimalDocument) {
            this.setState({
                menuOpen: false
            });
        }
    }

    filter = (filterData) => {
        this.close();
        let array = [...this.state.animalDocumentsFull];
        if (this.state.animal) {
            array.push(this.state.animal);
        }
        if (array.length > 0) {
            array = array.filter(animalDocument => {
                if (animalDocument !== undefined) {
                    const animal = animalDocument.data();
                    const filterBehavior = filterData.behaviorMap;
                    for (let key in filterBehavior) {
                        if (filterBehavior[key]) {
                            if (!animal.behaviorMap[key]) {
                                return false;
                            }
                        }
                    }
                    let breedFilter;
                    if (animal.breed) {
                        breedFilter = (animal.breed.includes(filterData.breed)) || (filterData.breed.length === 0);
                    } else breedFilter = filterData.breed.length === 0;
                    return (
                        (filterData.type.includes(animal.type) || (filterData.type.length === 0)) &&
                        (filterData.size.includes(animal.size) || (filterData.size.length === 0)) &&
                        (((animal.age >= filterData.age[0]) && (animal.age <= filterData.age[1])) || ((filterData.age[0] === 0) && (filterData.age[1] === 20))) &&
                        (((animal.weight >= filterData.animalWeight[0]) && (animal.weight <= filterData.animalWeight[1])) || ((filterData.animalWeight[0] === 0) && (filterData.weight[1] === 80))) &&
                        ((filterData.gender.includes(animal.gender) || (filterData.gender.length === 0)) &&
                            breedFilter)
                    );
                }
                return null;
            })
            let animal = array.pop();
            if (animal) {
                this.setState({animal: animal});
            } else {
                this.setState({animal: null});
            }
            this.setState({animalDocuments: array});
        }
    }

    openDetail = (animal) => {
        this.setState({selectedAnimalDocument: animal});
    }

    closeDetail = () => {
        this.setState({selectedAnimalDocument: null});
    }

    render() {
        const {t} = this.props;
        const mounted = this.state.mounted;
        return (
            <div className="swipe">
                <Filter menuOpen={this.state.menuOpen} onClick={this.open} onClose={this.close}
                        animalType={this.props.animalType} filter={this.filter}/>
                {
                    this.state.animalsLoaded ? (
                        mounted && this.state.animal ? (
                            this.state.selectedAnimalDocument ?
                                <AnimalDetail animal={this.state.selectedAnimalDocument.data()}
                                              animalId={this.state.selectedAnimalDocument.id} close={this.closeDetail}/>
                                :
                                (<>
                                        <div className="swipe_animal_card_wrapper">
                                            <AnimalCard swipeCard="true" onClickOutside={null}
                                                        key={this.state.animal.id}
                                                        animal={this.state.animal.data()}
                                                        onClick={() => this.openDetail(this.state.animal)}/>
                                        </div>
                                        <div className="buttons">
                                            <button className="Button" onClick={() => {
                                                this.swipe("likedAnimals")
                                            }}>{t('addToFavorites')}
                                            </button>
                                            <button className="Button" onClick={() => {
                                                this.swipe("dislikedAnimals")
                                            }}>{t('next')}
                                            </button>
                                        </div>
                                    </>
                                )
                        ) : <div>Žádná další zvířata.</div>
                    ) : <CircularProgress/>
                }
            </div>
        )
    }
}

export default withTranslation()(Swipe)
