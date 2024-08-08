
import { useContext } from "react"
import MovieNightCard from "../../components/movie-night-card/movieNightCard.component";
import { MovieNightsContext } from "../../store/movieNights/movieNights.context";


export default function MovieNights() {

    const movieNightsCtx = useContext(MovieNightsContext)

    const movieNights = movieNightsCtx.movieNights;
    console.log(movieNightsCtx.movieNights[0])
    
    return (
        <section className="upcoming__events">
            <h1 className='upcoming__events__title'>Upcoming events</h1>
            <div className="upcoming__events__cards">
                {
                    movieNights.map((movieNight) => (
                        <MovieNightCard key={movieNight.id} movieNight={movieNight} />
                    ))
                }
            </div>
        </section>
    )
};