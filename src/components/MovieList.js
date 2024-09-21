import React from "react";

const MovieList = (props) => {
    const FavoriteMovieComponent = props.favoriteMovieComponent;

    return (
        <>
            {props.movies.map((movie) => (
                <div className="image-container d-flex justify-content-start m-3" key={movie.imdbID}>
                    <img src={movie.Poster} alt={movie.Title} />
                    <div className="overlay d-flex align-items-center justify-content-center" onClick={() => props.handleFavoritesClick(movie)}>
                        <FavoriteMovieComponent />
                    </div>
                </div>
            ))}
        </>
    );
};

export default MovieList;
