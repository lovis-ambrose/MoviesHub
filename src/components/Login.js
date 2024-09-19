import React, { useState } from 'react';
import { account } from './Appwrite';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const handleNavigation = useNavigate(); // Initialize the useNavigate hook for redirect

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
            const session = await account.createEmailPasswordSession(credentials.email, credentials.password);
            console.log('User logged in:', session);
            // Redirect user to home
            handleNavigation("/home")
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div class="text-start border rounded p-3 w-25">
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
                    <button type="submit" className="btn btn-primary mt-2 w-100">Login</button>
                    <div className="d-flex flex-row justify-content-between mt-2 w-100">
                        <p>Don't have an account?</p>
                        <Link to="/register" className="text-decoration-none">Register</Link>
                    </div>
                    <div className='text-end'>
                        <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
