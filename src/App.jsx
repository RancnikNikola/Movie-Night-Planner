import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import Error from "./components/error/Error";
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import MovieNights from "./pages/movieNights/MovieNights";
import MovieNightDetails from "./pages/movieNightDetails/movieNightDetails";
import Movies from "./pages/movies/Movies";
import MovieDetails from "./pages/movieDetails/MovieDetails";
import { MovieNightsProvider } from "./store/movieNights/MovieNightsCtx";
import { UserProvider } from "./store/userContext/UserContext";

import './App.css'
import { ChatProvider } from "./store/chatContext/ChatContext";

// stavit potrvrdu da je event kreiran i redirectat na event
// sredit sve forme sa validacijom
// u snacks[] ako se stavi ista stvar dva ili vise puta, povecaj, dodaj za maknit snacks svaku posebno
// u movies, kad se izabere movie ima select movie botun, triba napisat tu funkcionalnost
// profile page i sve vezano za nju

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <RootLayout />, 
    errorElement: <Error />,
    children: [
      { index: true,  element: <Home />, },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'movie-nights', element: <MovieNights />},
      { path: 'movie-nights/:movieNightId', element: <MovieNightDetails /> },
      { path: 'movies', element: <Movies /> },
      { path: 'movies/:movieId', element: <MovieDetails /> },
    ],
    }]);

  return (
      <UserProvider>
        <ChatProvider>
        <MovieNightsProvider>
          <RouterProvider router={router} />
        </MovieNightsProvider>
        </ChatProvider>
      </UserProvider>
  )
}

export default App
