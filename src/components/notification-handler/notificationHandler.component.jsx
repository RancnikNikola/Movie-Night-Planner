import { useEffect, useContext, useState } from "react";
import { db } from "../../utils/firebase.utils";
import { MovieNightsContext } from "../../store/movieNights/movieNights.context";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import NotificationModal from "../notification-modal/notificationModal.component";
import AuthContext from "../../store/auth/auth.context";
import { IoNotifications } from "react-icons/io5";

import './notification-handler.css'

export default function NotificationHandler() {
  const { state } = useContext(AuthContext);
  const movieNightsCtx = useContext(MovieNightsContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null); // Tracks the clicked notification

  useEffect(() => {
    if (!state.user) return;

    const notificationsRef = collection(db, `users/${state.user.uid}/notifications`);
    const q = query(notificationsRef, where("status", "==", "pending"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications = [];
      querySnapshot.forEach((doc) => {
        newNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.length);
    });

    return () => unsubscribe();
  }, [state.user]);

  const handleResponse = async (notificationId, response) => {
    const notificationRef = doc(db, `users/${state.user.uid}/notifications`, notificationId);
    await updateDoc(notificationRef, { status: response });

    if (response === 'accepted') {
      await movieNightsCtx.updateEventParticipants(notificationId, state.user.uid, 'accepted');
    } else if (response === 'declined') {
      await movieNightsCtx.updateEventParticipants(notificationId, state.user.uid, 'declined');
    }

    setSelectedNotification(null); // Close the modal after responding
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification); // Open modal for the selected notification
  };

  return (
    <>
      <div className="dropdown-container">
        <span className="icon"><IoNotifications /></span>
        <div className="dropdown-content">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <a key={notification.id} href="#" onClick={() => handleNotificationClick(notification)}>
                {notification.eventName}
              </a>
            ))
          ) : (
            <p>No notifications</p>
          )}
        </div>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {/* Render the modal if a notification is selected */}
      {selectedNotification && (
        <NotificationModal 
          notification={selectedNotification} 
          onResponse={handleResponse} 
        />
      )}
    </>
  );
}
