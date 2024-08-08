import { createContext, useReducer } from "react";
import { useState, useEffect } from "react";
import { getDocs, collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase.utils";

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
        case 'FETCH_MOVIE_NIGHT_BY_ID_SUCCESS':
          return {
            ...state,
            movieNights: state.movieNights.map(movieNight =>
              movieNight.id === action.payload.id ? action.payload : movieNight
            ),
            loading: false,
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
        case 'UPDATE_MOVIE_NIGHT_SUCCESS':
          return {
            ...state,
            movieNights: state.movieNights.map((movieNight) =>
              movieNight.id === action.payload.id ? action.payload : movieNight
            ),
          };
        default:
            return state;
    }
}

export function MovieNightsProvider({ children }) {
    const [state, dispatch] = useReducer(MovieNightsReducer, initialState);
    const [isOpen, setIsOpen] = useState(false);

    function openModal() {
      setIsOpen(!isOpen);
    }

    function closeModal() {
      setIsOpen(false);
    }

    function exitModal() {
      setIsOpen(false);
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

    const fetchMovieNightById = async (id) => {
      try {
        const docRef = doc(db, 'movie-nights', id);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          const movieNightData = { id: docSnapshot.id, ...docSnapshot.data() };
          dispatch({ type: 'FETCH_MOVIE_NIGHT_BY_ID_SUCCESS', payload: movieNightData });
          return movieNightData;
        } else {
          throw new Error('Movie night not found');
        }
      } catch (error) {
        dispatch({ type: 'FETCH_MOVIE_NIGHTS_FAILURE', payload: error.message });
        throw error;
      }
    };

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
        movieNights: state.movieNights,
        openModal,
        closeModal,
        isOpen,
        exitModal,
        createEvent,
        updateEventParticipants,
        fetchMovieNightById,
    };
  
    return (
      <MovieNightsContext.Provider value={movieNightsCtxValue}>
        {children}
      </MovieNightsContext.Provider>
    );
}
