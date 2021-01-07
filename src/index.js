import React, { useEffect } from 'react';
import { useHistory, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ReactDOM from 'react-dom';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from './action'

import firebase from 'firebase/app';
import 'semantic-ui-css/semantic.min.css';

import App from './component/app/App';
import Login from "./component/Auth/login/Login";
import Register from "./component/Auth/register/Register";
import rootReducer from './reducers';
import Spinner from '../src/component/spinner/Spinner'
import './index.scss'

const store = createStore(rootReducer, composeWithDevTools());

const Root = () => {
    let history = useHistory()
    const dispatch = useDispatch();
    var isLoading = useSelector(state => state.user.isLoading)
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(setUser(user));
                history.push('/');
            }
            else {
                history.push('/login');
                dispatch(clearUser());
            }
        })
    }, [dispatch, history]);

    return isLoading ? <Spinner /> : (

        <Switch>
            <Route exact path="/" component={App} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
        </Switch>

    )
}

export const RouterRoot = (props) => {
    return (
        <Provider store={store}>
            <Router basename="/Fire-Chat/">
                {props.children}
            </Router>
        </Provider>
    )
}



ReactDOM.render(<RouterRoot><Root /></RouterRoot>, document.getElementById('root'));