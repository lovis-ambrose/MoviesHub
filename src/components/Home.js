import React, { useEffect, useState, useCallback } from "react";
import { account, databases } from "./Appwrite";
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchMovie from './SearchField';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faSignIn, faBell, faBellSlash } from "@fortawesome/free-solid-svg-icons";
import RemoveFavorites from "./RemoveFavorite";
import AddFavorite from "./AddFavorite";
import {showToast} from "./ToastService";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Add admin state
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate();

    const databaseId = process.env.REACT_APP_MOVIES_DATABASE_ID;
    const movieCollectionId = process.env.REACT_APP_MOVIE_COLLECTION_ID;
    const userCollectionId = process.env.REACT_APP_USER_COLLECTION_ID;

    // Fetch movies from Appwrite database
    const fetchMoviesFromDatabase = useCallback(async () => {
        try {
            const response = await databases.listDocuments(databaseId, movieCollectionId);
            setFavorites(response.documents);  // Load movies from the database into favorites
        } catch (error) {
            showToast("Error fetching movies from the database", "error");
        }
    }, [databaseId, movieCollectionId]);

    // Check if user is logged in and if they're an admin when the component mounts
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get();
                if (user.$id) {
                    setIsLoggedIn(true);
                    setIsAdmin(user.prefs?.role === 'admin');
                    setIsSubscribed(user.prefs?.isSubscribed || false);
                }
            } catch (error) {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setIsSubscribed(false);
            }
        };
        checkUserSession();
    }, []);

    // Fetch movies from OMDB API based on search value
    const getMovieRequest = useCallback(async (searchValue) => {
        if (!searchValue) return;

        const apiUrl = `${process.env.REACT_APP_OMDB_API_URL}?s=${searchValue}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.Search) {
                // Exclude movies already in favorites from search results
                const filteredMovies = data.Search.filter(
                    (movie) => !favorites.some((fav) => fav.imdbID === movie.imdbID)
                );
                setMovies(filteredMovies);
            }
        } catch (error) {
            showToast("Error fetching movies from the API", "error");
        }
    }, [favorites]);

    useEffect(() => {
        getMovieRequest(searchValue);
    }, [searchValue, getMovieRequest]);

    useEffect(() => {
        fetchMoviesFromDatabase();  // Load favorite movies from database on component mount
    }, [fetchMoviesFromDatabase]);

    // Add a movie to the favorites and the database
    const addFavoriteMovie = async (movie) => {
        const updatedFavorites = [...favorites, movie];
        setFavorites(updatedFavorites);

        try {
            await databases.createDocument(databaseId, movieCollectionId, 'unique()', {
                Title: movie.Title,
                Year: movie.Year,
                Type: movie.Type,
                Poster: movie.Poster,
                imdbID: movie.imdbID,
            });
            showToast("Movie saved successfully", "success");
        } catch (error) {
            showToast("An error occurred. Failed to save movie", "error");
        }
    };

    // Remove a movie from favorites and the database
    const removeFavoriteMovie = async (movie) => {
        const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
        setFavorites(updatedFavorites);

        try {
            await databases.deleteDocument(databaseId, movieCollectionId, movie.$id);
            showToast("Movie successfully deleted", "success");
        } catch (error) {
            showToast("An error occurred. Movie not deleted.", "error");
        }
    };

    // Handle subscription status
    const handleSubscriptionToggle = async () => {
        try {
            const updatedSubscription = !isSubscribed;
            await account.updatePrefs({ isSubscribed: updatedSubscription });
            setIsSubscribed(updatedSubscription);
            showToast(`Successfully ${updatedSubscription ? 'subscribed' : 'unsubscribed'}`, "success");
        } catch (error) {
            showToast("An error occurred. Subscription status not updated.", "error");
        }
    };

    // periodically fetch the user's subscription status from the database and update the state
    useEffect(() => {
        const interval = setInterval(async () => {
            if (isLoggedIn) {
                try {
                    const user = await account.get();
                    if (user.$id) {
                        const userDocument = await databases.getDocument(databaseId, userCollectionId, user.$id);
                        const { membershipEnd, isSubscribed } = userDocument;

                        const currentTime = new Date().toISOString();
                        if (currentTime >= membershipEnd && isSubscribed) {
                            // Update subscription status to false in the database if it has expired
                            await databases.updateDocument(databaseId, userCollectionId, user.$id, {
                                isSubscribed: false,
                            });
                            setIsSubscribed(false); // Update local state
                            showToast("Membership has expired", "warning");
                        } else {
                            setIsSubscribed(isSubscribed); // Keep the state in sync
                        }
                    }
                } catch (error) {
                    // showToast("Error checking subscription status", "error");
                }
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [isLoggedIn, databaseId, userCollectionId]);

    // Handle user logout
    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            setIsLoggedIn(false);
            setIsAdmin(false);
            showToast("Logout successful", "success");
            navigate('/');  // logout but stay on home page
        } catch (error) {
            showToast("Logout failed", "error");
        }
    };

    // Redirect to login page
    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className='container-fluid'>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4 sticky-top">
                <MovieListHeading heading="Movies" />
                <SearchMovie searchValue={searchValue} setSearchValue={setSearchValue} />

                {isLoggedIn && (
                    <button className="btn btn-link" onClick={handleSubscriptionToggle} title={isSubscribed ? "Unsubscribe" : "Subscribe"}>
                        <FontAwesomeIcon icon={isSubscribed ? faBell : faBellSlash} size="2x" />
                    </button>
                )}

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

            {/* Movie Search Results with "Add to Favorites" */}
            <div className='d-flex flex-row' style={{ overflowY: 'auto' }}>
                <MovieList
                    movies={movies}
                    handleFavoritesClick={addFavoriteMovie}
                    favoriteMovieComponent={isAdmin ? AddFavorite : null}  // Only show add button if user is admin
                />
            </div>

            <div className='d-flex flex-row align-items-center mt-4 mb-4 sticky-top'>
                <MovieListHeading heading="Favorites" />
            </div>

            {/* Favorite Movies with "Remove from Favorites" */}
            <div className='d-flex flex-row' style={{ overflowY: 'auto' }}>
                <MovieList
                    movies={favorites}
                    handleFavoritesClick={removeFavoriteMovie}
                    favoriteMovieComponent={isAdmin ? RemoveFavorites : null}  // Only show remove button if user is admin
                />
            </div>
        </div>
    );
};

export default Home;
