import React from 'react';
import useUserStatuses from '../../hooks/useUserStatus';

const OnlineUsers = () => {
  const userStatuses = useUserStatuses();

  const onlineUsers = Object.entries(userStatuses).filter(
    ([_, status]) => status.state === 'online'
  );

  console.log('ONLINE USERS', onlineUsers);

  return (
    <div>
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map(([userId, status]) => (
          <li key={userId}>
            User ID: {status.displayName} - Last changed: {new Date(status.last_changed).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
