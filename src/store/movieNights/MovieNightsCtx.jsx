import { createContext, useContext, useReducer } from "react";
// import { EVENTS as initialEvents } from '../../../events';
import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../utils/firebase";


// export const MovieNightsContext = createContext({
//     movieNights: [],
//     openModal: () => {},
//     closeModal: () => {},
//     isOpen: false,
//     exitModal: () => {},
//     openActorsModal: () => {},
//     closeActorsModal: () => {},
//     exitActorsModal: () => {},
//     isActorsOpen: false,
// });

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
          }
        default:
            return state;
    }
}

export function MovieNightsProvider({ children }) {
    const [ movieNights, dispatch] = useReducer(MovieNightsReducer, initialState);
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
      setIsActorsOpen(!isOpen);
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
          console.log('DAtA', movieNightsData);
          dispatch({ type: 'FETCH_MOVIE_NIGHTS_SUCCESS', payload: movieNightsData });
        } catch (error) {
          dispatch({ type: 'FETCH_MOVIE_NIGHTS_FAILURE', payload: error.message });
        }
      };
  
      fetchMovieNights();
    }, []);



    const movieNightsCtxValue = {
        movieNights: movieNights.movieNights,
        openModal: openModal,
        closeModal,
        isOpen,
        exitModal,
        openActorsModal,
        closeActorsModal,
        exitActorsModal,
        isActorsOpen
    }

  
    return (
      <MovieNightsContext.Provider value={movieNightsCtxValue}>
        {children}
      </MovieNightsContext.Provider>
    );
  };