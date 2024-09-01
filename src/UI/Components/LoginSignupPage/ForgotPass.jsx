import React, { useEffect, useState } from 'react';
import './ForgotPass.css';
import Lottie from 'lottie-react';
import forgotPass from '../../Assets/ForgotPass.json';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ForgotPassword = ({ error, setError, setSuccessfulMessage, setSuccess }) => {
    const navigate = useNavigate();
    const [emailId, setEmailId] = useState('');
    
    useEffect(()=>{setError("")},[emailId])

    const handleForgotPass = async (event) => {
        event.preventDefault();

        try {
            // API request to reset password
            const response = await axios.post("http://localhost:8000/reset-password", { email: emailId });
            setError('');
            setSuccess(true);
            setSuccessfulMessage("Password reset email sent successfully. Please login after resetting your password.");
            console.log("Success!");
            navigate('/login-signup');
                
        } catch (err) {
            console.error("Error resetting password: ", err);
            if (err.response && err.response.status === 404) {
                setError('This account is not registered.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="forgetpage_container">
            <div className="animation">
                <Lottie animationData={forgotPass} style={{ width: '400px' }} />
            </div>

            <div className="data">
                <div className="title">
                    <h3>Forgot Password?</h3>
                    <p>Please enter your email</p>
                </div>

                {error && <p className="error-message" style={{color:'red', fontSize:'0.9rem', paddingBottom:'5px'}}>{error}</p>}

                <form onSubmit={handleForgotPass} method='POST'>
                    <div className="emailInput">
                        <div className="inputclass">
                            <box-icon name='envelope' type='solid' color="#bbb"></box-icon>
                            <input
                                type="email"
                                placeholder="Email"
                                value={emailId}
                                name="emailId"
                                onChange={(e) => setEmailId(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="ForgotPassword">
                        RESET
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;