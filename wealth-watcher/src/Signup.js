import React, { useState } from "react";
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert('User signed up successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSignUp}>
            <h2>Sign Up</h2>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Sign Up</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Signup;