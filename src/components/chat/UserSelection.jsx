import React, { useContext } from 'react';
import useUserStatuses from '../../hooks/useUserStatus';
import { ChatContext } from '../../store/chatContext/ChatContext';
import { UserContext } from '../../store/userContext/UserContext';
import './user-selection.css';

const UserSelection = () => {
  const userCtx = useContext(UserContext);
  const { chats, selectChat } = useContext(ChatContext);

  const startChat = (userId) => {
    const chatId = [userCtx.currentUser.uid, userId].sort().join('_');
    selectChat(chatId);
  };

  // const currentOnlineUsers = Object.entries(userStatuses)
  //   .filter(([userId, status]) => status.state === 'online' && userId !== currentUser.uid);

  const getUnreadCount = (chatId) => {
    return chats[chatId]?.messages.filter(msg => !msg.isRead && msg.senderId !== userCtx.currentUser.uid).length || 0;
  };

  // console.log('USER SELECTION', userCtx.onlineUsers);

  return (
    <div>
      <h3>Select a User to Chat</h3>
      <ul>
        {userCtx.onlineUsers.map(([userId, status]) => {
          const chatId = [currentUser.uid, userId].sort().join('_');
          const unreadCount = getUnreadCount(chatId);
          return (
            <li key={userId} onClick={() => startChat(userId)} className="user-selection-item">
              {status.displayName || 'Unknown User'}
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserSelection;
