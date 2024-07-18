import { createContext, useEffect, useReducer } from 'react';

import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  logOutUser,
  db,
} from '../../utils/firebase';
import { collection, doc, getDoc, getDocs, query, updateDoc, where, onSnapshot } from 'firebase/firestore';

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
  onlineUsers: [],
  errorOnline: null,
  fetchOnlineUsers: () => {}
});

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  FETCH_ONLINE_USERS_SUCCESS: 'FETCH_ONLINE_USERS_SUCCESS',
  FETCH_ONLINE_USERS_FAILED: 'FETCH_ONLINE_USERS_FAILED'
};

const INITIAL_STATE = {
  currentUser: null,
  onlineUsers: [],
  errorOnline: null
};

const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return { ...state, currentUser: payload };
    case USER_ACTION_TYPES.FETCH_ONLINE_USERS_SUCCESS:
      return { ...state, onlineUsers: payload, errorOnline: null };
    case USER_ACTION_TYPES.FETCH_ONLINE_USERS_FAILED:
      return { ...state, errorOnline: payload }
    default:
      return state;
  }
};


export const UserProvider = ({ children }) => {
  const [ state, dispatch ] = useReducer(userReducer, INITIAL_STATE);

  const { currentUser, onlineUsers, errorOnline } = state;

  const setCurrentUser = (user) =>
    dispatch({ type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user});


  const handleUserStatus = async (user, status) => {
    if (user) {
      const userDocRef = doc(db, 'users', user);
      await updateDoc(userDocRef, { online: status });
    }
  };

  const logoutUser = async () => {
    if (currentUser) {
      await logOutUser();
      handleUserStatus(currentUser.uid, false);
      setCurrentUser(null);
    }
  };


  const fetchOnlineUsers = () => {
    const usersRef = collection(db, 'users');
    const onlineQuery = query(usersRef, where('online', '==', true));

    const unsubscribe = onSnapshot(onlineQuery, (querySnapshot) => {
      const onlineUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch({ type: USER_ACTION_TYPES.FETCH_ONLINE_USERS_SUCCESS, payload: onlineUsers });
    }, (error) => {
      dispatch({ type: USER_ACTION_TYPES.FETCH_ONLINE_USERS_FAILED, payload: error.message });
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
        console.log('USE EFFECT USER', user);
      }
      setCurrentUser(user);
      handleUserStatus(user?.uid, true);
    });

    const unsubscribeOnlineUsers = fetchOnlineUsers();

    return () => {
      unsubscribeAuth();
      unsubscribeOnlineUsers();
    };
  }, []);

  const value = {
    currentUser,
    logoutUser,
    fetchOnlineUsers,
    onlineUsers,
    errorOnline
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};