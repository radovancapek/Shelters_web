import React from "react";
import "./Chat.scss"
import Button from "@material-ui/core/Button";
import {timestamp, db, fieldPath} from "../Firebase/Firebase";
import {CONVERSATIONS} from "../../Const";
import {withTranslation} from "react-i18next";

class Chat extends React.Component {
    divRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            conversation: props.conversation,
            messages: [],
            name: props.name,
            newMessage: "",
            messagesLoaded: false,
            clickedMessage: null
        }
    }

    componentDidMount() {
        this.fetchMessages();
    }

    getMessages = (messages) => {
        this.setState({messages: messages});
    }

    fetchMessages = () => {

        this.unsubscribe = db.collection(CONVERSATIONS).doc(this.props.id).collection("messages").orderBy("sent", "desc")
            .onSnapshot(querySnapshot => {
                let messages = [];
                querySnapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        messages.push(change.doc.data());
                    }
                    if (change.type === "modified") {
                    }
                    if (change.type === "removed") {
                    }

                });
                if (messages)
                    this.setState({
                        messages: [...messages, ...this.state.messages],
                        messagesLoaded: true
                    });
            })
    }

    newMessage = (message) => {
        if (message.from === this.props.conversation || message.from === this.props.loggedUser.id) {
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.name !== this.state.name) {
            this.setState({name: this.props.name})
            this.setState({messages: []});
        }
        if (this.props.conversation !== this.state.conversation) {

        }
    }

    componentWillUnmount() {
        if(this.unsubscribe) this.unsubscribe();
    }

    handleSendClick = () => {
        this.sendMessage()
    }

    handleNewMessageChange = (e) => {
        this.setState({newMessage: e.target.value});
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    sendMessage() {
        if (this.state.newMessage.length > 0) {
            db.collection(CONVERSATIONS).doc(this.props.id).collection("messages")
                .add({
                    from: this.props.loggedId,
                    to: this.props.id,
                    message: this.state.newMessage,
                    sent: timestamp.now()
                })
                .then(doc => {
                    console.log("Message sent", doc);
                }).catch(error => {
                console.log("Error", error);
            })


            this.setState({newMessage: ""});
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.sendMessage()
        }
    }

    isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    handleMessageClick = (i) => {
        if(i === this.state.clickedMessage)
            this.setState({clickedMessage: null});
        else
            this.setState({clickedMessage: i});
    }

    render() {
        const {t} = this.props;
        return (
            <div className="chat">
                <div className="name">
                    <h2>{this.state.name}</h2>
                </div>
                {this.state.messagesLoaded && (
                    <div className="chat_window" ref={this.divRef}>
                        {this.state.messages.map((messageObj, i) => {
                            const {message, from, to, sent} = messageObj;
                            let dateTime = sent.toDate();
                            let time;
                            if(this.isToday(dateTime)) {
                                time = dateTime.toLocaleTimeString("cs-CZ");
                            } else {
                                time = dateTime.toLocaleDateString("cs-CZ");
                            }
                            let messageCN = '';
                            if (from === this.props.loggedId) {
                                messageCN = "right";
                            } else {
                                messageCN = "left";
                            }
                            return (
                                <>
                                    <div className={"messageWrapper " + messageCN} key={i} onClick={() => {this.handleMessageClick(i)}}>
                                        <div className="messageText">{message}</div>
                                        {i === this.state.clickedMessage && <div className="messageTime">{time}</div>}
                                    </div>

                                </>
                            );
                        })}
                    </div>
                )}

                <div className="newMessageWrap">
                    <input className="Input Input_text" type="text" name="newMessage"
                           onChange={this.handleNewMessageChange} value={this.state.newMessage}
                           onKeyDown={this.handleKeyDown}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.handleSendClick}
                    >
                        {t('send')}
                    </Button>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Chat);
