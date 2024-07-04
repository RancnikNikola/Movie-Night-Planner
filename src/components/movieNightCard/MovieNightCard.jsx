
import { Link } from "react-router-dom"
import './movieNightsCard.css';

export default function MovieNightCard({ movieNight }) {

    console.log('MN', movieNight.id)

    return (
        <div key={movieNight.id} className="upcoming__event__card">
            <img src={movieNight.image} alt='movie poster' className='card__img' />
            <div className="upcoming__event__card__content">
                <Link to={`/movie-nights/${movieNight.id}`}>{movieNight.title}</Link>
                <p>{movieNight.movieTitle}</p>
                <p>{movieNight.description}</p>
                <p>Date: {movieNight.date}</p>
                <p>Time: {movieNight.time}</p>
                <button className='upcoming__btn upcoming__btn__primary'>Join now</button>
            </div>
        </div>
    )
}