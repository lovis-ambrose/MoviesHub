import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchMovie from './components/SearchField';
import AddFavorite from './components/AddFavorite';

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

  const addFavoriteMovie = (movie) => {
    // make a copy of current list and add new movie
    const newFavoriteList = [...favorites, movie];
    setFavorites(newFavoriteList);
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
        <MovieList movies={favorites} handleFavoritesClick={addFavoriteMovie}  favoriteMovie={AddFavorite} />
      </div>
    </div>
  );
};

export default App;
