


import './movieCard.css';

import MoviePoster from '../../assets/scary_movie.jpeg';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {

    return (
        <Link to={`/movies/${movie.id}`} className="movie__card">
           <div className="movie__card__header">
            <h1>{movie.title}</h1>
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
           </div>
            <div className="movie__card__body">
                <div className="movie__overview">
                    <h2>Overview</h2>
                    <p>{movie.overview}</p>
                </div>
                <div className="movie__card__info">
                    <div className="release__date">
                        <span>Release date</span>
                        <p>{movie.release_date}</p>
                    </div>
                    <div className="movie__rating">
                        <span>Rating</span>
                        <p>{movie.vote_average}</p>
                    </div>
                    <p>{movie.video}</p>
                </div>
            </div>
        </Link>
    )
}