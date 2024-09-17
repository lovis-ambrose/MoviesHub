import { useState } from "react";
import { useUser } from "../lib/context/user";
import { useMovies } from "../lib/context/movie";

export function Home() {
  const user = useUser();
  const movies = useMovies();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <>
      {/* Show the submit form to logged in users. */}
      {user.current ? (
        <section>
          <h2>Save Movie</h2>
          <form>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <button
              type="button"
              onClick={() =>
                movies.add({ userId: user.current.$id, title, description })
              }
            >
              Submit
            </button>
          </form>
        </section>
      ) : (
        <section>
          <p>Please login to save a movie.</p>
        </section>
      )}
      <section>
        <h2>Latest Movies</h2>
        <ul>
          {movies.current.map((movie) => (
            <li key={movie.$id}>
              <strong>{movie.title}</strong>
              <p>{movie.description}</p>
              {/* Show the remove button to movie owner. */}
              {user.current && user.current.$id === movie.userId && (
                <button type="button" onClick={() => movies.remove(movie.$id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
