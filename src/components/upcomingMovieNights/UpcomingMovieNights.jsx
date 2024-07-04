
import { Link } from 'react-router-dom';
import MoviePoster from '../../assets/scary_movie.jpeg';
import './upcomingMovieNights.css';

export default function UpcomingMovieNights() {

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    return (
        <section className="upcoming__events">
            <h1 className='upcoming__events__title'>Upcoming events</h1>
            <div className="upcoming__events__cards">
                <div className="upcoming__event__card">
                    <img src={MoviePoster} alt='movie poster' className='card__img' />
                    <div className="upcoming__event__card__content">
                        <Link to='/movie-nights/1'>Event name #1</Link>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, ipsa.</p>
                        <p>Date: {date}</p>
                        <p>Time: {time}</p>
                        <button className='upcoming__btn upcoming__btn__primary'>Join now</button>
                    </div>
                </div>

                <div className="upcoming__event__card">
                    <img src={MoviePoster} alt='movie poster' className='card__img' />
                    <div className="upcoming__event__card__content">
                        <Link to='/movie-nights/2'>Event name #2</Link>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, ipsa.</p>
                        <p>Date: {date}</p>
                        <p>Time: {time}</p>
                        <button className='upcoming__btn upcoming__btn__primary'>Join now</button>
                    </div>
                </div>

                <div className="upcoming__event__card">
                    <img src={MoviePoster} alt='movie poster' className='card__img' />
                    <div className="upcoming__event__card__content">
                        <Link to='/movie-nights/3'>Event name #3</Link>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, ipsa.</p>
                        <p>Date: {date}</p>
                        <p>Time: {time}</p>
                        <button className='upcoming__btn upcoming__btn__primary'>Join now</button>
                    </div>
                </div>

                <div className="upcoming__event__card">
                    <img src={MoviePoster} alt='movie poster' className='card__img' />
                    <div className="upcoming__event__card__content">
                        <Link to='/movie-nights/4'>Event name #4</Link>
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, ipsa.</p>
                        <p>Date: {date}</p>
                        <p>Time: {time}</p>
                        <button className='upcoming__btn upcoming__btn__primary'>Join now</button>
                    </div>
                </div>
            </div>
        </section>
    )
}