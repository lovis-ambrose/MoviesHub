import React, { useEffect, useState } from "react";
import { account, databases } from "./Appwrite";
import MovieList from './MovieList';
import MovieListHeading from './MovieListHeading';
import SearchMovie from './SearchField';
import AddFavorite from './AddFavorite';
import RemoveFavorites from "./RemoveFavorite";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons/faSignOut";
import { faSignIn } from "@fortawesome/free-solid-svg-icons/faSignIn";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFavoritesTab, setIsFavoritesTab] = useState(false); // Manage which tab is active
    const handleNavigation = useNavigate();

    // Fetch favorite movies from Appwrite database
    const fetchFavoritesFromDatabase = async () => {
        try {
            const response = await databases.listDocuments("66eab0820029be0edb42", "66eab10c0029c603f351");
            const favoriteDocs = response.documents;
            setFavorites(favoriteDocs);  // Update favorites state with movies from Appwrite
        } catch (error) {
            console.error('Error fetching favorites from Appwrite', error);
        }
    };

    // Check if user is logged in
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const user = await account.get(); // Check if user session exists
                if (user.$id) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.log("User not found");
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
        if (!isFavoritesTab) {
            getMovieRequest(searchValue);
        }
    }, [searchValue, isFavoritesTab]);

    // Fetch favorite movies from Appwrite on load
    useEffect(() => {
        fetchFavoritesFromDatabase();
    }, []);

    // Save movie to favorites
    const saveFavoriteMovie = async (movie) => {
        const newFavoriteList = [...favorites, movie];
        setFavorites(newFavoriteList);  // Update favorites state

        // Save movie to Appwrite database
        try {
            await databases.createDocument("66eab0820029be0edb42", "66eab10c0029c603f351", 'unique()', {
                title: movie.Title,
                year: movie.Year,
                type: movie.Type,
                poster: movie.Poster,
                imdbID: movie.imdbID,
                genre: movie.Genre || "N/A",
            });
            console.log('Movie added to Appwrite database');
        } catch (error) {
            console.error('Error adding movie to Appwrite database', error);
        }
    };

    // Delete favorite movie
    const deleteFavoriteMovie = async (movie) => {
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

    // Handle logout
    const handleLogout = async () => {
        try {
            await account.deleteSession('current'); // Log out the user
            setIsLoggedIn(false);
            handleNavigation('/login'); // Redirect to login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Toggle between movies and favorites
    const handleTabChange = () => {
        setIsFavoritesTab(!isFavoritesTab); // Toggle between movies and favorites
    };

    return (
        <div className='container-fluid'>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-4 sticky-top">
                <MovieListHeading heading={isFavoritesTab ? "Favorites" : "Movies"} />
                <div className="m-2" onClick={handleTabChange}>
                    <FontAwesomeIcon icon={faHeart} title="Favorites" size="2x" color={isFavoritesTab ? "green" : "red"} cursor="pointer" />
                </div>
                <SearchMovie searchValue={searchValue} setSearchValue={setSearchValue} />
                {/* Conditionally show login or logout button */}
                {isLoggedIn ? (
                    <button className="btn btn-link" onClick={handleLogout} title="Logout">
                        <FontAwesomeIcon icon={faSignOut} size="2x" />
                    </button>
                ) : (
                    <button className="btn btn-link" onClick={() => handleNavigation('/login')} title="Login">
                        <FontAwesomeIcon icon={faSignIn} size="2x" />
                    </button>
                )}
            </div>

            <div className='d-flex flex-row' style={{ overflowY: 'auto' }}>
                {isFavoritesTab ? (
                    <MovieList movies={movies} handleFavoritesClick={saveFavoriteMovie} favoriteMovie={AddFavorite} />
                ) : (
                    <MovieList movies={favorites} handleFavoritesClick={deleteFavoriteMovie} favoriteMovie={RemoveFavorites} />
                )}
            </div>
        </div>
    );
};

export default Home;
