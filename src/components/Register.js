import React, {useEffect, useState} from "react";
import { account, databases, ID } from "./Appwrite";
import {Link, useNavigate} from "react-router-dom";
import {showToast} from "./ToastService";
import {ScaleLoader} from "react-spinners";

const Register = () => {
    const handleNavigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const databaseId = process.env.REACT_APP_MOVIES_DATABASE_ID;
    const userCollectionId = process.env.REACT_APP_USER_COLLECTION_ID;

    const [user, setUser] = useState({
        fullName: '',
        email: '',
        password: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Create user
            const response = await account.create(ID.unique(), user.email, user.password, user.fullName);

            // Log the user in after registration
            await account.createEmailPasswordSession(user.email, user.password);

            // Set membership start and end times (2 minutes for testing)
            const membershipStart = new Date().toISOString();
            const membershipEnd = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 minutes later

            // Add membership details to the database
            await databases.createDocument(databaseId, userCollectionId, response.$id, {
                fullName: user.fullName,
                email: user.email,
                password: user.password,
                membershipStart,
                membershipEnd,
                isSubscribed: true // Initially set as subscribed
            });

            // Redirect to home page
            handleNavigation("/");
            showToast("User registered and logged in, membership created", "success");
        } catch (error) {
            showToast("Registration error", "error");
        } finally {
            setLoading(false);
        }
    };

    // Function to periodically check subscription status
    const checkSubscriptionStatus = async () => {
        try {
            // Get the current user
            const user = await account.get();
            if (user.$id) {
                const userId = user.$id;

                // Fetch the user's membership details from the database
                const userDocument = await databases.getDocument(databaseId, userCollectionId, userId);
                const { membershipEnd } = userDocument;

                // Check if the membership has expired
                const currentTime = new Date().toISOString();
                if (currentTime >= membershipEnd) {
                    // Update subscription status to false
                    await databases.updateDocument(databaseId, userCollectionId, userId, {
                        isSubscribed: false,
                    });
                    showToast("Membership has expired", "warning");
                }
            }
        } catch (error) {
            // showToast("Error checking subscription status", "error");
        }
    };

    // Call checkSubscriptionStatus every 30 seconds
    useEffect(() => {
        const interval = setInterval(checkSubscriptionStatus, 10000);
        return () => clearInterval(interval);
    }, []);
    
    


    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div class="text-start border rounded p-3 w-100 w-md-75 custom-width-lg-45">
                <h2 className="text-center">Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-2">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={user.fullName}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 w-100" disabled={loading}>
                        {loading ? (
                            <ScaleLoader color="#ffffff" height={20} />
                        ) : (
                            "Register"
                        )}
                    </button>
                    <div className="d-flex flex-row justify-content-between mt-2 w-100">
                        <p>Already have an account?</p>
                        <Link to="/login" className="text-decoration-none">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;