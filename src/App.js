import React, { useState, useEffect } from 'react';
import { databases } from './components/Appwrite';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchMovie from './components/SearchField';
import AddFavorite from './components/AddFavorite';
import Removefavorites from './components/RemoveFavorite';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';


function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const databaseId = process.env.REACT_APP_MOVIES_DATABASE_ID;
  const movieCollectionId = process.env.REACT_APP_MOVIE_COLLECTION_ID;

  const getMovieRequest = async (searchValue) => {
    const apiUrl = `http://www.omdbapi.com/?s=${searchValue}&apikey=7b34463d`

    const response = await fetch(apiUrl);
    const responseJson = await response.json();
    // log response
    // console.log(responseJson);

    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  // call the method only when page loads
  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  // retrieve movies from local storage when app loads
  useEffect(() => {
    const favoriteMovies = JSON.parse(localStorage.getItem('favorite-movie-key'));
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
  
  return (
    <div className='container-fluid'>
      <div className='d-flex flex-row align-items-center mt-4 mb-4 sticky-top'>
        <MovieListHeading heading="Movies" />
        <SearchMovie searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <div className='d-flex flex-row' style={{  overflowY: 'auto' }}>
        <MovieList movies={movies} handleFavoritesClick={addFavoriteMovie}  favoriteMovie={AddFavorite} />
      </div>

      <div className='d-flex flex-row align-items-center mt-4 mb-4 sticky-top'>
        <MovieListHeading heading="Favorites" />
      </div>

      <div className='d-flex flex-row' style={{  overflowY: 'auto' }}>
        <MovieList movies={favorites} handleFavoritesClick={removeFavoriteMovie}  favoriteMovie={Removefavorites} />
      </div>
    </div>

  //   <Router>
  //     <div className="App">
  //         <Routes>
  //             <Route path="/register" element={<Register />} />
  //             <Route path="/login" element={<Login />} />
  //             <Route path="/forgot-password" element={<ForgotPassword />} />
  //             {/* Other routes can go here */}
  //         </Routes>
  //     </div>
  // </Router>
  );
};

export default App;
