import React, { useState } from 'react'
import { Form, Icon, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import firebase from '../../../../firebase';
import md5 from 'md5';
import './RegisterForm.scss'
const RegisterForm = () => {

    const [errors, seterrors] = useState("")
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [usersRef] = useState(firebase.database().ref('users'));




    const isFormValid = () => {
        if (!username || !email || !password || !confirmPassword) {
            seterrors("Fill all the fields");
            return false;
        }
        else if (password.length < 6 || confirmPassword.length < 6) {
            if (password !== confirmPassword) {
                seterrors("Password dont match")
                return false;
            }
            else {
                seterrors("Password atleast have 6 character")
                return false;
            }
        }
        else {
            return true;
        }
    }


    const formSubmit = (event) => {
        event.preventDefault();
        if (isFormValid()) {
            setLoading(true)
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    seterrors("");
                    createdUser.user.updateProfile({
                        displayName: username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                        .then(() => {
                            usersRef.child(createdUser.user.uid).set({
                                name: createdUser.user.displayName,
                                avatar: createdUser.user.photoURL
                            });
                            setLoading(false);
                        })
                        .catch((err) => {
                            console.log(err);
                            setLoading(false);
                            seterrors(err.message);
                        })
                })
                .catch(err => {
                    seterrors(err.message);
                    setLoading(false);
                });
        }
    }


    return (
        <div className="registerform">
            {
                errors ? <Message error className="registerform__error" ><h2>Error  :  {errors}</h2></Message> : ""

            }

            <h4 className="registerform__heading">Sign Up </h4>
            <Form onSubmit={formSubmit}>
                <Form.Group >
                    <Form.Input
                        fluid
                        id='form-subcomponent-shorthand-input-first-name'
                        label='Username'
                        className="registerform__input1"
                        icon="user"
                        iconPosition="left"
                        type="text"
                        onChange={(event) => setUsername(event.target.value)}
                        value={username}
                    />
                    <Form.Input
                        fluid
                        id='form-subcomponent-shorthand-input-last-name'
                        label='Email'
                        icon="mail"
                        iconPosition="left"
                        type="email"
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}

                        className={errors.toLowerCase().includes('email') ? 'error  registerform__input1' : ' registerform__input1'}
                    />
                </Form.Group>
                <Form.Input
                    fluid
                    name="username"
                    icon="lock"
                    iconPosition="left"
                    label="Password"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    className={errors.toLowerCase().includes('password') ? 'error registerform__input2' : ' registerform__input2'}
                />
                <Form.Input
                    fluid
                    name="username"
                    icon="repeat"
                    iconPosition="left"
                    label="Confirm Password"
                    type="password"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    value={confirmPassword}
                    className={errors.toLowerCase().includes('password dont match') ? 'error registerform__input2' : 'registerform__input2'}
                />
                <Form.Checkbox required label='I agree to the Terms and Conditions' />
                <button type='submit' disabled={loading} className={loading ? 'loading registerform__button' : "registerform__button"} ><Icon name="arrow right" /> </button>
            </Form>
            <div className="registerform__link">Already a user?<Link to="/login">  Login</Link></div>

        </div>
    )
}

export default RegisterForm
