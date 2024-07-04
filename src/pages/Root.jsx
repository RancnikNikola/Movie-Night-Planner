import { Outlet } from 'react-router-dom';
import Navigation from '../components/navigation/navigation';
import Footer from '../components/footer/Footer';

function RootLayout() {
    return (
        <>
        <Navigation />
        <main>
            <Outlet />
        </main>
        <Footer />
        </>
    )
}

export default RootLayout;