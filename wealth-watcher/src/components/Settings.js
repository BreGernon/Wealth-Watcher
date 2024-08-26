import React, { useState } from 'react';
import Header from './Header';
import '../styles/Settings.css';

const Settings = () => {
    const [profile, setProfile] = useState({ username: '', email: '' });
    const [notifications, setNotifications] = useState({ email: false, app: false });
    const [displayPreferences, setDisplayPreferences] = useState({ theme: 'light', currency: 'USD', language: 'English' });
    const [security, setSecurity] = useState({ twoFactor: false });
    const [dataManagement, setDataManagement] = useState({ backup: false, export: false });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleNotificationsChange = (e) => {
        const { name, checked } = e.target;
        setNotifications({ ...notifications, [name]: checked });
    };

    const handleDisplayPreferencesChange = (e) => {
        const { name, value } = e.target;
        setDisplayPreferences({ ...displayPreferences, [name]: value });
    };

    const handleSecurityChange = (e) => {
        const { name, checked } = e.target;
        setSecurity({ ...security, [name]: checked });
    };

    const handleDataManagementChange = (e) => {
        const { name, checked } = e.target;
        setDataManagement({ ...dataManagement, [name]: checked });
    };

    return (
        <div>
            <Header />
            <h2>Settings</h2>

            <div className="settings-section">
                <h3>Notifications</h3>
                <label>
                    Email Notifications:
                    <input type="checkbox" name="email" checked={notifications.email} onChange={handleNotificationsChange} />
                </label>
                <label>
                    App Notifications:
                    <input type="checkbox" name="app" checked={notifications.app} onChange={handleNotificationsChange} />
                </label>
            </div>

            <div className="settings-section">
                <h3>Display Preferences</h3>
                <label>
                    Theme:
                    <select name="theme" value={displayPreferences.theme} onChange={handleDisplayPreferencesChange}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </label>
                <label>
                    Currency:
                    <select name="currency" value={displayPreferences.currency} onChange={handleDisplayPreferencesChange}>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        {/* Add more currencies as needed */}
                    </select>
                </label>
                <label>
                    Language:
                    <select name="language" value={displayPreferences.language} onChange={handleDisplayPreferencesChange}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        {/* Add more languages as needed */}
                    </select>
                </label>
            </div>

            <div className="settings-section">
                <h3>Security Settings</h3>
                <label>
                    Two-Factor Authentication:
                    <input type="checkbox" name="twoFactor" checked={security.twoFactor} onChange={handleSecurityChange} />
                </label>
            </div>

            <div className="settings-section">
                <h3>Data Management</h3>
                <label>
                    Backup Data:
                    <input type="checkbox" name="backup" checked={dataManagement.backup} onChange={handleDataManagementChange} />
                </label>
                <label>
                    Export Data:
                    <input type="checkbox" name="export" checked={dataManagement.export} onChange={handleDataManagementChange} />
                </label>
            </div>
        </div>
    );
};

export default Settings;
