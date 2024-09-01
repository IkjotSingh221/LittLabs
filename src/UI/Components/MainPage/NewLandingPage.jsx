import React from 'react';
import "./NewLandingPage.css";
import Lottie from 'lottie-react';
import landingggg from '../../Assets/land.json';
import litLabDay from '../../Assets/Lit Lab Day.png';
import mobile from '../../Assets/iPhone.json';


export const newLandingPage = () => {
    return (
        <div className="landingpage">
            <div className="navigBar">
                <div className="logo">
                    <img src={litLabDay} alt="Logo" />
                    <p>LittLabs</p>
                </div>
                <div className="auth-buttons">
                    <a href="/login-signup" className="signup-button">Login/SignUp
                    </a>

                </div>
            </div>
            <div className="mainBox">
                <div className='heading'>
                    <h3>Your All-in-One Student Success Platform</h3>
                </div>
                <div className="descriptive_para">
                    <p>Now you can manage your school, college, or any educational center with Litt Labs. It's 100% free for lifetime with no limitations.</p>
                </div>
                <div className="see_how_it_works">
                    <a href="#">See How it Works</a>
                </div>
                <div className="photos_data"> 
                    <Lottie animationData={landingggg} className="lottie-container" />
                </div>

                <div className="Feature_Section">
                    <div className="features-heading">
                        <h2>Features of LittLabs</h2>
                        <p>We offer a comprehensive suite of features to help you manage your educational institution effectively. Explore our key features below:</p>
                    </div>
                </div>
                {/* Features Section */}
                <div className="features-section">
                    <div className="container">
                        {/* Left Features */}
                        <div className="features-column">
                            <div className="feature">
                                <div className="feature-icon">
                                    <box-icon type='solid' name='award'></box-icon>
                                </div>
                                <h3>Solve</h3>
                                <p>Get instant support through our vibrant community and innovative SnapSolver. Tackle complex problems with ease and collaborative learning.
                                </p>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">
                                    <box-icon type='solid' name='cloud-upload'></box-icon>
                                </div>
                                <h3>Organize</h3>
                                <p> Streamline your academic life with smart todo lists,notes and intuitive calendars. Stay on top of your tasks and never miss a deadline with our smart deadline manager.
                                </p>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">
                                    <box-icon type='solid' name='sync'></box-icon>
                                </div>
                                <h3>Professionalize</h3>
                                <p>Prepare for your future career with expert interview prep tools and AI-powered resume scoring. Stand out in the job market with confidence.
                                </p>
                            </div>
                        </div>
                        {/* Center Mobile Image */}
                        <div className="mobile-image">
                            <Lottie animationData={mobile} className="lottie-container" />
                        </div>
                        {/* Right Features */}
                        <div className="features-column">
                            <div className="feature">
                                <div className="feature-icon">
                                    <box-icon type='solid' name='mobile-alt'></box-icon>
                                </div>
                                <h3>Learn</h3>
                                <p>Enhance your study efficiency using AI-driven summarizers and interactive flashcards. Master your subjects faster and more effectively.
                                </p>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">
                                    <box-icon type='solid' name='chart-bar-alt-2'></box-icon>
                                </div>
                                <h3>Plan</h3>
                                <p>Chart your path to success with personalized roadmaps. Set and achieve your academic and career goals with tailored guidance.</p>
                            </div>
                            <div className="feature">
                                <div className="feature-icon">
                                    <box-icon type='solid' name='lock-alt'></box-icon>
                                </div>
                                <h3>Discover</h3>
                                <p>Get personalized course recommendations that align with your interests and goals. Enhance your skills with the right courses and stay on track for success..</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default newLandingPage;

