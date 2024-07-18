import { createContext, useReducer, useEffect, useContext, useCallback } from 'react';
import { database } from '../../utils/firebase';
import { ref, onValue, push, update } from 'firebase/database';
import { UserContext } from '../userContext/UserContext';
import { showToastNotification } from '../../components/chat/toast';

const INITIAL_STATE = {
  chats: {},
  selectedChatId: null,
};

const CHAT_ACTION_TYPES = {
  SET_CHATS: 'SET_CHATS',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SELECT_CHAT: 'SELECT_CHAT',
  MARK_AS_READ: 'MARK_AS_READ',
};

const chatReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case CHAT_ACTION_TYPES.SET_CHATS:
      return { ...state, chats: payload };
    case CHAT_ACTION_TYPES.ADD_MESSAGE:
      const { chatId, message } = payload;
      const updatedChat = state.chats[chatId]
        ? { ...state.chats[chatId], messages: [...state.chats[chatId].messages, message] }
        : { messages: [message] };
      return { ...state, chats: { ...state.chats, [chatId]: updatedChat } };
    case CHAT_ACTION_TYPES.SELECT_CHAT:
      return { ...state, selectedChatId: payload };
    case CHAT_ACTION_TYPES.MARK_AS_READ:
      const { chatIdToMark, senderId } = payload;
      const updatedChatMessages = state.chats[chatIdToMark].messages.map(msg => {
        if (msg.senderId !== senderId && !msg.isRead) {
          return { ...msg, isRead: true };
        }
        return msg;
      });
      return { ...state, chats: { ...state.chats, [chatIdToMark]: { ...state.chats[chatIdToMark], messages: updatedChatMessages } } };
    default:
      // throw new Error(`Unhandled type ${type} in chatReducer`);
      return state;
  }
};

const ChatContext = createContext({
  chats: {},
  selectedChatId: null,
  selectChat: () => {},
  sendMessage: () => {},
  setChats: () => {},
  markAsRead: () => {},
});

const ChatProvider = ({ children }) => {
  const [{ chats, selectedChatId }, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  const { currentUser } = useContext(UserContext);

  // Mark messages as read
  const markAsRead = useCallback((chatId) => {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (!messagesData) return;

      const messagesToMark = Object.entries(messagesData)
        .filter(([key, msg]) => !msg.isRead && msg.senderId !== currentUser.uid);

      if (messagesToMark.length > 0) {
        const updates = {};
        messagesToMark.forEach(([key]) => {
          updates[`chats/${chatId}/messages/${key}/isRead`] = true;
        });
        update(ref(database), updates);
        dispatch({ type: CHAT_ACTION_TYPES.MARK_AS_READ, payload: { chatIdToMark: chatId, senderId: currentUser.uid } });
      }
    });
  }, [currentUser]);

  // Fetch and set chats
  useEffect(() => {
    const chatsRef = ref(database, 'chats');
    const unsubscribe = onValue(chatsRef, (snapshot) => {
      const chatsData = snapshot.val();
      const parsedChats = chatsData ? Object.entries(chatsData).reduce((acc, [key, value]) => {
        acc[key] = { ...value, messages: Object.entries(value.messages || {}).map(([msgKey, msgValue]) => ({ ...msgValue, key: msgKey })) };
        return acc;
      }, {}) : {};
      dispatch({ type: CHAT_ACTION_TYPES.SET_CHATS, payload: parsedChats });
    });

    return () => unsubscribe();
  }, []);

  const selectChat = useCallback((chatId) => {
    dispatch({ type: CHAT_ACTION_TYPES.SELECT_CHAT, payload: chatId });
    markAsRead(chatId); // Mark all messages as read when a chat is selected
  }, [markAsRead]);

  const sendMessage = useCallback(async (text) => {
    if (text.trim() === '' || !selectedChatId) return;

    const message = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      senderPhotoURL: currentUser.photoURL,
      text: text.trim(),
      timestamp: new Date().getTime(),
      isRead: false,
    };

    const messagesRef = ref(database, `chats/${selectedChatId}/messages`);
    await push(messagesRef, message);
  }, [selectedChatId, currentUser]);

  const value = {
    chats,
    selectedChatId,
    selectChat,
    sendMessage,
    markAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };
