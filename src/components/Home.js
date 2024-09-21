import React, { useEffect, useState } from "react";
import { account, databases } from "./Appwrite";
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchMovie from './SearchField';
import AddFavorite from './AddFavorite';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RemoveFavorites from "./RemoveFavorite";
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
    const fetchMoviesFromDatabase = async () => {
        try {
            const response = await databases.listDocuments("66eab0820029be0edb42", "66eab10c0029c603f351",);
            const movieDocs = response.documents;
            setMovies(movieDocs);  // Update state with movies from database
        } catch (error) {
            console.error('Error fetching movies from Appwrite', error);
        }
    };

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
    const getMovieRequest = async (searchValue) => {
        const apiUrl = `http://www.omdbapi.com/?s=${searchValue}&apikey=7b34463d`;
        const response = await fetch(apiUrl);
        const responseJson = await response.json();

        if (responseJson.Search) {
            setMovies(responseJson.Search);  // Update state with search results
        }
    };

    // Fetch movies when search value changes
    useEffect(() => {
        getMovieRequest(searchValue);
    }, [searchValue]);

    // Fetch favorite movies from the Appwrite database on load
    useEffect(() => {
        fetchMoviesFromDatabase();  // Load favorite movies from Appwrite
    }, []);

    const addFavoriteMovie = async (movie) => {
        const newFavoriteList = [...favorites, movie];
        setFavorites(newFavoriteList);  // Update favorites state

        // Save movie to Appwrite database
        try {
            await databases.createDocument("66eab0820029be0edb42", "66eab10c0029c603f351", 'unique()', {
                Title: movie.Title,
                Year: movie.Year,
                Type: movie.Type,
                Poster: movie.Poster,
                imdbID: movie.imdbID,
                Genre: movie.Genre || "N/A",
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
            await databases.deleteDocument("66eab0820029be0edb42", "66eab10c0029c603f351", movieDocId);
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
                {/* Conditionally show login or logout button */}
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

            <div className='d-flex flex-row' style={{ overflowY: 'auto' }}>
                <MovieList movies={movies} handleFavoritesClick={removeFavoriteMovie} favoriteMovie={RemoveFavorites}/>
            </div>

            <div className='d-flex flex-row align-items-center mt-4 mb-4 sticky-top'>
                <MovieListHeading heading="Favorites"/>
            </div>

            <div className='d-flex flex-row' style={{ overflowY: 'auto' }}>
                <MovieList movies={favorites} handleFavoritesClick={addFavoriteMovie} favoriteMovie={AddFavorite}/>
            </div>
        </div>
    );
};

export default Home;
