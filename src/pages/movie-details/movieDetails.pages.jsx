import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import MovieActors from "../../components/movie-actors/movieActors.component";
import './movie-details.css';



export default function MovieDetails() {

    const [ movie, setMovie ] = useState();
    const [ error, setError ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);

    const { movieId } = useParams();

    console.log('MOVIE', movie);

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
        <div className="movie__details__image">
            <img src={`https://image.tmdb.org/t/p/w200${movie && movie && movie.poster_path}`} alt={movie && movie.title} />
        </div>
        <div className="movie__details__info">
            <h1>{movie && movie.title}</h1>
            <ul className="movie__details__score">
                <li>{movie && movie.runtime} min</li>
                <li>{movie && movie.vote_average}</li>
                <li>{movie && movie.release_date}</li>
            </ul>
            <ul className="movie__genres">
                {movie && movie.genres.map((genre) => (
                    <li key={genre.id}>{genre.name}</li>
                ))}
            </ul>
            <p className="movie__tagline">{movie && movie.tagline}</p>
            <p className="movie__overview">{movie && movie.overview}</p>
            <MovieActors movieId={movieId} />
        </div>
       </section>
    )
}