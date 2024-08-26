import React from 'react';
import Header from './Header';
import '../styles/About.css';

const About = () => {
    return (
        <div className="about-page">
            <Header />
            <div className="about-content">
                <h2>About Wealth Watcher</h2>
                <p>Welcome to Wealth Watcher, your go-to solution for managing and tracking your finances effortlessly. Our goal is to provide a comprehensive and user-friendly platform that helps you take control of your financial health and achieve your financial goals.</p>
                <h3>Our Mission</h3>
                <p>At Wealth Watcher, we are committed to empowering individuals with the tools they need to make informed financial decisions. Whether you’re looking to track your expenses, set budgets, or analyze your spending patterns, our platform offers a suite of features designed to meet your needs.</p>
                <h3>Features</h3>
                <ul>
                    <li>Track and categorize your expenses</li>
                    <li>Set and manage budgets</li>
                    <li>Monitor progress toward your financial goals</li>
                    <li>Generate detailed financial reports</li>
                </ul>
                <h3>Our Team</h3>
                <p>Our dedicated team is made up of one college student about to graduate and who used to struggle with money!</p>
        
            </div>
        </div>
    );
};

export default About;
