import { useContext } from "react";
import { useParams } from "react-router-dom"

import ProfileImg from '../../assets/profile-img.jpg';
import MoviePoster from '../../assets/scary_movie.jpeg';
import './movieNightDetails.css';
import { MovieNightsContext } from "../../store/movieNights/MovieNightsCtx";


export default function MovieNightDetails() {
    
    const { movieNightId } = useParams();
    const { movieNights } = useContext(MovieNightsContext);

    console.log(typeof(movieNightId));
    
    console.log('movieNights', movieNights);

    const getMovieNightById = (id) => {
        return movieNights.find(movieNight => movieNight.id === parseInt(id));
      };


    const movieNight = getMovieNightById(movieNightId);

    console.log('IDDDD', movieNight);

    if (!movieNight) {
        return <p>ERROR</p>
    }

    return (
        <div className="detail__event__card">
            <img src={MoviePoster} alt='movie poster' className='detail__card__img' />
            <img src={movieNight.image} alt='movie poster' className='detail__card__img' />
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
                {
                    movieNight.snacks.map((snack) => (
                        <li key={snack}>{snack}</li>
                    ))
                }
                </ul>
               
            </div>
            <div className="detail__participants">
                <h2>Participants</h2>
                <ul className="participants__container">
                {/* {
                    movieNight.participants.map((participant) => (
                        <li key={participant} className="participant">
                            <img src={ProfileImg} alt={participant} className="participant__img" />
                            <span>{participant}</span>
                        </li>
                    ))
                    
                } */}
                </ul>
            </div>
            <button className="event__btn event__btn__primary">join event</button>
            <button className="event__btn event__btn__primary">edit event</button>
        </div>
    )
}