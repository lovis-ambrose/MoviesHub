import React, { useState } from 'react';
import { account } from './Appwrite';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const resetUrl = process.env.REACT_APP_PASSWORD_RESET_URL;

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send password recovery email
            await account.createRecovery(email, resetUrl);
            console.log('Password recovery email sent');
            // Optionally show success message to the user
        } catch (error) {
            console.error('Error in password recovery:', error);
        }
    };

    return (
        <div class="d-flex justify-content-center align-items-center vh-100">
            <div class="text-start border rounded p-3 w-25">
                <h2 className='text-center'>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div class="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleChange}
                            required
                            class="form-control text-start"
                        />
                    </div>
                    <button type="submit" class="btn btn-primary mt-2 w-100">Send Recovery Email</button>
                </form>
            </div>
        </div>

    );
};

export default ForgotPassword;
