import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';

function App() {
  const [movies, setMovies] = useState([]);

  const getMovieRequest = async () => {
    const url = "http://www.omdbapi.com/?s=avengers&apikey=7b34463d";
    const response = await fetch(url);
    const responseJson = await response.json();
    console.log(responseJson);
    setMovies(responseJson.Search);
  }

  // call the method only when page loads
  useEffect(() => {
    getMovieRequest();
  }, []);
  
  return (
    <div className='container-fluid'>
      <div className='d-flex flex-row'>
        <MovieList movies={movies} />
      </div>
    </div>
  );
};

export default App;
