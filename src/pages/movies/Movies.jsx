

import { useEffect, useState, useCallback } from 'react';
import MovieCard from '../../components/movieCard/MovieCard';

import './movies.css';
import { MOVIES_API } from '../../../apis';

export default function Movies() {

    function buildUrl() {
        const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${MOVIES_API}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=${currentPage}`;
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${MOVIES_API}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=${currentPage}`;
    
        return query ? searchUrl : discoverUrl
    }

    const [ movies, setMovies ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState();
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1)
    const [ query, setQuery ] = useState('');


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const fetchMovies = useCallback(async function fetchMovies() {
        setIsLoading(true);
        const url = buildUrl();

        console.log(url)
        try {
            const results = await fetch(url);
            const dataResults = await results.json();
            console.log('data res', dataResults);
            setMovies(dataResults.results);
            setTotalPages(dataResults.total_pages);
        } catch (error) {
            setError(error.message || "Something went wrong!");
        }
        setIsLoading(false);
    }, [query, currentPage]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    function handleSearch(event) {
        setQuery(event.target.value);
    }




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
               {
                    movies && movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                }
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