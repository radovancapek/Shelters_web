import React, {Component} from "react";
import "./Animals.scss";
import AnimalCard from "./AnimalCard/AnimalCard";
import {auth, db, fieldPath} from "../Firebase/Firebase"
import AnimalDetail from "./AnimalDetail/AnimalDetail";
import ScrollUpButton from "react-scroll-up-button";
import Filter from "../../Utils/Filter";
import {withTranslation} from "react-i18next";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PublicToolbar from "../Toolbar/PublicToolbar";

class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedId: null,
            animals: [],
            animalsFull: [],
            animalDocuments: [],
            animalDocumentsFull: [],
            mounted: false,
            selectedAnimalDocument: null,
            filterOpened: false,
            userLocation: null,
            findActive: false,
            chip: ""
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({loggedId: user.uid})
            } else {
                this.setState({loggedId: null})
            }
        });
        if (this.props.likedAnimals) {
            db.collection("users").doc(auth.currentUser.uid).get()
                .then((doc) => {
                    let likedAnimals = doc.data().likedAnimals || [];
                    this.loadData(likedAnimals);
                    this.setState({mounted: true});
                })
        } else {
            this.loadData(null);
            this.setState({mounted: true});
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        window.onpopstate = e => {
            e.preventDefault();
            this.closeDetail();
        }
    }

    componentWillUnmount() {
        this.setState({mounted: false});
        if (this.unsubscribe) this.unsubscribe();
    }

    loadData(likedAnimals) {
        let animals = [];
        let animalDocuments = [];
        let task = db.collection("animals");
        if (this.props.myAnimals) task = db.collection("animals").where("user", "==", auth.currentUser.uid);
        else if (this.props.likedAnimals) task = db.collection("animals").where(fieldPath.documentId(), "in", likedAnimals);

        task.get()
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

    updateChipInput = (e) => {
        const chip = e.target.value;
        this.setState({chip: chip})
        const filteredAnimalDocuments = this.state.animalDocumentsFull.filter(animalDocument => {
            return (animalDocument.data().chip === chip);
        })
        this.setState({animalDocuments: filteredAnimalDocuments});
    }

    handleFindClick = () => {
        this.setState({findActive: !this.state.findActive});
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
                    <AnimalCard animal={animalDocument.data()}
                                animalId={animalDocument.id}
                                key={i}
                                className="card"
                                location={this.state.userLocation}
                                onClick={() => this.openDetail(animalDocument)}
                                loggedId={this.state.loggedId}
                    />
                );
            });
        }
        return (
            <div className="animals">
                <div className="actions"><Filter menuOpen={this.state.filterOpened} openFilter={this.openFilter}
                                                 onClose={this.closeFilter}
                                                 filter={this.filter}/>

                    {this.state.findActive ? (
                        <div className="find">
                            <div className="Input_wrapper">
                                <input className="Input Input_text" type="text" name="chip"
                                       onChange={this.updateChipInput} value={this.state.chip}/>
                                <FontAwesomeIcon className="closeIcon" icon={faTimes} onClick={this.handleFindClick}/>
                            </div>

                        </div>
                    ) : (
                        <div className="find">
                            <div className="find_label" onClick={this.handleFindClick}>{t('findByChip')}</div>
                        </div>
                    )}
                </div>

                {mounted ? (
                    <div className="wrapper">
                        {
                            this.state.selectedAnimalDocument ?
                                <AnimalDetail animal={this.state.selectedAnimalDocument.data()}
                                              animalId={this.state.selectedAnimalDocument.id}
                                              close={this.closeDetail}
                                              loggedId={this.state.loggedId} /> :
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

