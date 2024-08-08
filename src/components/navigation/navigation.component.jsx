// Navigation.js
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import ChatContext from '../../store/chat/chat.context';
import AuthContext from '../../store/auth/auth.context';

import { auth, db } from '../../utils/firebase.utils';
import { signOut } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

import { Link } from 'react-router-dom';

import Messages from '../messages/messages.component';

import { IoChatboxEllipsesSharp, IoNotifications, IoPerson, IoEllipseSharp, IoSettingsSharp, IoLogOut, IoChevronForwardSharp, IoArrowBackSharp } from "react-icons/io5";
import { BiSolidCameraMovie, BiSolidSlideshow, BiSolidHome } from "react-icons/bi";

import noUserImg from '../../assets/defaultProfileImg.png';

import './navigation.css';
import NotificationHandler from '../notification-handler/notificationHandler.component';

const Navigation = () => {
  const { state: chatState } = useContext(ChatContext);
  const { state: authState, dispatch: authDispatch } = useContext(AuthContext);

  const unreadCount = authState.user ? Object.values(chatState.unreadCounts).reduce((a, b) => a + b, 0) : 0;

  console.log(authState)

  const handleLogout = async () => {
    try {
        if (authState.user) {
            await updateDoc(doc(db, 'users', authState.user.uid), { online: false });
        }
        await signOut(auth);
        authDispatch({ type: 'LOGOUT' });
    } catch (error) {
        console.error(error);
    }
}

  return (
    <nav className="nav">
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Home
        </NavLink>
        <NavLink to="/movie-nights" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Movie Nights
        </NavLink>
        <NavLink to="/movies" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
          Movies
        </NavLink>
      </div>
      <div className="right-container">
       {
        authState.user ? (
          <>
          <Messages />
          <NotificationHandler />
        <div className="dropdown-container">
          <img src={noUserImg} alt="Profile" className="profile-image" />
          <div className="dropdown-content">
            <Link to={`/profile/${authState.user?.uid}`}>go to profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        </>
        ) : (
          <>
           <NavLink to="/register" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            register</NavLink>
            <NavLink to="/login" end className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Login</NavLink>
          </>
        )
       }
      </div>
    </nav>
  );
};

export default Navigation;