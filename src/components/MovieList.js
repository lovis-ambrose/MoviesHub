import React from "react";
import AddFavorite from "./AddFavorite";

const MovieList = (props) => {
    const FavoriteMovie = props.favoriteMovie;

    return (
        <>
            {props.movies.map((movie, index) =>
                <div className="image-container d-flex justify-content-start m-3" key={movie.imdbID}>
                    <img src={movie.Poster} alt={movie.Title}></img>
                    <div className="overlay d-flex align-items-center justify-content-center">
                        <FavoriteMovie />
                    </div>
                </div>
            )}
        </>
    )
}

export default MovieList;