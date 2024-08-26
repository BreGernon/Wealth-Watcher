import React, { useState } from "react"; // Importing React and useState hook
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Importing function to create a new user with Firebase Authentication
import { auth, db } from "../utils/firebase"; // Importing the Firebase authentication instance from your configuration
import { doc, setDoc } from "firebase/firestore";



const Signup = () => {
    // State variables to manage email, password, and potential error messages
    const [email, setEmail] = useState(""); // For storing the email input
    const [password, setPassword] = useState(""); // For storing the password input
    const [error, setError] = useState(null); // For storing any error messages during signup

    // Function to handle the signup process
    const handleSignup = async (e) => {
        e.preventDefault(); //Prevent default form submission behavior
        setError(null); // Reset any previous error messages

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(auth.currentUser, {displayName: "Default Username" });

            await setDoc(doc( db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
                createdAt: new Date(),
                budgets: [],
                expenses: [],
                goals: [],
                reports: [],
                settings: []
            });
            

            alert("User signed up successfully and data stored in Firestore!");

            //Clear input fields.
            setEmail("");
            setPassword("");

        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered. Please use a different email or log in.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters long.");
            } else {
                // Set an error message if signup fails
                setError("Failed to sign up. Please try again.");
            }
            console.error("Signup error:", err);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                {/* Email input field */}
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {/* Password input field */}
                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {/* Signup button */}
                <button type="submit">Signup</button>
                {/* Display error message if present */}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Signup; // Exporting the Signup component for use in other parts of the application
