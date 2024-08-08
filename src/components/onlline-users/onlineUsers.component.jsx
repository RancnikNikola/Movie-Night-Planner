// src/components/online-users/OnlineUsers.js

import React, { useContext } from 'react';
import AuthContext from '../../store/auth/auth.context';
import ChatContext from '../../store/chat/chat.context';
import { IoEllipseSharp } from 'react-icons/io5';
import noUserImg from '../../assets/defaultProfileImg.png';
import './online-users.css';

const OnlineUsers = () => {
  const { state: authState } = useContext(AuthContext);
  const { state: chatState, dispatch } = useContext(ChatContext);

  const onlineUsers = authState.onlineUsers.filter(user => user.online);

  const handleUserClick = (user) => {
    dispatch({ type: 'SET_SELECTED_USER', payload: user });
  };

  return (
    <div className="online-users-container">
      <h3>Online Users</h3>
      {onlineUsers.length > 0 ? (
        <ul className="online-users-list">
          {onlineUsers.map(user => (
            <li key={user.id} className="online-user-item" onClick={() => handleUserClick(user)}>
              <img src={user.imageUrl || noUserImg} alt={user.displayName || 'User'} className="user-avatar" />
              <div className="user-info">
                <p>{user.displayName || 'Unknown User'}</p>
                <IoEllipseSharp className="user-status-icon online" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users online</p>
      )}
    </div>
  );
};

export default OnlineUsers;
