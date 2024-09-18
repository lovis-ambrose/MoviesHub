import React, { useState } from "react";
import { account, databases, ID } from "./Appwrite";
// import { ID } from "./Appwrite";

const Register = () => {
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


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         // Create user with email and password
    //         const response = await account.create(ID.unique(), user.email, user.password, user.fullName);
    //         console.log('User registered:', response);
    //         // Redirect user to login or some other page
    //     } catch (error) {
    //         console.error('Registration error:', error);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await account.create(ID.unique(), user.email, user.password, user.fullName);
            
            // Add membership details to the database
            const membershipStart = new Date().toISOString();
            const membershipEnd = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour later
    
            await databases.createDocument('66eab0820029be0edb42', '66eab609001ab4452c78', response.$id, {
                fullName: user.fullName,
                email: user.email,
                membershipStart,
                membershipEnd,
            });
    
            console.log('User registered with membership');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };
    


    return (
        <div className="register-container">
            <h2>Register new User</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;