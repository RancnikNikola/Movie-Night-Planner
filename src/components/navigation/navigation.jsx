import { useState } from 'react';
import { IoMenuSharp } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import TapeLogo from '../../assets/Movie-tape.png';
import ProfileImg from '../../assets/profile-img.jpg';

import './navigation.css';
import { logOutUser } from '../../utils/firebase';

function Navigation() {
    const [ isOpen, setIsOpen ] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = async () => {
        await logOutUser();
    }

    return (
        <nav className="navbar">
            <div className="menu__icon" onClick={toggleNav}>
                <IoMenuSharp />
            </div>
            <ul className={isOpen ? 'nav__links active' : 'nav__links'}>
                <div className="nav__left">
                    <li><NavLink to='/' className={({ isActive }) => isActive ? 'active__link' : undefined }>Home</NavLink></li>
                    <li><NavLink to='/movie-nights' className={({ isActive }) => isActive ? 'active__link' : undefined }>Movie Nights</NavLink></li>
                    <li><NavLink to='/movies' className={({ isActive }) => isActive ? 'active__link' : undefined }>Movies</NavLink></li>
                    <li><NavLink to='/register' className={({ isActive }) => isActive ? 'active__link' : undefined }>Register</NavLink></li>
                    <li><NavLink to='/login' className={({ isActive }) => isActive ? 'active__link' : undefined }>Login</NavLink></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </div>
                <li className="navbar__logo">
                    <img src={TapeLogo} alt="Movie tape logo" />
                </li>
               <div className="nav__right">
                    <li>
                        <Link>
                            <img src={ProfileImg} alt="Profile image" className="profile__img"/>
                        </Link>
                    </li>
               </div>
            </ul>
        </nav>
    )
}

export default Navigation;