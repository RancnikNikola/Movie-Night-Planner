import { useEffect, useContext, useState } from "react";
import { db } from "../../utils/firebase";
import { UserContext } from "../../store/userContext/UserContext";
import { MovieNightsContext } from "../../store/movieNights/MovieNightsCtx";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import NotificationModal from "../notification-modal/NotificationModal";

export default function NotificationHandler() {
  const userCtx = useContext(UserContext);
  const movieNightsCtx = useContext(MovieNightsContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userCtx.currentUser) return;

    const notificationsRef = collection(db, `users/${userCtx.currentUser.uid}/notifications`);
    const q = query(notificationsRef, where("status", "==", "pending"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications = [];
      querySnapshot.forEach((doc) => {
        newNotifications.push({ id: doc.id, ...doc.data() });
      });
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [userCtx.currentUser]);

  const handleResponse = async (notificationId, response) => {
    const notificationRef = doc(db, `users/${userCtx.currentUser.uid}/notifications`, notificationId);
    await updateDoc(notificationRef, { status: response });

    if (response === 'accepted') {
      await movieNightsCtx.updateEventParticipants(notificationId, userCtx.currentUser.uid, 'accepted');
    } else if (response === 'declined') {
      await movieNightsCtx.updateEventParticipants(notificationId, userCtx.currentUser.uid, 'declined');
    }
  };

  return (
    <>
      {notifications.map(notification => (
        <NotificationModal 
          key={notification.id} 
          notification={notification} 
          onResponse={handleResponse} 
        />
      ))}
    </>
  );
}
