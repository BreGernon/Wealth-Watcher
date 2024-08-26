import React from 'react'; // Import React library
import ReactDOM from 'react-dom'; // Import ReactDOM for rendering components to the DOM
import './index.css'; // Import global CSS styles
import App from './App'; // Import the main App component
import reportWebVitals from './reportWebVitals'; // Import web vitals for performance measurement
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider to manage authentication state
import { ThemeProvider } from './contexts/ThemeContext';

// Render the React application
ReactDOM.render(
  <ThemeProvider>
    <React.StrictMode>
      {/* AuthProvider component provides authentication context to the entire app */}
      <AuthProvider>
        <App /> {/* Main application component */}
      </AuthProvider>
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root') // Target DOM element where the app will be rendered

);

// Optional: Measure performance and log results or send to an analytics endpoint
// You can use the function to measure performance by passing a callback
// e.g., reportWebVitals(console.log)
reportWebVitals();
