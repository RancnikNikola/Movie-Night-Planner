

import { useContext } from 'react';

import { MovieNightsContext } from '../../store/movieNights/movieNights.context';

import './create-join.css';


export default function CreateJoin() {

    const movieNightCtx = useContext(MovieNightsContext);

    function handleOpenModal() {
        movieNightCtx.openModal();
        console.log('CLICKED')
    }

    return (
        <section className='create__or__join__event'>
            <h1 className='create__or__join__title'>Create or join event</h1>
            <div className="create__or__join__btns">
                <button onClick={handleOpenModal} className="btn btn-primary">Create event</button>
                <a className="btn btn-danger">Join event</a>
            </div>
        </section>
    )
}