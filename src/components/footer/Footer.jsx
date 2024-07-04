
import { NavLink } from 'react-router-dom';
import FooterLogo from '../../assets/Movie-tape.png';
import './footer.css';

export default function Footer() {
  return (
    <footer>
        <ul className="footer__nav">
            <li className='footer__logo'>
                <img src={FooterLogo} alt='Movie tape' />
            </li>
            <li><NavLink>Home</NavLink></li>
            <li><NavLink>Events</NavLink></li>
            <li><NavLink>Movies</NavLink></li>
        </ul>
        <div className="about__footer">
            <p>Movie Night Planner helps you organize movie nights with friends and family. Plan, invite, and enjoy!</p>
        </div>
    </footer>
  );
}