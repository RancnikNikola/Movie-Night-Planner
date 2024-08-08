import { createContext, useReducer, useEffect, useContext } from 'react';
import { ref, onValue, push, off, get, update } from 'firebase/database';
import { database, db } from '../../utils/firebase.utils';
import AuthContext from '../auth/auth.context';
import { collection, getDocs } from 'firebase/firestore';

const ChatContext = createContext();

const initialState = {
  messages: [],
  loading: true,
  selectedUser: null,
  unreadCounts: {}, // Track unread message counts
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, loading: false };
    case 'SEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_SELECTED_USER':
      // Clear notification for the selected user
      const newUnreadCounts = { ...state.unreadCounts };
      delete newUnreadCounts[action.payload.id]; // Remove notification for opened chat

      return {
        ...state,
        selectedUser: action.payload,
        messages: [],
        loading: true,
        unreadCounts: newUnreadCounts,
      };
    case 'CLOSE_CHAT':
      // Handle closing chat
      return {
        ...state,
        selectedUser: null,
        messages: [],
        loading: true,
      };
    case 'SET_UNREAD_COUNTS':
      return { ...state, unreadCounts: action.payload };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const { state: authState } = useContext(AuthContext);
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    if (!authState.user) return;

    // Fetch and listen for unread message counts
    const fetchUnreadCounts = async () => {
      const usersCollectionRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollectionRef);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const newUnreadCounts = {};

      usersList.forEach(user => {
        if (user.id === authState.user.uid) return;

        const chatId = [authState.user.uid, user.id].sort().join('_');
        const messagesRef = ref(database, `chats/${chatId}/messages`);

        onValue(messagesRef, (snapshot) => {
          let unreadCount = 0;
          snapshot.forEach((childSnapshot) => {
            const message = { id: childSnapshot.key, ...childSnapshot.val() };
            if (message.senderId !== authState.user.uid && !message.seen) {
              unreadCount++;
            }
          });

          if (unreadCount > 0) {
            newUnreadCounts[user.id] = unreadCount;
          } else {
            delete newUnreadCounts[user.id];
          }

          dispatch({ type: 'SET_UNREAD_COUNTS', payload: newUnreadCounts });
        });
      });
    };

    fetchUnreadCounts();

    return () => {
      // Cleanup
      Object.keys(state.unreadCounts).forEach(userId => {
        const chatId = [authState.user.uid, userId].sort().join('_');
        const messagesRef = ref(database, `chats/${chatId}/messages`);
        off(messagesRef);
      });
    };
  }, [authState.user]);

  useEffect(() => {
    if (!state.selectedUser || !authState.user) return;

    const chatId = [authState.user.uid, state.selectedUser.id].sort().join('_');
    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const handleNewMessages = (snapshot) => {
      const messagesList = [];
      snapshot.forEach((childSnapshot) => {
        messagesList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      dispatch({ type: 'SET_MESSAGES', payload: messagesList });
    };

    onValue(messagesRef, handleNewMessages);

    return () => {
      off(messagesRef, 'value', handleNewMessages);
    };
  }, [state.selectedUser, authState.user]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;