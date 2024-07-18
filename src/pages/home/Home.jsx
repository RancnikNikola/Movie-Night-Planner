
import Header from '../../components/header/Header';
import CreateOrJoinMN from '../../components/createOrJoinMN/CreateOrJoinMN';
import UpcomingMovieNights from '../../components/upcomingMovieNights/UpcomingMovieNights';
import NewEvent from '../../components/NewEvent/NewEvent';
import CheckActors from '../../components/checkActors/CheckActors';
import OnlineUsers from '../../components/onlineUsers/OnlineUsers';
import './home.css';
import ChatComponent from '../../components/chat/Chat';
import UserSelection from '../../components/chat/UserSelection';

export default function Home() {
    return (
        <>
        <Header />
        <CreateOrJoinMN />
        {/* <UpcomingMovieNights /> */}
        <NewEvent />
        <CheckActors />
        <ChatComponent />
        <OnlineUsers />
        {/* <UserSelection /> */}
        </>
    )
}