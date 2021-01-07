import React, { useState } from 'react'
import { Form, Message } from 'semantic-ui-react'
import './LoginForm.scss'
import { Link } from 'react-router-dom';
import firebase from '../../../../firebase';


const LoginForm = () => {

    const [errors, seterrors] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);




    const formSubmit = (event) => {
        event.preventDefault();
        if (email && password) {
            setLoading(true);
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    setLoading(false);
                    seterrors("")
                })
                .catch((err) => {
                    console.log(err);
                    seterrors(err.message)
                    setLoading(false);
                })
        }
        else {
            seterrors("Fill  the data")
        }
    }



    return (
        <div className="loginForm">
            {
                errors ? <Message error style={{ width: '40rem', height: '5rem' }} ><h2>Error:{errors}</h2></Message> : ""

            }
            <Form onSubmit={formSubmit}>
                <Form.Input
                    fluid
                    name="email"
                    icon="mail"
                    iconPosition="left"
                    label="Email"
                    type="Email"
                    onChange={(event) => setEmail(event.target.value)} value={email}
                    className={errors.toLowerCase().includes('email') ? 'error loginForm__input' : 'loginForm__input'}
                />
                <Form.Input
                    fluid
                    name="password"
                    icon="lock"
                    iconPosition="left"
                    label="Password"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)} value={password}
                    className={errors.toLowerCase().includes('password') ? 'error loginForm__input' : 'loginForm__input'}
                />
                <button disabled={loading} className={loading ? 'loading loginForm__button' : " loginForm__button"} type='submit'>Login </button>
            </Form>
            <div className="loginForm__link">Don't Have An Account?<Link to="/register" >  Register</Link></div>

        </div>
    )
}

export default LoginForm
