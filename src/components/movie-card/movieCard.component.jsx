
import { Link } from 'react-router-dom';
import './movie-card.css';

export default function MovieCard({ movie }) {

    return (
        <Link to={`/movies/${movie.id}`} className="movie__card">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
        </Link>
    )
}