import { useContext, useState, useEffect } from 'react';
import { push, ref, onValue, off, update } from 'firebase/database';
import { database } from '../../utils/firebase.utils';
import ChatContext from '../../store/chat/chat.context';
import AuthContext from '../../store/auth/auth.context';

import { IoCloseSharp } from "react-icons/io5";


import './chat.css';


const Chat = () => {
  const { state: chatState, dispatch } = useContext(ChatContext);
  const { state: authState } = useContext(AuthContext); // Ensure authState is accessed properly
  const [message, setMessage] = useState('');

  const handleCloseChat = () => {
    dispatch({ type: 'CLOSE_CHAT' });
  };

  useEffect(() => {
    if (!chatState.selectedUser || !authState.user) return;

    const chatId = [authState.user.uid, chatState.selectedUser.id].sort().join('_');
    const messagesRef = ref(database, `chats/${chatId}/messages`);

    const handleNewMessages = (snapshot) => {
      const messagesList = [];
      snapshot.forEach((childSnapshot) => {
        messagesList.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      dispatch({ type: 'SET_MESSAGES', payload: messagesList });

      const unseenMessages = messagesList.filter(
        (msg) => msg.senderId !== authState.user.uid && !msg.seen
      );
      unseenMessages.forEach((msg) => {
        const messageRef = ref(database, `chats/${chatId}/messages/${msg.id}`);
        update(messageRef, { seen: true });
      });
    };

    onValue(messagesRef, handleNewMessages);

    return () => {
      off(messagesRef, 'value', handleNewMessages);
    };
  }, [chatState.selectedUser, authState.user, dispatch]); // Add authState.user and dispatch as dependencies

  const handleSendMessage = async () => {
    if (!message.trim() || !authState.user || !chatState.selectedUser) return;

    const chatId = [authState.user.uid, chatState.selectedUser.id].sort().join('_');
    const newMessage = {
      senderId: authState.user.uid,
      text: message,
      timestamp: Date.now(),
      seen: false,
    };

    await push(ref(database, `chats/${chatId}/messages`), newMessage);
    setMessage('');
  };

  
  if (chatState.selectedUser) 

  return (
    <div className="chat__box">
      <header>
        <h2>{chatState.selectedUser.displayName}</h2>
        <button className='close__btn' onClick={handleCloseChat}><IoCloseSharp /></button>
      </header>
      <div className="chat__messages">
        {chatState.messages.map((msg) => (
          <div key={msg.id} className={`chat__message ${msg.senderId === authState.user.uid ? 'me' : ''}`}>
            <strong>{msg.senderId === authState.user.uid ? 'Me' : chatState.selectedUser.displayName}:</strong> {msg.text}
            {msg.seen && msg.senderId === authState.user.uid && <span> (Seen)</span>}
          </div>
        ))}
      </div>
      <div className="chat__input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
