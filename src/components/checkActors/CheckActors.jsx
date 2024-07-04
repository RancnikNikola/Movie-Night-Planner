import ActorsModal from "../actorsModal/ActorsModal";
import ParticipantImg from '../../assets/profile-img.jpg';

import './checkActors.css';
import { useContext } from "react";
import { MovieNightsContext } from '../../store/movieNights/MovieNightsCtx';

export default function CheckActors({ actors }) {

    const movieNightsCtx = useContext(MovieNightsContext)


    function handleCloseActorsModal() {
        movieNightsCtx.closeActorsModal();
    }


    function handleExitActorsModal() {
        movieNightsCtx.exitActorsModal();
    }

    return (
        <ActorsModal open={movieNightsCtx.isActorsOpen} onClose={handleExitActorsModal}>
           <h1 className="check__actors__title">Full Cast</h1>
           <ul className="check__actors">
           {actors && actors.map((actor) => (
                <li key={actor.id} className='check__actor__card'>
                    <img src={ParticipantImg} alt={actor.name} />
                    <span>{actor.name}</span>
                </li>
            ))}
           </ul>
          
           <button onClick={handleCloseActorsModal}>Close</button>
        </ActorsModal>
    )
}