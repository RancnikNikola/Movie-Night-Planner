import { createContext, useEffect, useReducer } from 'react';


import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  database,
  logOutUser,
} from '../../utils/firebase';
import { onDisconnect, onValue, ref, set } from 'firebase/database';

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

export const USER_ACTION_TYPES = {
  SET_CURRENT_USER: 'SET_CURRENT_USER',
};

const INITIAL_STATE = {
  currentUser: null,
};

const userReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.SET_CURRENT_USER:
      return { ...state, currentUser: payload };
    default:
      throw new Error(`Unhandled type ${type} in userReducer`);
  }
};

export const UserProvider = ({ children }) => {
  const [{ currentUser }, dispatch] = useReducer(userReducer, INITIAL_STATE);

  const setCurrentUser = (user) =>
    dispatch({ type: USER_ACTION_TYPES.SET_CURRENT_USER, payload: user});


  const handleUserStatus = (user) => {
    if (user) {
      const userStatusRef = ref(database, `status/${user.uid}`);

      const isOfflineForDatabase = {
        state: 'offline',
        last_changed: new Date().getTime(),
        displayName: user.displayName
      };

      const isOnlineForDatabase = {
        state: 'online',
        last_changed: new Date().getTime(),
        displayName: user.displayName
      };

      onValue(ref(database, '.info/connected'), (snapshot) => {
        if (snapshot.val() === false) {
          return;
        }

        onDisconnect(userStatusRef).set(isOfflineForDatabase).then(() => {
          set(userStatusRef, isOnlineForDatabase);
        });
      });
    }
  };

  const logoutUser = async () => {
    if (currentUser) {
      const userStatusRef = ref(database, `status/${currentUser.uid}`);
      const isOfflineForDatabase = {
        state: 'offline',
        last_changed: new Date().getTime(),
        displayName: currentUser.displayName
      };
      await set(userStatusRef, isOfflineForDatabase);
      await logOutUser();
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user) {
        createUserDocumentFromAuth(user);
        handleUserStatus(user);
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  console.log(currentUser);

  const value = {
    currentUser,
    logoutUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};