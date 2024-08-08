import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileImg from '../../assets/profile-img.jpg';
import MoviePoster from '../../assets/scary_movie.jpeg';
import './movie-night-details.css';
import { MovieNightsContext } from "../../store/movieNights/movieNights.context";

export default function MovieNightDetails() {
    const { movieNightId } = useParams();
    const { fetchMovieNightById } = useContext(MovieNightsContext);
    const [movieNight, setMovieNight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieNight = async () => {
            try {
                const movieNightData = await fetchMovieNightById(movieNightId);
                setMovieNight(movieNightData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMovieNight();
    }, [movieNightId, fetchMovieNightById]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!movieNight) {
        return <p>Movie night not found.</p>;
    }

    return (
        <div className="detail__event__card">
            <img src={movieNight.image ? `https://image.tmdb.org/t/p/w200${movieNight.image}` : MoviePoster} alt='movie poster' className='detail__card__img' />
            <h1 className="detai__event__title">{movieNight.title}</h1>
            <p className="detail__description">{movieNight.description}</p>
            <p className="movie__title">{movieNight.movieTitle}</p>
            <div className="detail__event__header">
                <h2>Details</h2>
                <div className="details">
                    <div className="date">
                        <span>Date</span>
                        <p>{movieNight.date}</p>
                    </div>
                    <div className="time">
                        <span>Time</span>
                        <p>{movieNight.time}</p>
                    </div>
                    <div className="location">
                        <span>Location</span>
                        <p>{movieNight.location}</p>
                    </div>
                </div>
            </div>
            <div className="detail__snacks">
                <h2>Snacks</h2>
                <ul className="snacks__container">
                    {movieNight.snacks.map((snack, idx) => (
                        <li key={idx}>{snack}</li>
                    ))}
                </ul>
            </div>
            <div className="detail__participants">
                <h2>Participants</h2>
                <ul className="participants__container">
                    {movieNight.participants.map((participant, idx) => (
                        <li key={idx} className="participant">
                            <img src={ProfileImg} alt={participant} className="participant__img" />
                            <span>{participant}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="event__btn event__btn__primary">Join Event</button>
            <button className="event__btn event__btn__primary">Edit Event</button>
        </div>
    );
}
