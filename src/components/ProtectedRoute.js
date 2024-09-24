import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { account } from './Appwrite';

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const location = useLocation(); // Get current location (path)
    const currentPath = location.pathname; // Save the path user is trying to access

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get();
                if (user.$id) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log("User not found, displaying alert.");
                setIsLoggedIn(false);
                setShowAlert(true); // Show the alert when the user is not logged in
                // Store the current path in local storage to return after login
                localStorage.setItem("redirectAfterLogin", currentPath);
            }
        };

        checkUserSession();
    }, [currentPath]);

    const handleAlertDismiss = () => {
        setShowAlert(false);  // Hide the alert
        setIsLoggedIn(false); // Continue to login
    };

    if (isLoggedIn === null) {
        return <div>Loading...</div>; // Show a loading state while checking session
    }

    if (showAlert) {
        return (
            <div className="alert-container">
                <div className="alert alert-warning" role="alert">
                    You need to log in to access this page. Please log in to continue.
                    <button onClick={handleAlertDismiss} className="btn btn-primary ml-3">
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;