import React, { useState } from 'react';
import { account } from './Appwrite';
import { Link, useNavigate } from 'react-router-dom';
import {showToast} from "./ToastService";
import {ScaleLoader} from "react-spinners";


const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // Initialize the useNavigate hook for redirection

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Login user with email and password
            setLoading(true);
            const session = await account.createEmailPasswordSession(credentials.email, credentials.password);
            console.log('User logged in:', session);
            showToast("login successful", "success");

            // Retrieve the redirect path from localStorage (if any)
            const redirectTo = localStorage.getItem("redirectAfterLogin") || '/';
            localStorage.removeItem("redirectAfterLogin"); // Clean up the stored path

            // Redirect user to the original page or home page
            navigate(redirectTo);
        } catch (error) {
            showToast("error logging in. Check credentials and try again.", "error");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-start border rounded p-3 w-25">
                <h2 className='text-center'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group mt-2">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
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
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 w-100" disabled={loading}>
                        {loading ? (
                            <ScaleLoader color="#ffffff" height={20} />
                        ) : (
                            "Login"
                        )}
                    </button>
                    <div className="d-flex flex-row justify-content-between mt-2 w-100">
                        <p>Don't have an account?</p>
                        <Link to="/register" className="text-decoration-none">Register</Link>
                    </div>
                    <div className='d-flex flex-row justify-content-between mt-2 w-100'>
                        <Link to="/" className="text-decoration-none">Continue as guest</Link>
                        <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;