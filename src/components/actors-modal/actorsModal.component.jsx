import defaultImage from '../../assets/defaultProfileImg.png'
import './actors-modal.css'; // Add a CSS file for styling the modal

const ActorsModal = ({ show, handleClose, actors }) => {

    console.log('AcTORS', actors);

    return (
        <>
            {show && (
                <div className="modal-overlay" onClick={handleClose}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={handleClose}>X</button>
                        <h2>All Actors</h2>
                        <ul className="actors-list">
                            {actors.map(actor => (
                                <li key={actor.id} className="actor-card">
                                    <img
                                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : defaultImage}
                                        alt={actor.name}
                                    />
                                    <span>{actor.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActorsModal;
