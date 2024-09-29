import React, { useState } from 'react';
import { account } from './Appwrite';
import {Link} from "react-router-dom";
import {showToast} from "./ToastService";
import {ScaleLoader} from "react-spinners";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const resetUrl = process.env.REACT_APP_PASSWORD_RESET_URL;
    // const resetUrlHosted = process.env.REACT_APP_PASSWORD_RESET_URL_HOSTED;

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await account.createRecovery(email, resetUrl);
            showToast("Password recovery email sent. Check your email to reset password", "success");
        } catch (error) {
            showToast("Error in password recovery", "error");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div class="container d-flex justify-content-center align-items-center vh-100">
            <div class="text-start border rounded p-3 w-100 w-md-75 custom-width-lg-45">
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
                    <button type="submit" class="btn btn-primary mt-2 w-100" disabled={loading}>
                        {loading ? (
                            <ScaleLoader color="#ffffff" height={20} />
                        ) : (
                            "Send Recovery Email"
                        )}
                    </button>

                    <div className="text-end mt-2">
                        <Link to="/login" className="text-decoration-none">Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default ForgotPassword;
