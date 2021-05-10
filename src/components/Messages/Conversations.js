import React from "react";
import "./Conversations.scss";
import {db, fieldPath} from "../Firebase/Firebase";
import {CONVERSATIONS} from "../../Const";


class Conversations extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            conversations: [],
            activeConIndex: null
        }
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        console.log("prevCons " + prevProps.conversations + "Cons " + this.props.conversations);
        if(prevProps.conversations !== this.props.conversations) {
            console.log("loadConversations");
            this.loadConversations();
        }
    }

    loadUsers = (userIds) => {
        let users = [];
        if(userIds.length > 0) {
            this.unsubscribe = db.collection("users").where(fieldPath.documentId(), "in", userIds)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        users.push(doc);
                    })
                    if(users)
                        this.setState({users: [...this.state.users, ...users]});
                })
        }
    }

    loadConversations = () => {
        let userIds = [];
        let conversations = [];
        if(this.props.conversations.length > 0) {
            this.unsubscribe2 = db.collection(CONVERSATIONS).where(fieldPath.documentId(), "in", this.props.conversations)
                .onSnapshot(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        let con = doc.data();
                        if(con.user1 === this.props.loggedId) {
                            userIds.push(con.user2);
                        } else {
                            userIds.push(con.user1);
                        }
                        conversations.push(doc);
                    })

                    if(conversations) {
                        this.setState({conversations: [...this.state.conversations, ...conversations]});
                        this.loadUsers(userIds);
                    }
                })

        }


    }

    componentWillUnmount() {
        if(this.unsubscribe) this.unsubscribe();
        if(this.unsubscribe2) this.unsubscribe2();
    }

    handleConversationClick = (index) => {
        this.props.onClick(this.state.conversations[index].id);
        this.setState({activeConIndex: index});
    }

    render() {
        const conversations = this.state.users.map((userDoc, i) => {
            const user = userDoc.data();
            const clicked = ((this.state.activeConIndex === i) || (this.state.conversations[i].id === this.props.activeCon)) ? " active" : "";
            return (
                <div className={"conversation" + clicked} onClick={() => {this.handleConversationClick(i)}} key={i}>
                    {user.name}
                </div>
            );
        })

        return (
            <div className="conversations">
                {conversations}
            </div>
        );
    }
}

export default Conversations;
