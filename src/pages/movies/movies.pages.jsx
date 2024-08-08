// Movies.js

import { useContext } from 'react';
import MovieCard from '../../components/movie-card/movieCard.component';
import { MoviesContext } from '../../store/movies/movies.context';

import './movies.css';

export default function Movies() {
  const { movies, isLoading, error, currentPage, totalPages, query, handlePageChange, handleSearch } = useContext(MoviesContext);

  return (
    <section className="movies__container">
      <div id="actorsModal"></div>
      <div className="search__movie__container">
        <h1 className='movies__container__title'>Movies & Series</h1>
        <div className="search__movie">
          <input 
            type="search" 
            name="query" 
            id="query" 
            placeholder='Search movie ...'
            value={query}
            onChange={handleSearch}
          />
          <button>Search</button>
        </div>
      </div>
      
      <div className="movie__cards">
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {movies && movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  )
};
