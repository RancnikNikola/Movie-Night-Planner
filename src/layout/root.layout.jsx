import { Outlet } from 'react-router-dom';
import Navigation from '../components/navigation/navigation.component';
import Footer from '../components/footer/footer.component';
import Chat from '../components/chat/chat.component';

function RootLayout() {

    return (
      <>
      <Navigation />
        <main>
          <Outlet />
          <Chat />
        </main>
      <Footer />
    </>
    )
}

export default RootLayout;