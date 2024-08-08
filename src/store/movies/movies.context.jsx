// store/movies/movies.context.js

import { createContext, useState, useCallback, useEffect } from 'react';
import { MOVIES_API } from '../../../apis';

const MoviesContext = createContext();

const MoviesProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');

  const buildUrl = useCallback(() => {
    const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIES_API}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=${currentPage}`;
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${MOVIES_API}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=${currentPage}`;
    
    return query ? searchUrl : discoverUrl;
  }, [query, currentPage]);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    const url = buildUrl();

    try {
      const results = await fetch(url);
      const dataResults = await results.json();
      setMovies(dataResults.results);
      setTotalPages(dataResults.total_pages);
    } catch (error) {
      setError(error.message || "Something went wrong!");
    }
    setIsLoading(false);
  }, [buildUrl]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  return (
    <MoviesContext.Provider value={{ movies, isLoading, error, currentPage, totalPages, query, handlePageChange, handleSearch }}>
      {children}
    </MoviesContext.Provider>
  );
};

export { MoviesContext, MoviesProvider };
