import { useContext, useState, useCallback, useEffect } from "react";
import MovieNightModal from "../movieNightModal/MovieNightModal";
import SelectedMovie from "../selectedMovie/SelectedMovie";
import { MovieNightsContext } from "../../store/movieNights/MovieNightsCtx";

import { UserContext } from "../../store/userContext/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { MOVIES_API } from "../../../apis";

import useUserStatuses from "../../hooks/useUserStatus";

import './newEvent.css';

export default function NewEvent() {

    const movieNightsCtx = useContext(MovieNightsContext);
    const userCtx = useContext(UserContext);


    const [ eventTitle, setEventTitle ] = useState('');
    const [ fetchedMovies, setFetchedMovies ] = useState([]);
    const [ fetchedTotalPages, setFetchedTotalPages ] = useState(1);
    const [ querySearch, setQuerySearch ] = useState('');
    const [ fetchedCurrPage, setFetchedCurrPage ] = useState(1);
    const [ isSearching, setIsSearching ] = useState(false);
    const [ snacks, setSnacks ] = useState([]);
    const [ snacksInput, setSnacksInput ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ date, setDate ] = useState('');
    const [ time, setTime ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ selectedMovie, setSelectedMovie ] = useState(null);
    const [ participants, setParticipants ] = useState([]);


    const onlineUsersExcludingCurrentUser = userCtx.onlineUsers.filter(
        (onlineUser) => onlineUser.id !== userCtx.currentUser?.uid
      );


    function handleCloseModal() {
        movieNightsCtx.closeModal();
    }

    function handleExitModal() {
        movieNightsCtx.exitModal();
    }

    const searchMovies = useCallback(async function searchMovies() {
        setIsSearching(true);
        const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${querySearch}&api_key=${MOVIES_API}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&page=${fetchedCurrPage}`;

        try {
            const results = await fetch(searchUrl);
            const dataResults = await results.json();
            setFetchedMovies(dataResults.results);
            setFetchedTotalPages(dataResults.total_pages);
        } catch (error) {
            setError(error.message || "Something went wrong!");
        }
        setIsSearching(false);
    }, [querySearch, fetchedCurrPage]);

    useEffect(() => {
        searchMovies();
    }, [searchMovies]);

    function handleSearch(event) {
        setQuerySearch(event.target.value);
    }

    const handlePageChange = (page) => {
        setFetchedCurrPage(page);
    };

    const handleSnacks = (event) => {
        setSnacksInput(event.target.value);
    }

    const addSnack = () => {
        if (snacksInput.trim() !== '') {
            setSnacks((prevSnacks) => [...prevSnacks, snacksInput]);
            setSnacksInput('');
        }
    }

    const handleDescription = (event) => {
        setDescription(event.target.value);
    }

    const handleDate = (event) => {
        setDate(event.target.value)
    }

    const handleTime = (event) => {
        setTime(event.target.value)
    }

    const handleLocation = (event) => {
        setLocation(event.target.value)
    }

    const handleSelectMovie = (movie) => {
        console.log('clicked');
        console.log(movie);
        setSelectedMovie(movie)
    }

    const handleEventTitle = (event) => {
        setEventTitle(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const userCreating = {
            uid: userCtx.currentUser.uid,
            name: userCtx.currentUser.displayName
        }

        const t = new Date();
        const newId = t.setSeconds(t.getSeconds() + 10);

        const newEvent = {
            id: newId,
            title: eventTitle,
            movieTitle: selectedMovie.title,
            description: description,
            overview: selectedMovie.overview,
            image: selectedMovie.poster_path,
            date: date,
            time: time,
            location: location,
            snacks: snacks,
            createdBy: userCreating,

            participants: participants
        }

        try {
            // await setDoc(doc(db, 'movie-nights', `${Date.now()}`), newEvent);
            await movieNightsCtx.createEvent(newEvent);
            console.log('Event successfully created!');
        } catch (error) {
            console.error('Error creating event: ', error);
        }

        // console.log(newEvent);
    }

    const handleSelectedUsersChange = (users) => {
        setParticipants(users);
      };
    



    const handleSelectParticipants = (participant) => {
        setParticipants(prevParticipants => {
            const newParticipants = prevParticipants.includes(participant)
              ? prevParticipants.filter(id => id !== participant)
              : [...prevParticipants, participant];
              handleSelectedUsersChange(newParticipants);
            return newParticipants;
          });
    }


    return (
        <MovieNightModal className="new__event" open={movieNightsCtx.isOpen} onClose={handleExitModal}>
            <h2>New event</h2>
            <form>
                <div className="new__event__title">
                    <label>Event title</label>
                    <input 
                        placeholder="Enter event title ..."
                        name="eventTitle"
                        id="eventTitle"
                        value={eventTitle}
                        onChange={handleEventTitle}
                        required
                        />
                </div>
                <div className="search__movies">
                    <div className="search__input__container">
                        <p>Movie suggestions & voting</p>
                        <input 
                            type="search" 
                            name="querySearch" 
                            id="querySearch" 
                            placeholder='Search movie ...'
                            value={querySearch}
                            onChange={handleSearch}
                            required
                        />
                    </div>
                    <ul className="movie__search__results">
                    
                       {
                        selectedMovie ? <SelectedMovie selectedMovie={selectedMovie} /> : fetchedMovies && fetchedMovies.map((fetchedMovie) => (
                            <li onClick={() => handleSelectMovie(fetchedMovie)} key={fetchedMovie.id} className="search__result">
                                <img src={`https://image.tmdb.org/t/p/w200${fetchedMovie.poster_path}`} alt={fetchedMovie.title} />
                                <h3>{fetchedMovie.title}</h3>
                            </li>
                        ))
                       }
                        <div className="pagination">
                            <button 
                                type="button"
                                onClick={() => handlePageChange(fetchedCurrPage - 1)} 
                                disabled={fetchedCurrPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {fetchedCurrPage} of {fetchedTotalPages}</span>
                            <button 
                                type="button"
                                onClick={() => handlePageChange(fetchedCurrPage + 1)} 
                                disabled={fetchedCurrPage === fetchedTotalPages}
                            >
                                Next
                            </button>
                        </div>
                    </ul>
                </div>


                <div className="snacks__and__drinks">
                    <div className="snacks_input__container">
                        <p>Snacks and Drinks</p>
                    <div className="snacks__input">
                            <input 
                                type="text" 
                                id="snacks"
                                name="snacks"
                                placeholder="Add snack ..."
                                value={snacksInput}
                                onChange={handleSnacks} 
                                required
                            />
                            <button className="add__snack" onClick={addSnack} type="button">Add</button>
                    </div>
                    </div>
                    <ul className="snack__results">
                        {
                            snacks.map((snack, idx) => (
                            <li className="snack" key={idx}>
                                <h3>{snack}</h3>
                            </li>
                            ))
                        }
                    </ul>
                </div>

            <div className="desc__container">
                <label>Description</label>
                <textarea 
                    placeholder="Description ..."
                    name="description"
                    id="description"
                    value={description}
                    onChange={handleDescription}
                    required
                     />
            </div>

            <div className="date__time__loc__container">
                <div className="date__container">
                    <label>Date</label>
                        <input 
                            type="date"
                            id="date"
                            name="date"
                            value={date}
                            onChange={handleDate}
                            required
                        />
                </div>
                <div className="time__container">
                    <label>Time</label>
                    <input 
                        type="time"
                        id="time"
                        name="time"
                        value={time}
                        onChange={handleTime}
                        required
                     />
                </div>
                <div className="location__container">
                    <label>Location</label>
                    <input 
                        type="text" 
                        placeholder="Location ..."
                        id="location"
                        name="location"
                        value={location}
                        onChange={handleLocation}
                        required
                    />
                </div>
            </div>


            <div className="participants__container">
                <div className="participants__input__container">
                    <p>Participants</p>
                   <div className="participants__input">
                        <input type="text" id="participants" placeholder="Add participant ..." />
                        <button className="add__participant">Add</button>
                   </div>
                </div>
                <ul className="participant__results">


                {
                onlineUsersExcludingCurrentUser.map((onlineUser) => {

                    const isSelected = participants.includes(onlineUser.id)

                    return (
                        <li className="user-selection-item" style={{ marginRight: '10px' }}>
                        <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectParticipants(onlineUser.id)}
                        />
                        <img 
                            src={onlineUser.photoURL} 
                            alt={`${onlineUser.displayName}'s avatar`} 
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
                            onClick={() => startChat(onlineUser.id)}
                        />
                        <p>{onlineUser.displayName}</p>
    
                        </li>
                    )
                })
                } 

                    
                </ul>
            </div>

            <div className="chat__container">
                <h1>Chat</h1>
            </div>
            </form>
            <button type="submit" onClick={handleSubmit}>Create</button>
            <button type="button" onClick={handleCloseModal}>Close</button>
        </MovieNightModal>
    )
}