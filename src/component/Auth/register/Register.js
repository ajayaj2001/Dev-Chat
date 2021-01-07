import React from 'react'

import './Register.scss'
import sideImage from '../../../img/rocket.jpg'
import RegisterForm from './registerForm/RegisterForm'

const Register = () => {
    return (
        <div className="container">
            <div className="register">
                <div className="register__signup">
                    <div className="register__signup--form"><RegisterForm /></div>
                </div>

                <img src={sideImage} alt="rocket" className="register__image" />
            </div>
        </div>
    )
}

export default Register
