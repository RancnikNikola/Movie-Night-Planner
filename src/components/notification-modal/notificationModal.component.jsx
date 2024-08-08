import React from 'react';

function NotificationModal({ notification, onResponse }) {
  const handleAccept = () => {
    onResponse(notification.id, 'accepted');
  };

  const handleDecline = () => {
    onResponse(notification.id, 'declined');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{notification.eventName}</h2>
        <p>{notification.sender} invited you to a movie night on {notification.eventDate}</p>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </div>
  );
}

export default NotificationModal;
