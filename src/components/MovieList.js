import React from "react";

const MovieList = (props) => {
    const FavoriteMovieComponent = props.favoriteMovieComponent;

    return (
        <>
            {props.movies.map((movie) => (
                <div className="image-container d-flex justify-content-start m-3" key={movie.imdbID}>
                    <img src={movie.Poster} alt={movie.Title} title="click to see Movie Details" />
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
