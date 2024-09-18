import React, { useState } from "react";
import { account, databases, ID } from "./Appwrite";
// import { ID } from "./Appwrite";

const Register = () => {
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
            // Create user with email and password
            const response = await account.create(ID.unique(), user.email, user.password, user.fullName);
            console.log('User registered:', response);
            // Redirect user to login or some other page
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await account.create(ID.unique(), user.email, user.password, user.fullName);
            
    //         // Add membership details to the database
    //         const membershipStart = new Date().toISOString();
    //         const membershipEnd = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour later
    
    //         await databases.createDocument(databaseId, userCollectionId, response.$id, {
    //             fullName: user.fullName,
    //             email: user.email,
    //             membershipStart,
    //             membershipEnd,
    //         });
    
    //         console.log('User registered with membership');
    //     } catch (error) {
    //         console.error('Registration error:', error);
    //     }
    // };
    


    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div class="text-start border rounded p-3 w-25">
                <h2>Register new User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="fform-group mt-2">
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
                    <div className="fform-group mt-2">
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
                    <div className="fform-group mt-2">
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
                    <button type="submit" className="btn btn-primary mt-2 w-100">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;