import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MovieListHeading from "./MovieListHeading";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOut} from "@fortawesome/free-solid-svg-icons/faSignOut";
import {faSignIn} from "@fortawesome/free-solid-svg-icons/faSignIn";
import {account} from "./Appwrite";


const MovieDetails = () => {
    const { imdbID } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleNavigation = useNavigate();
    const apiKey = "7b34463d";


    // Check if user is logged in when the component mounts
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get(); // Check if user session exists
                if (user.$id) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log("user not found");
                setIsLoggedIn(false);
            }
        };
        checkUserSession();
    }, []);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
                const data = await response.json();
                setMovieDetails(data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        fetchMovieDetails();
    }, [imdbID]);

    if (!movieDetails) {
        return <div>Loading...</div>;
    }

    // Handle logout functionality
    const handleLogout = async () => {
        try {
            await account.deleteSession('current'); // Log out the user
            setIsLoggedIn(false);
            handleNavigation('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Handle login redirect
    const handleLoginRedirect = () => {
        handleNavigation('/login'); // Redirect to the login page
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4 sticky-top">
                <MovieListHeading heading="Home" />
                <MovieListHeading heading="Movie Details"/>
                {isLoggedIn ? (
                    <button className="btn btn-link" onClick={handleLogout} title="Logout">
                        <FontAwesomeIcon icon={faSignOut} size="2x"/>
                    </button>
                ) : (
                    <button className="btn btn-link" onClick={handleLoginRedirect} title="Login">
                        <FontAwesomeIcon icon={faSignIn} size="2x"/>
                    </button>
                )}
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <img src={movieDetails.Poster} alt={movieDetails.Title} className="img-fluid"/>
                    </div>
                    <div className="col-12 col-md-8">
                        <h2>{movieDetails.Title}</h2>
                        <div className="row">
                            <div className="col">
                                <p><strong>Year:</strong> {movieDetails.Year}</p>
                                <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                                <p><strong>Type:</strong> {movieDetails.Type}</p>
                                <p><strong>Rated:</strong> {movieDetails.Rated}</p>
                                <p><strong>Run Time:</strong> {movieDetails.Runtime}</p>
                            </div>
                            <div className="col">
                                <p><strong>Director:</strong> {movieDetails.Director}</p>
                                <p><strong>Writer:</strong> {movieDetails.Writer}</p>
                                <p><strong>Language:</strong> {movieDetails.Language}</p>
                                <p><strong>Country:</strong> {movieDetails.Country}</p>
                                <p><strong>Ratings:</strong> {movieDetails.imdbRating}</p>
                            </div>
                        </div>
                        <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                        <p><strong>BoxOffice:</strong> {movieDetails.BoxOffice}</p>
                        <p><strong>Awards:</strong> {movieDetails.Awards}</p>
                        <p><strong>Plot:</strong> {movieDetails.Plot}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
