

import Header from '../../components/header/header.component';
import CreateMovieNight from '../../components/create-movie-night/createMovieNight.component';
import OnlineUsers from '../../components/onlline-users/onlineUsers.component';

import './home.css';

export default function Home() {

    return (
        <section className="home">
            <aside className="home__parallax">
                <h1>home parallax</h1>
            </aside>
            <div className="home__content">
                <Header />
                <CreateMovieNight />
                <OnlineUsers />
            </div>
            <div className="chat">
            </div>
        </section>
    )
}