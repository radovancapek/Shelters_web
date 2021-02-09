import React, {Component} from "react";
import "./Login.scss";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as Const from "../../Const";
import {auth, db} from "../Firebase/Firebase"
import {Redirect} from "react-router-dom";

class Registration extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            email: "",
            password: "",
            password2: "",
            errorMessage: null,
            userActive: true,
            sheltersActive: false,
            registrationState: "",
            logInRedirect: false
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
        let email = this.state.email;
        let password = this.state.password;
        let password2 = this.state.password2;
        if ((email.length === 0) || (password.length === 0) || (password2.length === 0)) {
            this.setState({errorMessage: "E-mail a heslo nesmí být prázdné"});
            return;
        }
        if(password !== password2) {
            this.setState({errorMessage: "Hesla se neshodují."});
            return;
        }
        this.setState({registrationState: Const.UPLOADING});
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((userCredential) => {
                console.log("user signed up");
                this.addUserToFirestore(userCredential.user.uid);
                this.setState({
                    registrationState: ""
                });
            })
            .catch((error) => {
                this.setState({registrationState: ""});
                switch (error.code) {
                    case "auth/invalid-email":
                        this.setState({errorMessage: "Zadaná adresa není ve správném formátu."});
                        break;
                    case "auth/email-already-in-use":
                        this.setState({errorMessage: "Uživatel s touto e-mailovou adresou již existuje."});
                        break;
                    case "auth/weak-password":
                        this.setState({errorMessage: "Heslo musí mít alespoň 6 znaků."});
                        break;
                    default:
                        this.setState({errorMessage: "Chyba"});
                        break;
                }
            });
    }

    addUserToFirestore = (id) => {
        db.collection("users").doc(id).set(
            {
                name: this.state.name,
                surname: this.state.surname,
                email: this.state.email
            }
        ).then(() => {
            this.setState({
                logInRedirect: true,
                registrationState: ""
            });
        }).catch((error) => {
            console.log(error.message);
            this.setState({errorMessage: "Chyba"})
        })
        this.setState({
            name: ""
        });
    };

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        if (this.state.logInRedirect) {
            return (
                <Redirect to="/"/>
            )
        }
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
                    {this.state.errorMessage ?
                        <div className="error_message">{this.state.errorMessage}</div>
                        : null
                    }
                    <div className="Button submit" onClick={this.register}>
                        {this.state.registrationState === Const.UPLOADING ?
                            <CircularProgress progress={this.state.percentUploaded}/>
                            : "Registrovat"}</div>
                </form>
            </div>
        )
    }
}

export default Registration;
