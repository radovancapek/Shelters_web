import React from 'react';
import {Route, Redirect, withRouter} from 'react-router-dom';
import {auth} from "./components/Firebase/Firebase";

class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogged: false,
            loaded: false
        }
    }

    componentDidMount() {
        this.checkIsLogged();
    }

    checkIsLogged = () => {
        this.unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    isLogged: true,
                    loaded: true,
                });
            } else {
                this.setState({
                    isLogged: false,
                    loaded: true,
                });
            }
        })
    }

    componentWillUnmount() {
        if(this.unsubscribe) this.unsubscribe();
    }

    render() {
        const {component: Component, ...rest} = this.props;
        const currentLocation = this.props.location.pathname;

        if (!this.state.loaded) return null;
        return (
            <Route {...rest}
                   render={props => {
                       return this.state.isLogged === true ? (
                           <Component {...props} />
                       ) : (
                           <Redirect to={{
                               pathname: '/login',
                               state: {from: currentLocation}
                           }}/>
                       )
                   }}
            />
        )
    }
}

export default withRouter(PrivateRoute);
