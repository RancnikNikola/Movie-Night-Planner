import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function NotificationModal({ notification, onResponse }) {
  const handleAccept = () => onResponse(notification.id, 'accepted');
  const handleDecline = () => onResponse(notification.id, 'declined');

  return (
    <Modal
      isOpen={true}
      onRequestClose={handleDecline}
      contentLabel="Notification Modal"
    >
      <h2>{notification.eventName}</h2>
      <p>{notification.sender} invited you to a movie night on {notification.eventDate}</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
    </Modal>
  );
}

export default NotificationModal;
