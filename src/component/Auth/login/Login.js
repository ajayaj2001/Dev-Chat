import React from 'react'


import sideGif from '../../../img/livechat.gif'
import './Login.scss'
import LoginForm from './loginForm/LoginForm'


const Login = () => {
    return (
        <div className="loginContainer">
            <div className="login">
                <div className="login__signin">
                    <h2 className="login__signin--heading">Welcome Back</h2>
                    <div className="login__signin--form"><LoginForm /></div>
                </div>

                <img src={sideGif} alt="rocket" className="login__image" />
            </div>
        </div>
    )
}

export default Login
