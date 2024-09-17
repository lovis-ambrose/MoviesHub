import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "../appwrite";
import { ID, Query } from "appwrite";

export const MOVIES_DATABASE_ID = "66e74a3f00291ee8ef9c"; // Replace with your database ID
export const MOVIES_COLLECTION_ID = "66e83d180032241a6677"; // Replace with your collection ID

const MoviesContext = createContext();

export function useMovies() {
  return useContext(MoviesContext);
}

export function MoviesProvider(props) {
  const [movies, setMovies] = useState([]);

  async function add(movie) {
    const response = await databases.createDocument(
      MOVIES_DATABASE_ID,
      MOVIES_COLLECTION_ID,
      ID.unique(),
      movie
    );
    setMovies((movies) => [response, ...movies].slice(0, 10));
  }

  async function remove(id) {
    await databases.deleteDocument(MOVIES_DATABASE_ID, MOVIES_COLLECTION_ID, id);
    setMovies((movies) => movies.filter((movie) => movie.$id !== id));
    await init(); // Refetch movies to ensure we have 10 items
  }

  async function init() {
    const response = await databases.listDocuments(
      MOVIES_DATABASE_ID,
      MOVIES_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    setMovies(response.documents);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <MoviesContext.Provider value={{ current: movies, add, remove }}>
      {props.children}
    </MoviesContext.Provider>
  );
}
