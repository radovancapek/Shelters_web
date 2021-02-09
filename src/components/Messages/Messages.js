import React, {Component} from "react";
import "./Messages.scss";
import Chat from "./Chat";

class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        }
    }

    componentDidMount() {

        this.fetchFriends();
    }

    newMessage = (message) => {
    }

    getUnread = (messages) => {
        this.setState({newMessages: messages});
    }

    fetchFriends() {
    }

    handleFriendClick = (id, name) => {
        this.setState({showChat: true, chatName: name, selected: 1});
    }

    render() {
        const {error, showChat} = this.state;
        return (
            <div className="messages">
                <div className="contacts">
                    <div className="friendsList">
                        <div className="friendWrapper">
                            <div className={1 === this.state.selected ? 'friend selected' : 'friend'}
                                onClick={() => this.handleFriendClick(1, "")}>
                                Radek
                            </div>
                            <div className="friend">Zadek</div>
                        </div>
                    </div>
                </div>
                <div className="conversation">
                    {showChat ? <Chat
                        name={this.state.chatName}
                        friend={this.state.selected}
                        loggedUser={this.props.user}
                    /> : null}
                    {error ? <p>{error.message}</p> : null}
                </div>
            </div>
        );
    }
}

export default Messages;
