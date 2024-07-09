import { useState, useContext, useEffect } from 'react';
import { ChatContext } from '../../store/chatContext/ChatContext';
import './chat.css';

import IconChat from '../../assets/notification.256x256.png'

const ChatComponent = () => {
  const { chats, selectedChatId, sendMessage, markAsRead } = useContext(ChatContext);
  const [ messageText, setMessageText ] = useState('');

  useEffect(() => {
    if (selectedChatId) {
      markAsRead(selectedChatId);
    }

  }, [selectedChatId, markAsRead]); 

  const handleSend = () => {
    sendMessage(messageText);
    setMessageText('');
  };

  const messages = selectedChatId ? chats[selectedChatId]?.messages || [] : [];

  return (
    <div className="chat-container">
      {selectedChatId ? (
        <>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message">
                <img src={IconChat} alt={`${msg.senderName}'s avatar`} className="chat-avatar" />
                <div className="chat-message-content">
                  <strong>{msg.senderName}:</strong> {msg.text}
                </div>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message"
            className="chat-input"
          />
          <button onClick={handleSend} className="chat-send-button">Send</button>
        </>
      ) : (
        <div>Select a user to start chatting.</div>
      )}
    </div>
  );
};

export default ChatComponent;
