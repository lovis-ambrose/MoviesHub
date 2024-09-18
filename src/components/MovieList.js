import React from "react";

const MovieList = (props) => {
    const FavoriteMovie = props.favoriteMovie;

    return (
        <>
            {props.movies.map((movie, index) =>
                <div className="image-container d-flex justify-content-start m-3" key={movie.imdbID}>
                    <img src={movie.Poster} alt={movie.Title}></img>
                    <div className="overlay d-flex align-items-center justify-content-center" onClick={() => props.handleFavoritesClick(movie)}>
                        <FavoriteMovie />
                    </div>
                    {/* <h2 className="text-center">{movie.Title}</h2> */}
                </div>
            )}
        </>
    )
}

export default MovieList;