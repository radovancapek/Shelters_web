import React, {Component} from "react";
import "./Login.scss";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as Const from "../../Const";
import { auth } from "../Firebase/Firebase"

class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            email: "",
            password: "",
            password2: "",
            userActive: true,
            sheltersActive: false,
            error: null
        }
    }

    changeType = (type) => {
        switch (type) {
            case Const.USER:
                this.setState(prevState => ({
                    userActive: true,
                    sheltersActive: false,
                }));
                break;
            case Const.SHELTER:
                this.setState({
                    userActive: false,
                    sheltersActive: true,
                });
                break;
            default:
                break;
        }
    }

    register = () => {
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {
                console.log("user signed up");
            })
            .catch((error) => {
                this.setState({error: error});
                console.log(error.message);
            });
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className="login">
                <form className="form" onSubmit={this.addAnimal}>
                    <div className="buttons">
                        <div
                            className={"Button Button_small Button_secondary " + this.state.userActive}
                            id="buttonDogs"
                            onClick={() => this.changeType(Const.USER)}>Uživatel
                        </div>
                        <div className={"Button Button_small Button_secondary " + this.state.sheltersActive}
                             id="buttonCats"
                             onClick={() => this.changeType(Const.SHELTER)}>Útulek
                        </div>
                    </div>
                    <input className="Input Input_text" type="text" name="name"
                           placeholder="Jmeno"
                           onChange={this.updateInput} value={this.state.name}/>
                    <input className="Input Input_text" type="text" name="surname"
                           placeholder="Příjmení"
                           onChange={this.updateInput} value={this.state.surname}/>
                    <input className="Input Input_text" type="email" name="email"
                           placeholder="E-mail"
                           onChange={this.updateInput} value={this.state.mail}/>
                    <input className="Input Input_text" type="password" name="password"
                           placeholder="Heslo"
                           onChange={this.updateInput} value={this.state.password}/>
                    <input className="Input Input_text" type="password" name="password2"
                           placeholder="Heslo podruhé"
                           onChange={this.updateInput} value={this.state.password2}/>
                    <div className="Button submit" onClick={this.register}>
                        {this.state.uploadState === "uploading" ?
                            <CircularProgress progress={this.state.percentUploaded}/>
                            : "Potvrdit"}</div>
                </form>
            </div>
        )
    }
}

export default Registration;
