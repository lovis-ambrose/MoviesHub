import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {account} from "./Appwrite";
import {showToast} from "./ToastService";

const MovieList = (props) => {
    const FavoriteMovieComponent = props.favoriteMovieComponent;
    const handleNavigation = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Admin state

    const handleMovieClick = (imdbID) => {
        handleNavigation(`/movie/${imdbID}`);
    };

    // Check if user is logged in and fetch role
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get();
                if (user.$id) {
                    setIsLoggedIn(true);
                    const userRole = user.prefs.role; // Fetch role
                    if (userRole === 'admin') setIsAdmin(true);
                    else setIsAdmin(false);
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        checkUserSession();
    }, []);

    return (
        <>
            {props.movies.map((movie) => (
                <div className="image-container d-flex justify-content-start m-3" key={movie.imdbID}>
                    <img src={movie.Poster} alt={movie.Title} title="click to see Movie Details"
                         onClick={() => handleMovieClick(movie.imdbID)}/>
                    <div className="overlay d-flex align-items-center justify-content-center row">
                        <h3>{movie.Title}</h3>
                        {isLoggedIn && isAdmin && FavoriteMovieComponent && (
                            <div onClick={() => props.handleFavoritesClick(movie)} className="pointer">
                                <FavoriteMovieComponent />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </>
    );
};

export default MovieList;
