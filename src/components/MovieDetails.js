import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MovieListHeading from "./MovieListHeading";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignIn, faSignOut} from "@fortawesome/free-solid-svg-icons";
import {account} from "./Appwrite";
import {showToast} from "./ToastService";
import {LoaderBounce} from "./Loader";

const MovieDetails = () => {
    const { imdbID } = useParams();
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const handleNavigation = useNavigate();
    const databaseId = process.env.REACT_APP_MOVIES_DATABASE_ID;
    const movieCollectionId = process.env.REACT_APP_MOVIE_COLLECTION_ID;
    const apiUrl = process.env.REACT_APP_OMDB_API_URL;
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;

    // Check if user is logged in when the component mounts
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get();
                if (user.$id) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                showToast("User not found", "error");
                setIsLoggedIn(false);
            }
        };
        checkUserSession();
    }, []);

    // Fetch movie details
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${apiUrl}?i=${imdbID}&apikey=${apiKey}`);
                const data = await response.json();
                setMovieDetails(data);
            } catch (error) {
                showToast("Error fetching movie details", "error");
            }
            finally {
                setLoading(false);
            }
        };
        fetchMovieDetails();
    }, [imdbID, apiKey, apiUrl, databaseId, movieCollectionId]);

    // Handle logout functionality
    const handleLogout = async () => {
        try {
            await account.deleteSession('current'); // Log out the user
            setIsLoggedIn(false);
            handleNavigation('/login'); // Redirect to login page
        } catch (error) {
            showToast("Logout failed", "error");
        }
    };

    // Handle login redirect
    const handleLoginRedirect = () => {
        handleNavigation('/login'); // Redirect to the login page
    };

    if (loading) {
        return <LoaderBounce />; // Show loader while data is being fetched
    }

    if (!movieDetails) {
        return <div>No movie details found.</div>
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4 sticky-top">
                <MovieListHeading heading="Home" />
                <MovieListHeading heading="Movie Details" />
                {isLoggedIn ? (
                    <button className="btn btn-link" onClick={handleLogout} title="Logout">
                        <FontAwesomeIcon icon={faSignOut} size="2x" />
                    </button>
                ) : (
                    <button className="btn btn-link" onClick={handleLoginRedirect} title="Login">
                        <FontAwesomeIcon icon={faSignIn} size="2x" />
                    </button>
                )}
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-4 mb-3">
                        <img src={movieDetails.Poster} alt={movieDetails.Title} className="img-fluid" />
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
