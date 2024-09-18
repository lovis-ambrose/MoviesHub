import React, { useState } from 'react';
import { account } from './Appwrite';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send password recovery email
            await account.createRecovery(email, 'http://localhost:3000/reset-password');
            console.log('Password recovery email sent');
            // Optionally show success message to the user
        } catch (error) {
            console.error('Error in password recovery:', error);
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Recovery Email</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
