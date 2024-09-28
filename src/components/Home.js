import React, { useEffect, useState, useCallback } from "react";
import { account, databases } from "./Appwrite";
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchMovie from './SearchField';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faSignIn } from "@fortawesome/free-solid-svg-icons";
import RemoveFavorites from "./RemoveFavorite";
import AddFavorite from "./AddFavorite";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Add admin state
    const navigate = useNavigate();

    const databaseId = process.env.REACT_APP_MOVIES_DATABASE_ID;
    const movieCollectionId = process.env.REACT_APP_MOVIE_COLLECTION_ID;

    // Fetch movies from Appwrite database
    const fetchMoviesFromDatabase = useCallback(async () => {
        try {
            const response = await databases.listDocuments(databaseId, movieCollectionId);
            setFavorites(response.documents);  // Load movies from the database into favorites
        } catch (error) {
            console.error('Error fetching movies from Appwrite:', error);
        }
    }, [databaseId, movieCollectionId]);

    // Check if user is logged in and if they're an admin when the component mounts
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get();
                if (user.$id) {
                    setIsLoggedIn(true);

                    // Assuming user role is stored in `user.prefs.role` or some field
                    if (user.prefs && user.prefs.role === 'admin') {
                        setIsAdmin(true); // Set user as admin if the role is 'admin'
                    } else {
                        setIsAdmin(false);
                    }
                }
            } catch (error) {
                console.log("User not found, not logged in");
                setIsLoggedIn(false);
                setIsAdmin(false);
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
            console.error("Error fetching movies from OMDB API:", error);
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
            console.log('Movie added to the Appwrite database');
        } catch (error) {
            console.error('Error adding movie to Appwrite database:', error);
        }
    };

    // Remove a movie from favorites and the database
    const removeFavoriteMovie = async (movie) => {
        const updatedFavorites = favorites.filter((fav) => fav.imdbID !== movie.imdbID);
        setFavorites(updatedFavorites);

        try {
            await databases.deleteDocument(databaseId, movieCollectionId, movie.$id);
            console.log('Movie removed from Appwrite database');
        } catch (error) {
            console.error('Error removing movie from Appwrite database:', error);
        }
    };

    // Handle user logout
    const handleLogout = async () => {
        try {
            await account.deleteSession('current');
            setIsLoggedIn(false);
            setIsAdmin(false);
            navigate('/');  // logout but stay on home page
        } catch (error) {
            console.error('Logout failed:', error);
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
