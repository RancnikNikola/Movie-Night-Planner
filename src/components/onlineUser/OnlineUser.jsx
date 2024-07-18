import { useContext } from "react";
import { ChatContext } from "../../store/chatContext/ChatContext";
import { UserContext } from "../../store/userContext/UserContext";


const OnlineUser = ({ onlineUser }) => {


    const chatCtx = useContext(ChatContext);
    const userCtx = useContext(UserContext);



    const startChat = (userId) => {
      if (!userCtx.currentUser) return;

      const chatId = [userCtx.currentUser.uid, userId].sort().join('_');
      console.log('CHAT ID', chatId);

      // if (!chatCtx.chats[chatId]) {

      // }

      chatCtx.selectChat(chatId);
    };

  
    const getUnreadCount = (chatId) => {
      return chatCtx.chats[chatId]?.messages.filter(msg => !msg.isRead && msg.senderId !== userCtx.currentUser.uid).length || 0;
    };
    
    const chatId = [userCtx.currentUser?.uid, onlineUser.id].sort().join('_');
    const unreadCount = getUnreadCount(chatId);

    return (

        <li className="user-selection-item" style={{ marginRight: '10px' }} onClick={() => startChat(onlineUser.id)}>
            <img 
              src={onlineUser.photoURL} 
              alt={`${onlineUser.displayName}'s avatar`} 
              style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
            />
            <p> {onlineUser.displayName || 'Unknown User'}</p>
            {unreadCount > 0 && <p>{`Unread messages: ${unreadCount}`}</p>}
        </li>

    );
};

export default OnlineUser;