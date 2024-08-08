// src/components/messages-dropdown/MessagesDropdown.js

import React, { useContext } from 'react';
import ChatContext from '../../store/chat/chat.context';
import AuthContext from '../../store/auth/auth.context';
import { IoChatboxEllipsesSharp } from 'react-icons/io5';
import noUserImg from '../../assets/defaultProfileImg.png';
import './messages.css';

const Messages = () => {
  const { state: authState } = useContext(AuthContext);
  const { state: chatState, dispatch } = useContext(ChatContext);

  const unreadMessageUsers = authState.onlineUsers.filter(user => chatState.unreadCounts[user.id] > 0);

  console.log('NUREDA D', unreadMessageUsers);

  const handleUserClick = (user) => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
    dispatch({ type: 'OPEN_CHAT' });
  };

  return (
    <div className="dropdown-container">
      <span className="icon"><IoChatboxEllipsesSharp /></span>
      {unreadMessageUsers.length > 0 ? (
        <>
          <span className="notification-badge">            {unreadMessageUsers.reduce((total, user) => total + chatState.unreadCounts[user.id], 0)}
</span>
          <div className="dropdown-content">
            <h3>Messages</h3>
            {unreadMessageUsers.map((user) => (
              <div key={user.id} className="single-user" onClick={() => handleUserClick(user)}>
                <div className="single-user-info">
                  <img src={user.imageUrl || noUserImg} alt={user.displayName || 'User'} />
                  <p>{user.displayName || 'Unknown User'}</p>
                </div>
                <span className="notification-badge-user">
                  {chatState.unreadCounts[user.id]}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="dropdown-content">
          <p>No messages</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
