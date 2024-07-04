
import Popcorn from '../../assets/popcorn.png';
import './header.css';


function Header() {
    return (
        <header>
            <div className="header__title">
                <div className="header__content">
                    <h1><span>movie night</span><span>planner</span></h1>
                    <h2>For family and friends</h2>
                </div>
                <img src={Popcorn} alt="popcorn" className='popcorn__img'/>
            </div>
        </header>
    )
}

export default Header;