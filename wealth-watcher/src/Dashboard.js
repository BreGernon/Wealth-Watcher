import React from 'react';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';

const [overviewData, setOverviewData] = useState({});
const [chartData, setChartData] = useState([]);

const handleSignOut = () => {
    signOut(auth).then(() => {
        alert('Signed out successfully!');
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
};

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    if (!user) {
        return <p>You need to log in to access the dashboard.</p>;
    }

    return (
        <div className="dashboard-container">
            <header>
            </header>
            <main>
                <div>
                    <h2>Welcome to the Dashboard, {user.email}!</h2>
                </div>
                <section className="overview">
                    <h2>Account Balance: $1500</h2>
                </section>
                <section className = "charts">
                </section>
                <aside className="sidebar">
                    {/*Widgets*/}
                </aside>
            </main>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    );
};

export default Dashboard;