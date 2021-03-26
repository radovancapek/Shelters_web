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
            shelterName: "",
            shelterIc: "",
            email: "",
            password: "",
            password2: "",
            errorMessage: null,
            errorMessages: [],
            userActive: true,
            sheltersActive: false,
            registrationState: "",
            logInRedirect: false,
            wrongIc: false
        }
    }

    changeType = (type) => {
        this.setState({
            wrongIc: "",
            shelterNameError: "",
            emailError: "",
            passwordError: "",
            passwordMismatch: "",
            firebaseEmailFormatError: "",
            firebaseEmailExistsError: "",
            firebasePasswordError: ""
        })
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

    validateIC = () => {
        let ic = this.state.shelterIc;
        let sum = 0;
        const lastDigit = ic.charAt(7)
        if (ic.length !== 8 || isNaN(parseInt(ic))) {
            return false;
        }
        for (let i = 0; i < 7; i++) {
            let digit = parseInt(ic.charAt(i))
            sum += digit * (8 - i);
        }
        return lastDigit === (11 - (sum % 11)) % 10;
    }

    validate = () => {
        let valid = true;
        let email = this.state.email;
        let password = this.state.password;
        let password2 = this.state.password2;
        let shelterName = this.state.shelterName;
        if (this.state.sheltersActive) {
            if(shelterName.length === 0)
            {
                this.setState({shelterNameError: "error"});
                valid = false;
            }
            if (!this.validateIC()) {
                valid = false;
                this.setState({
                    wrongIc: "error"
                });
            }
        }

        if(email.length === 0) {
            valid = false;
            this.setState({emailError: "error"});
        }
        if(password.length === 0) {
            valid = false;
            this.setState({passwordError: "error"});
        }

        if (password !== password2) {
            valid = false;
            this.setState({
                passwordMismatch: "error"
            });
        }
        return valid;
    }

    register = () => {
        if (this.validate()) {
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
                            this.setState({
                                firebaseEmailFormatError: "error"
                            });
                            break;
                        case "auth/email-already-in-use":
                            this.setState({
                                firebaseEmailExistsError: "error"
                            });
                            break;
                        case "auth/weak-password":
                            this.setState({
                                firebasePasswordError: "error"
                            });
                            break;
                        default:
                            this.setState({firebaseError: "Chyba"});
                            break;
                    }
                });
        }
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
        let name = e.target.name;
        let val = e.target.value;
        console.log(name);
        if(val.length > 0) {
            switch (name) {
                case "email":
                    this.setState({emailError: ""});
                    break;
                case "password":
                    this.setState({passwordError: ""});
                    break;
                case "shelterName":
                    this.setState({shelterNameError: ""});
                    break;
                case "shelterIc":
                    this.setState({wrongIc: ""});
                    break;
            }
        }
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        console.log(this.state.errorMessages);
        if (this.state.logInRedirect) {
            return (
                <Redirect to="/"/>
            )
        }

        let errorMessages = this.state.errorMessages.map((message, i) => {

            return (
                <div className="error_message" key={i}>{message}</div>
            );
        });

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
                    {this.state.userActive && (
                        <>
                            <input className={"Input Input_text " + this.state} type="text" name="name"
                                   placeholder="Jmeno"
                                   onChange={this.updateInput} value={this.state.name}/>
                            <input className="Input Input_text" type="text" name="surname"
                                   placeholder="Příjmení"
                                   onChange={this.updateInput} value={this.state.surname}/>
                        </>
                    )}
                    {this.state.sheltersActive && (
                        <>
                            <input className={"Input Input_text " + this.state.shelterNameError} type="text" name="shelterName"
                                   placeholder="Název"
                                   onChange={this.updateInput} value={this.state.shelterName}/>
                            {this.state.shelterNameError && <div className="error_message">{Const.EMPTY_FIELD}</div>}
                            <input className={"Input Input_text " + this.state.wrongIc} type="text" name="shelterIc"
                                   placeholder="IČ"
                                   onChange={this.updateInput} value={this.state.shelterIc}/>
                            {this.state.wrongIc && <div className="error_message">{Const.WRONG_IC}</div>}
                        </>
                    )}
                    <input className={"Input Input_text " + this.state.emailError + this.state.firebaseEmailFormatError + this.state.firebaseEmailExistsError} type="email" name="email"
                           placeholder="E-mail"
                           onChange={this.updateInput} value={this.state.mail}/>
                    {this.state.emailError && <div className="error_message">{Const.EMPTY_FIELD}</div>}
                    {this.state.firebaseEmailFormatError && <div className="error_message">{Const.FIREBASE_EMAIL_FORMAT_ERROR}</div>}
                    {this.state.firebaseEmailExistsError && <div className="error_message">{Const.FIREBASE_EMAIL_EXISTS}</div>}
                    <input className={"Input Input_text " + this.state.passwordError + this.state.firebasePasswordError} type="password" name="password"
                           placeholder="Heslo"
                           onChange={this.updateInput} value={this.state.password}/>
                    {this.state.passwordError && <div className="error_message">{Const.EMPTY_FIELD}</div>}
                    {this.state.firebasePasswordError && <div className="error_message">{Const.FIREBASE_WEAK_PASSWORD}</div>}
                    <input className={"Input Input_text " + this.state.passwordMismatch} type="password" name="password2"
                           placeholder="Heslo podruhé"
                           onChange={this.updateInput} value={this.state.password2}/>
                    {this.state.passwordMismatch && <div className="error_message">{Const.PASSWORD_MISMATCH}</div>}
                    <div className="Button submit" onClick={this.register}>
                        {this.state.registrationState === Const.UPLOADING ?
                            <CircularProgress progress={this.state.percentUploaded}/>
                            : "Registrovat"}</div>
                    {this.state.firebaseError && <div className="error_message">{this.state.firebaseError}</div>}
                </form>
            </div>
        )
    }
}

export default Registration;
