import React, {useEffect, useState} from "react";
import {account, databases} from "./Appwrite";
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchMovie from './SearchField';
import AddFavorite from './AddFavorite';
import {useNavigate} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import RemoveFavorites from "./RemoveFavorite";
import {faSignOut} from "@fortawesome/free-solid-svg-icons/faSignOut";
import {faSignIn} from "@fortawesome/free-solid-svg-icons/faSignIn";

const Home = () => {

    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleNavigation = useNavigate();

    const databaseId = process.env.REACT_APP_MOVIES_DATABASE_ID;
    const movieCollectionId = process.env.REACT_APP_MOVIE_COLLECTION_ID;


    const getMovieRequest = async (searchValue) => {
        const apiUrl = `http://www.omdbapi.com/?s=${searchValue}&apikey=7b34463d`

        const response = await fetch(apiUrl);
        const responseJson = await response.json();
        // console.log(responseJson);

        if (responseJson.Search) {
        setMovies(responseJson.Search);
        }
    };

    // Check if user is logged in when the component mounts
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get(); // Check if user session exists
                if (user.$id) {
                    // console.log(user);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log("user not found");
                setIsLoggedIn(false);
            }
        };

        checkUserSession();
    }, []);

    // call the method only when page loads
    useEffect(() => {
        getMovieRequest(searchValue);
    }, [searchValue]);

    // retrieve movies from local storage when app loads
    useEffect(() => {
        const favoriteMovies = JSON.parse(localStorage.getItem('favorite-movie-key')) || [];
        setFavorites(favoriteMovies);
    }, []);


    const saveMovieToLocalStorage = (items) => {
        localStorage.setItem('favorite-movie-key', JSON.stringify(items));
    };

    const addFavoriteMovie = async (movie) => {
        // make a copy of current list and add new movie
        const newFavoriteList = [...favorites, movie];
        setFavorites(newFavoriteList);

        // save to local storage //
        saveMovieToLocalStorage(newFavoriteList);

        // Save the movie to AppWrite database
        try {
        await databases.createDocument(databaseId, movieCollectionId, 'unique()', {
            title: movie.Title,
            year: movie.Year,
            type: movie.Type,
            poster: movie.Poster,
            imdbID: movie.imdbID,
            genre: movie.Genre || "N/A",
        });
        console.log('Movie added to AppWrite database');
        } catch (error) {
            console.error('Error adding movie to AppWrite database', error);
        }

    };

    const removeFavoriteMovie = async (movie) => {
        // remove movie from favorites
        const newFavoriteList = favorites.filter((favoriteMovie) => favoriteMovie.imdbID !== movie.imdbID);
        setFavorites(newFavoriteList);

        // remove from localstorage
        saveMovieToLocalStorage(newFavoriteList);

        // Remove movie from AppWrite database
        try {
        const movieDocId = movie.imdbID; // imdbID is unique
        await databases.deleteDocument(databaseId, movieCollectionId, movieDocId);
        console.log('Movie removed from AppWrite database');
        } catch (error) {
            console.error('Error removing movie from AppWrite database', error);
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

    return(
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

            <div className='d-flex flex-row' style={{overflowY: 'auto'}}>
                <MovieList movies={movies} handleFavoritesClick={addFavoriteMovie} favoriteMovie={AddFavorite}/>
            </div>

            <div className='d-flex flex-row align-items-center mt-4 mb-4 sticky-top'>
                <MovieListHeading heading="Favorites"/>
            </div>

            <div className='d-flex flex-row' style={{overflowY: 'auto'}}>
                <MovieList movies={favorites} handleFavoritesClick={removeFavoriteMovie}
                           favoriteMovie={RemoveFavorites}/>
            </div>
        </div>
    );
}

export default Home;