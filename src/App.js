import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchMovie from './components/SearchField';
import AddFavorite from './components/AddFavorite';
import Removefavorites from './components/RemoveFavorite';

function App() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=7b34463d`;
    const response = await fetch(url);
    const responseJson = await response.json();
    // log response
    // console.log(responseJson);

    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  }

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
  }

  const addFavoriteMovie = (movie) => {
    // make a copy of current list and add new movie
    const newFavoriteList = [...favorites, movie];
    setFavorites(newFavoriteList);

    // save to local storage //
    saveMovieToLocalStorage(newFavoriteList);
  }

  const removeFavoriteMovie = (movie) => {
    // remove movie from favorites
    const newFavoriteList = favorites.filter((favoriteMovie) => favoriteMovie.imdbID !== movie.imdbID);
    setFavorites(newFavoriteList);

    // remove from localstorage
    saveMovieToLocalStorage(newFavoriteList);
  }
  
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
  );
};

export default App;
