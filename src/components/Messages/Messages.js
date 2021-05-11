import React, {Component} from "react";
import "./Messages.scss";
import Chat from "./Chat";
import {auth, db, fieldValue} from "../Firebase/Firebase";
import Conversations from "./Conversations";
import {CONVERSATIONS} from "../../Const";

class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mounted: false,
            user: null,
            conversations: [],
            activeConId: null,
            loggedId: auth.currentUser.uid,
            newMessages: [],
            loggedUser: props.user,
            timestamp: null,
            loadingFriends: true,
            error: null,
            selectedMessages: [],
            friends: [],
            showChat: true, //todo
            chatName: "",
            chatId: null,
            selected: 0,
            contactUserId: "",
            selectedConversation: null,
            finishedTasks: 0,
            task1Finished: false,
            task2Finished: false
        }
    }

    componentDidMount() {
        if(this.props.location.state) {
            this.setState({
                contactUserId: this.props.location.state.animal.user,
                mounted: true
            })
            this.unsubscribe2 = db.collection(CONVERSATIONS)
                .where("user1", "==", this.props.location.state.animal.user)
                .where("user2", "==", this.state.loggedId)
                .onSnapshot(querySnapshot => {
                    let id = null;
                    querySnapshot.forEach(doc => {
                        id = doc.id;
                    })
                    if(id) {
                        this.setState({
                            activeConId: id,
                            task1Finished: true
                        });
                    } else {
                        this.setState({
                            task1Finished: true
                        });
                    }
                })
            this.unsubscribe3 = db.collection(CONVERSATIONS)
                .where("user2", "==", this.props.location.state.animal.user)
                .where("user1", "==", this.state.loggedId)
                .onSnapshot(querySnapshot => {
                    let id = null;
                    querySnapshot.forEach(doc => {
                        id = doc.id;
                    })
                    if(id) {
                        this.setState({
                            activeConId: id,
                            task2Finished: true
                        });
                    } else {
                        this.setState({
                            task2Finished: true
                        });
                    }

                })

        } else {
            this.setState({mounted: true});
            this.loadData();
        }


    }

    loadData = () => {
        db.collection("users").doc(auth.currentUser.uid).get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({
                        user: doc.data(),
                        conversations: doc.data().conversations
                    });
                }
            })
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(this.state.task1Finished && this.state.task2Finished) {
            if(this.state.activeConId === null) {
                this.createConversation();
            } else {
                this.loadData();
            }
            this.setState({task1Finished: false, task2Finished: false});
        }
    }

    componentWillUnmount() {
        if(this.unsubscribe2) this.unsubscribe2();
        if(this.unsubscribe3) this.unsubscribe3();
    }

    createConversation = () => {
        db.collection(CONVERSATIONS).add({
            user1: this.props.location.state.animal.user,
            user2: this.state.loggedId
        })
            .then((docRef) => {
                this.addConversationToUsers(docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    addConversationToUsers = (conId) => {
        db.collection("users").doc(this.state.loggedId).update({
            conversations: fieldValue.arrayUnion(conId)
        }).then(() => {
            db.collection("users").doc(this.props.location.state.animal.user).update({
                conversations: fieldValue.arrayUnion(conId)
            }).then(() => {
                this.setState({
                    activeConId: conId,
                    conversations: [...this.state.conversations, conId]
                });
                console.log("Conversation created with ID: ", conId);
            })
        })

    }

    onConversationClick = (id) => {
        this.setState({activeConId: id});
    }

    render() {
        const {error, activeConId, conversations} = this.state;
        return (
            <div className="messages">
                <div className="conversationsWrapper">
                    {conversations && <Conversations
                        onClick={this.onConversationClick}
                        loggedId={this.state.loggedId}
                        conversations={conversations}
                        activeCon={activeConId}
                    />}
                </div>
                <div className="chatWrapper">
                    {activeConId ? <Chat
                        id={activeConId}
                        loggedId={this.state.loggedId}
                    /> : null}
                    {error ? <p>{error.message}</p> : null}
                </div>
            </div>
        );
    }

}

export default Messages;
