import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { account } from './Appwrite';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    
    // Extract token and userId from URL parameters
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');
    const secret = queryParams.get('secret');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            // Complete the password reset process
            await account.updateRecovery(userId, secret, password, confirmPassword);
            console.log('Password reset successfully');
            // Optionally, redirect user to the login page
            navigate('/login');
        } catch (error) {
            console.error('Error resetting password:', error);
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-start border rounded p-3 w-25">
                <h2 className='text-center'>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control text-start"
                        />
                    </div>
                    <div className="form-group mt-2">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-control text-start"
                        />
                    </div>
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                    <button type="submit" className="btn btn-primary mt-2 w-100">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
