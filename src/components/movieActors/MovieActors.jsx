
import { useState, useEffect, useContext } from 'react';
import CheckActors from '../checkActors/CheckActors';
import ActorImg from '../../assets//profile-img.jpg';
import { MovieNightsContext } from '../../store/movieNights/MovieNightsCtx';

import './movieActors.css';


export default function MovieActors({ movieId }) {

    const [ movieActors, setMovieActors ] = useState([]);
    const [ error, setError ] = useState();
    const [ isLoadingActors, setIsLoadingActors ] = useState(false);

    useEffect(() => {
        async function fetchMovieCredits(id) {
            setIsLoadingActors(true);
            try {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US&api_key=b2a90a13afa2c62eea2d08e01760b568`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const credentials = await response.json();
                setMovieActors(credentials.cast)
            } catch (error) {
                setError(error.message);
            }
            setIsLoadingActors(false);
        }

        if (movieId) {
            fetchMovieCredits(movieId);
        }
    }, [movieId]);

    if (error) {
        return <h2>Error fetching the movie actors</h2>
    }

    if (isLoadingActors) {
        return <h2>Loading actors ...</h2>
    }

    const movieNightCtx = useContext(MovieNightsContext);

    function handleOpenActorsModal() {
        movieNightCtx.openActorsModal();
    }


    return (
        <>
        <CheckActors actors={movieActors} />
        <div className="actors">
            <div className="actors__title">
                <h2>Movie cast</h2>
                <button onClick={handleOpenActorsModal}>see all</button>
            </div>
            <ul className='actors__container'>
            {movieActors && movieActors.slice(0, 4).map((actor) => (
                <li key={actor.id} className='actor__card'>
                    <img src={ActorImg} alt={actor.name} />
                    <span>{actor.name}</span>
                </li>
            ))}
        </ul>
        <button>Select movie</button>
        </div>
       </>
    )
}