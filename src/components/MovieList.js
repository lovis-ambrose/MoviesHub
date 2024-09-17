import React from "react";

const MovieList = (props) => {
    return (
        <>
            {props.movies.map((movie, index) =>
                <div className="d-flex justify-content-start m-3" key={movie.imdbID}>
                    <img src={movie.Poster} alt={movie.Title}></img>
                </div>
            )}
        </>
    )
}

export default MovieList;