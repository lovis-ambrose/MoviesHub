import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { account } from './Appwrite';

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get();
                if (user.$id) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log("User not found, redirecting to login.");
                setIsLoggedIn(false);
            }
        };

        checkUserSession();
    }, []);

    if (isLoggedIn === null) {
        return <div>Loading...</div>; // Show a loading state while checking session
    }

    return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
