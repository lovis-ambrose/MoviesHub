import React from "react";
import { useNavigate } from "react-router-dom";

const MovieList = (props) => {
    const FavoriteMovieComponent = props.favoriteMovieComponent;
    const handleNavigation = useNavigate();

    const handleMovieClick = (imdbID) => {
        handleNavigation(`/movie/${imdbID}`);
    };

    return (
        <>
            {props.movies.map((movie) => (
                <div className="image-container d-flex justify-content-start m-3" key={movie.imdbID} >
                    <img src={movie.Poster} alt={movie.Title} title="click to see Movie Details" onClick={() => handleMovieClick(movie.imdbID)} />
                    <div className="overlay d-flex align-items-center justify-content-center row" onClick={() => props.handleFavoritesClick(movie)}>
                        <h3>{movie.Title}</h3>
                        <FavoriteMovieComponent/>
                    </div>
                </div>
            ))}
        </>
    );
};

export default MovieList;
