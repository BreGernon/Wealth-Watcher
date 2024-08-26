import React from 'react';
import Header from './Header';
import '../styles/HelpCenter.css';

const HelpCenter = () => {
    return (
        <div className="help-center">
            <Header />
            <h2>Help Center</h2>
            <div className="help-center-content">
                <div className="faq-section">
                    <h3>Frequently Asked Questions</h3>
                    <div className="faq-item">
                        <h4>How do I reset my password?</h4>
                        <p>To reset your password, go to the login page and click on "Forgot Password". Follow the instructions sent to your email to reset your password.</p>
                    </div>
                    <div className="faq-item">
                        <h4>How can I update my profile information?</h4>
                        <p>You can update your profile information by going to the "Account" page and modifying your details under the "Profile" section.</p>
                    </div>
                    <div className="faq-item">
                        <h4>Where can I view my financial reports?</h4>
                        <p>Your financial reports can be viewed under the "Reports" section on your dashboard. You can generate and download reports from there.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
