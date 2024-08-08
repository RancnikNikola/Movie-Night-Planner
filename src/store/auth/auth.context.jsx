// AuthContext.js
import { createContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../utils/firebase.utils';
import { setDoc, doc, updateDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  onlineUsers: [],
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, loading: false, onlineUsers: [] };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeOnlineUsers;

    const handleAuthStateChanged = async (user) => {
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
        await setDoc(doc(db, 'users', user.uid), { online: true }, { merge: true });

        const usersCollectionRef = collection(db, 'users');
        const onlineUsersQuery = query(usersCollectionRef, where('online', '==', true));

        unsubscribeOnlineUsers = onSnapshot(onlineUsersQuery, (snapshot) => {
          const usersList = snapshot.docs
            .filter(doc => doc.id !== user.uid)
            .map(doc => ({ id: doc.id, ...doc.data() }));
          dispatch({ type: 'SET_ONLINE_USERS', payload: usersList });
        }, (error) => {
          console.error("Error fetching users: ", error);
        });
      } else {
        dispatch({ type: 'LOGOUT' });
        if (unsubscribeOnlineUsers) unsubscribeOnlineUsers();
      }
    };

    unsubscribeAuth = onAuthStateChanged(auth, handleAuthStateChanged);

    return () => {
      if (state.user) {
        updateDoc(doc(db, 'users', state.user.uid), { online: false });
      }
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeOnlineUsers) unsubscribeOnlineUsers();
    };
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
