import React, { useEffect, useState, useCallback } from "react";
import { account, databases } from "./Appwrite";
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchMovie from './SearchField';
import AddFavorite from './AddFavorite';
import RemoveFavorites from './RemoveFavorite';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import { faSignIn } from "@fortawesome/free-solid-svg-icons/faSignIn";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleNavigation = useNavigate();

    const databaseId = process.env.REACT_APP_MOVIES_DATABASE_ID;
    const movieCollectionId = process.env.REACT_APP_MOVIE_COLLECTION_ID;

    // Fetch movies from Appwrite database
    const fetchMoviesFromDatabase = useCallback(async () => {
        try {
            const response = await databases.listDocuments(databaseId, movieCollectionId);
            const movieDocs = response.documents;
            setFavorites(movieDocs);  // Update state with movies from database
        } catch (error) {
            console.error('Error fetching movies from Appwrite', error);
        }
    }, [databaseId, movieCollectionId]);

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

    // Fetch movies from OMDB API based on search value
    const getMovieRequest = useCallback(async (searchValue) => {
        const apiUrl = `${process.env.REACT_APP_OMDB_API_URL}?s=${searchValue}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`;
        const response = await fetch(apiUrl);
        const responseJson = await response.json();

        if (responseJson.Search) {
            // Filter search results to exclude already saved favorites
            const searchResults = responseJson.Search.filter(
                (movie) => !favorites.some((fav) => fav.imdbID === movie.imdbID)
            );
            setMovies(searchResults);  // Update state with search results
        }
    }, [favorites]);

    // Fetch movies when search value changes
    useEffect(() => {
        if (searchValue) {
            getMovieRequest(searchValue);
        }
    }, [searchValue, favorites, getMovieRequest]);

    // Fetch favorite movies from the Appwrite database on load
    useEffect(() => {
        fetchMoviesFromDatabase();  // Load favorite movies from Appwrite
    }, [fetchMoviesFromDatabase]);

    const addFavoriteMovie = async (movie) => {
        const newFavoriteList = [...favorites, movie];
        setFavorites(newFavoriteList);  // Update favorites state

        // Save movie to Appwrite database
        try {
            await databases.createDocument(databaseId, movieCollectionId, 'unique()', {
                Title: movie.Title,
                Year: movie.Year,
                Type: movie.Type,
                Poster: movie.Poster,
                imdbID: movie.imdbID,
            });
            console.log('Movie added to Appwrite database');
        } catch (error) {
            console.error('Error adding movie to Appwrite database', error);
        }
    };

    const removeFavoriteMovie = async (movie) => {
        const newFavoriteList = favorites.filter((favoriteMovie) => favoriteMovie.imdbID !== movie.imdbID);
        setFavorites(newFavoriteList);  // Update favorites state

        // Remove movie from Appwrite database
        try {
            const movieDocId = movie.$id; // Use the document ID from the database
            await databases.deleteDocument(databaseId, movieCollectionId, movieDocId);
            console.log('Movie removed from Appwrite database');
        } catch (error) {
            console.error('Error removing movie from Appwrite database', error);
        }
    };

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
        <div className='container-fluid'>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4 sticky-top">
                <MovieListHeading heading="Movies"/>
                <SearchMovie searchValue={searchValue} setSearchValue={setSearchValue}/>
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

            {/* Movie Search Results with "Add to Favorites" */}
            <div className='d-flex flex-row' style={{ overflowY: 'auto' }}>
                <MovieList movies={movies} handleFavoritesClick={addFavoriteMovie} favoriteMovieComponent={AddFavorite} />
            </div>

            <div className='d-flex flex-row align-items-center mt-4 mb-4 sticky-top'>
                <MovieListHeading heading="Favorites"/>
            </div>

            {/* Favorite Movies with "Remove from Favorites" */}
            <div className='d-flex flex-row' style={{ overflowY: 'auto' }}>
                <MovieList movies={favorites} handleFavoritesClick={removeFavoriteMovie} favoriteMovieComponent={RemoveFavorites} />
            </div>
        </div>
    );
};

export default Home;
