import { createContext, useReducer } from "react";
import { useState, useEffect } from "react";
import { getDocs, collection, doc, setDoc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../utils/firebase";


export const MovieNightsContext = createContext();

const initialState = {
    movieNights: [],
    loading: true,
    error: null
};

function MovieNightsReducer(state, action) {
    switch (action.type) {
        case 'FETCH_MOVIE_NIGHTS_REQUEST':
          return {
            ...state,
            loading: true,
            error: null
          };
        case 'FETCH_MOVIE_NIGHTS_SUCCESS':
          return {
            ...state,
            movieNights: action.payload,
            loading: false,
          };
        case 'FETCH_MOVIE_NIGHTS_FAILURE':
          return {
            ...state,
            error: action.payload,
            loading: false,
          };
        case 'ADD_MOVIE_NIGHT_REQUEST':
          return {
            ...state,
            error: null,
            loading: true,
          };
        case 'ADD_MOVIE_NIGHT_SUCCESS':
          return {
            ...state,
            movieNights: [
              ...state.movieNights,
              action.payload
            ],
            loading: false,
          }
        case 'ADD_MOVIE_NIGHT_FAILURE':
          return {
            ...state,
            error: action.payload,
            loading: false,
          };
        case 'UPDATE_MOVIE_NIGHT_SUCCESS':
          return {
            ...state,
            movieNights: state.movieNights.map((movieNight) => {
              movieNight.id === action.payload.id ? action.payload : movieNight
            })
          };
        default:
            return state;
    }
}

export function MovieNightsProvider({ children }) {
    const [ movieNights, dispatch ] = useReducer(MovieNightsReducer, initialState);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isActorsOpen, setIsActorsOpen ] = useState(false);

    function openModal() {
      setIsOpen(!isOpen);
    }

    function closeModal() {
      setIsOpen(false);
    }

    function exitModal() {
      setIsOpen(false);
    }

    function openActorsModal() {
      setIsActorsOpen(!isOpen); // way with the old state => new state
    }

    function closeActorsModal() {
      setIsActorsOpen(false);
    }

    function exitActorsModal() {
      setIsActorsOpen(false);
    }

    useEffect(() => {
      const fetchMovieNights = async () => {
        dispatch({ type: 'FETCH_MOVIE_NIGHTS_REQUEST' });
        try {
          const querySnapshot = await getDocs(collection(db, 'movie-nights'));
          const movieNightsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          dispatch({ type: 'FETCH_MOVIE_NIGHTS_SUCCESS', payload: movieNightsData });
        } catch (error) {
          dispatch({ type: 'FETCH_MOVIE_NIGHTS_FAILURE', payload: error.message });
        }
      };
  
      fetchMovieNights();
    }, []);


    const createEvent = async (event) => {
      try {
        const eventRef = doc(collection(db, 'movie-nights'));
        await setDoc(eventRef, event);
        dispatch({ type: 'ADD_MOVIE_NIGHT_SUCCESS', payload: { id: eventRef.id, ...event } });
  
        // Send notifications to participants
        event.participants.forEach(participantId => {
          const notification = {
            type: 'MOVIE_NIGHT_INVITE',
            eventId: eventRef.id,
            eventName: event.title,
            eventDate: event.date,
            sender: event.createdBy.name,
            status: 'pending',
          };
          setDoc(doc(db, `users/${participantId}/notifications`, eventRef.id), notification);
        });
      } catch (error) {
        console.error('Error creating event: ', error);
      }
    };

    const updateEventParticipants = async (eventId, userId, response) => {
      const eventRef = doc(db, 'movie-nights', eventId);
  
      // Retrieve the current event data
      const eventSnapshot = await getDoc(eventRef);
      const eventData = eventSnapshot.data();
  
      if (!eventData) {
          // Handle case where event data does not exist
          console.error(`Event with ID ${eventId} does not exist.`);
          return;
      }
  
      let participants = eventData.participants || [];
  
      if (response === 'accepted') {
          // Add userId to participants array
          participants = Array.from(new Set([...participants, userId])); // Ensure userId is unique
      } else {
          // Remove userId from participants array
          participants = participants.filter(id => id !== userId);
      }
  
      // Update the Firestore document with the updated participants array
      await updateDoc(eventRef, { participants });
  
      // Retrieve the updated event data after the update
      const updatedEventSnapshot = await getDoc(eventRef);
      const updatedEventData = updatedEventSnapshot.data();
  
      // Dispatch action with updated event data
      dispatch({ type: 'UPDATE_MOVIE_NIGHT_SUCCESS', payload: { id: eventId, ...updatedEventData } });
  };
  



    const movieNightsCtxValue = {
        movieNights: movieNights.movieNights,
        openModal: openModal,
        closeModal,
        isOpen,
        exitModal,
        openActorsModal,
        closeActorsModal,
        exitActorsModal,
        isActorsOpen,
        createEvent,
        updateEventParticipants
    }

  
    return (
      <MovieNightsContext.Provider value={movieNightsCtxValue}>
        {children}
      </MovieNightsContext.Provider>
    );
  };