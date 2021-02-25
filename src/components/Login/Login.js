import React, {Component} from "react";
import "./Login.scss";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as Const from "../../Const";
import {auth} from "../Firebase/Firebase"
import {withRouter} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            loginErrorMessage: null,
            email: "",
            resetPasswordEmail: "",
            dialogErrorMessage: null,
            dialogSuccessMessage: null,
            password: "",
            dialogInputDisabled: false,
            dialogSendButtonDisabled: true,
            userActive: true,
            sheltersActive: false,
            error: null,
            logInRedirect: false,
            loginState: "",
            openForgotPasswordDialog: false
        }
    }

    componentDidMount() {
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

    login = () => {
        let email = this.state.email;
        let password = this.state.password;

        if ((email.length === 0) || (password.length === 0)) {
            this.setState({loginErrorMessage: "Žádné pole nesmí být prázdné"});
            return;
        }

        this.setState({loginState: Const.UPLOADING});
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let from;
                if (this.props.location.state) {
                    from = this.props.location.state.from || {from: {pathname: '/'}}
                } else {
                    from = {pathname: '/'}
                }
                this.props.history.push(from);

                console.log("history push to " + from);
            })
            .catch((error) => {
                this.setState({loginState: ""});
                switch (error.code) {
                    case "auth/invalid-email":
                        this.setState({loginErrorMessage: "Zadaná adresa není ve správném formátu."})
                        break;
                    case "auth/user-not-found":
                        this.setState({loginErrorMessage: "Uživatel s touto e-mailovou adresou nebyl nalezen."})
                        break;
                    case "auth/wrong-password":
                        this.setState({loginErrorMessage: "Nesprávné heslo."})
                        break;
                    default:
                        this.setState({loginErrorMessage: "Chyba"})
                        break;
                }
            });
    }

    updateInput = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
        if (this.state.email.length > 0 && this.state.password.length > 0) {
            this.setState({loginErrorMessage: null});
        }
        this.setState(prevState => ({
            dialogSendButtonDisabled: prevState.resetPasswordEmail.length === 0
        }));

    }

    sendPasswordReset = () => {
        auth.sendPasswordResetEmail(this.state.resetPasswordEmail)
            .then(() => {
                this.setState({
                    dialogSuccessMessage: "E-mail byl úspěšně odeslán.",
                    dialogErrorMessage: null,
                    resetPasswordEmail: "",
                    dialogSendButtonDisabled: true,
                    dialogInputDisabled: true
                })
            })
            .catch((error) => {
                console.log(error.message);
                console.log(error.code);
                switch (error.code) {
                    case "auth/invalid-email":
                        this.setState({dialogErrorMessage: "Zadaná adresa není ve správném formátu."})
                        break;
                    case "auth/user-not-found":
                        this.setState({dialogErrorMessage: "Uživatel s touto e-mailovou adresou nebyl nalezen."})
                        break;
                    default:
                        this.setState({dialogErrorMessage: "Chyba"})
                        break;
                }
            });
    }

    handleDialogClose = () => {
        this.setState({
            openForgotPasswordDialog: false,
            dialogSuccessMessage: null,
            dialogErrorMessage: null,
            resetPasswordEmail: "",
            dialogInputDisabled: false
        });
    }

    forgotPasswordClick = () => {
        this.setState({openForgotPasswordDialog: true});
    }

    render() {
        // if (auth.currentUser) {
        //     return (
        //         <Redirect to={"/"}/>
        //     )
        // }

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
                    <input className="Input Input_text" type="text" name="email"
                           placeholder="Email"
                           onChange={this.updateInput} value={this.state.email}/>
                    <input className="Input Input_text" type="password" name="password"
                           placeholder="Heslo"
                           onChange={this.updateInput} value={this.state.password}/>
                    {this.state.loginErrorMessage ?
                        <div className="error_message">{this.state.loginErrorMessage}</div>
                        : null
                    }
                    <div className="Button submit" onClick={this.login}>
                        {this.state.loginState === Const.UPLOADING ?
                            <CircularProgress progress={this.state.percentUploaded}/>
                            : "Přihlásit"}</div>
                    <div className="forgot_password" onClick={this.forgotPasswordClick}>
                        Zapomneli jste heslo?
                    </div>
                </form>
                <Dialog className="dialog" open={this.state.openForgotPasswordDialog} onClose={this.handleDialogClose}
                        aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Zapomenuté heslo</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Zadejte e-mailovou adresu, kterou jste použili při registraci a na kterou Vám přijde odkaz
                            pro resetování hesla.
                        </DialogContentText>
                        <input className="Input dialog_input" type="text" name="resetPasswordEmail"
                               placeholder="Email"
                               disabled={this.state.dialogInputDisabled}
                               onChange={this.updateInput} value={this.state.resetPasswordEmail}/>
                        {this.state.dialogErrorMessage ?
                            <div className="error_message">{this.state.dialogErrorMessage}</div>
                            : null
                        }
                        {this.state.dialogSuccessMessage ?
                            <div className="dialog_success_message">{this.state.dialogSuccessMessage}</div>
                            : null
                        }

                    </DialogContent>
                    <DialogActions>
                        <button className="dialog_confirm_button" onClick={this.handleDialogClose}>
                            Zavrit
                        </button>
                        <button className="dialog_close_button" disabled={this.state.dialogSendButtonDisabled}
                                onClick={this.sendPasswordReset}>
                            Odeslat
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withRouter(Login);
