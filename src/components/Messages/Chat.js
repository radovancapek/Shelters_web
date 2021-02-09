import React from "react";
import TextField from '@material-ui/core/TextField';
import "./Chat.scss"
import Button from "@material-ui/core/Button";

class Chat extends React.Component {
    divRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            friend: props.friend,
            messages: [],
            name: props.name,
            newMessage: ""
        }
    }

    componentDidMount() {
    }

    getMessages = (messages) => {
        this.setState({messages: messages});
    }

    fetchMessages = () => {
    }

    newMessage = (message) => {
        if(message.from === this.props.friend || message.from === this.props.loggedUser.id) {
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.name !== this.state.name) {
            this.setState({name: this.props.name})
            this.setState({messages: []});
        }
        if (this.props.friend !== this.state.friend) {

        }
    }

    componentWillUnmount() {
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
            this.setState({newMessage: ""});
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.sendMessage()
        }
    }

    render() {
        return (
            <div className="chat">
                <div className="name">
                    <h2>{this.state.name}</h2>
                </div>
                <div className="chat_window" ref={this.divRef}>
                    {this.state.messages.reverse().map(message => {
                        const {id, text, from, seen} = message;
                        let seenAt = null;
                        let messageCN = '';
                        if (from === 1) {
                            messageCN = "right";
                        } else {
                            messageCN = "left";
                        }
                        if(seen) {
                            seenAt = (
                                <div className="seenAt">Seen at</div>
                            )
                        }
                        return (

                            <div className={"messageWrapper " + messageCN} key={id}>
                                <div className="messageText">{text}</div>
                                {seenAt}
                            </div>
                        );
                    })}
                </div>
                <div className="newMessageWrap">
                    <TextField
                        className="newMessage"
                        id="standard-multiline-static"
                        multiline
                        rowsMax={4}
                        variant="outlined"
                        value={this.state.newMessage}
                        placeholder="New message"
                        onKeyDown={this.handleKeyDown}
                        onChange={this.handleNewMessageChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.handleSendClick}
                    >
                        Send
                    </Button>
                </div>
            </div>
        );
    }
}

export default Chat;
