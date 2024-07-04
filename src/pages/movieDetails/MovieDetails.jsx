import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import MovieActors from "../../components/movieActors/MovieActors";
import './movieDetails.css';



export default function MovieDetails() {

    const [ movie, setMovie ] = useState();
    const [ error, setError ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);

    const { movieId } = useParams();

    useEffect(() => {
        async function fetchMovieByid(id) {
            setIsLoading(true);
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=b2a90a13afa2c62eea2d08e01760b568`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setMovie(data)
            } catch (error) {
                setError(error.message);
            }
            setIsLoading(false);
        }

        if (movieId) {
            fetchMovieByid(movieId);
        }
    }, [movieId]);

    if (error) {
        return <h2>Error fetching the movie</h2>
    }

    if (isLoading) {
        return <h2>Loading ...</h2>
    }


    return (
        <section className="movie__details__container">
            <h1>{movie && movie.title}</h1>
            <div className="movie__header">
              
               
            </div>
            <div className="movie__body">
                <img src={`https://image.tmdb.org/t/p/w200${movie && movie.poster_path}`} alt={movie && movie.title} />
                <div className="movie__body__overview">
                <div id="actorsModal"></div>
                <ul className="about__movie">
                    <li>
                        {movie && movie.genres.map((genre) => (
                            <span key={genre.id}>{genre.name}</span>
                        ))}
                    </li>
                    <li>
                        <span>{movie && movie.runtime} min</span>
                        <span>{movie && movie.vote_average}</span>
                        <span>Release date: {movie && movie.release_date}</span>
                    </li>
                    <li>
                        {movie && movie.spoken_languages.map((language) => (
                                <span key={language.name}>{language.name}</span>
                            ))}
                    </li>
                </ul>
                    <h2>Overview</h2>
                    <p>{movie && movie.overview}</p>
                    <p>{movie && movie.tagline}</p>
                    <MovieActors movieId={movieId} />
                </div>
            </div>
        </section>
    )
}