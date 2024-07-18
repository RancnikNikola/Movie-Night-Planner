import { useContext, useEffect, useMemo } from 'react';
import useUserStatuses from '../../hooks/useUserStatus';
import OnlineUser from '../onlineUser/OnlineUser';
import useUserDetails from '../../hooks/useUserDetails';
import { UserContext } from '../../store/userContext/UserContext';
import { ChatContext } from '../../store/chatContext/ChatContext';

const OnlineUsers = () => {

  const userCtx = useContext(UserContext);

  useEffect(() => {
    userCtx.fetchOnlineUsers();
  }, []);

  console.log('ONLINE USERS');

  const onlineUsersExcludingCurrentUser = userCtx.onlineUsers.filter(
    (onlineUser) => onlineUser.id !== userCtx.currentUser?.uid
  );


  return (
    <div key={userCtx.currentUser}>
      <h3>Online Users</h3>
       {
        onlineUsersExcludingCurrentUser.map((onlineUser) => (
          <OnlineUser key={onlineUser.uid} onlineUser={onlineUser} />
        ))
       }
    </div>
  );
};

export default OnlineUsers;
