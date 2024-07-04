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
import './App.css'
import { MovieNightsProvider } from "./store/movieNights/MovieNightsCtx";
import { useContext } from "react";
import { UserContext, UserProvider } from "./store/userContext/UserContext";

// sredit na next page u new eventu da ne submita formu
// stavit potrvrdu da je event kreiran i redirectat na event
// sredit sve forme sa validacijom
// u snacks[] ako se stavi ista stvar dva ili vise puta, povecaj, dodaj za maknit snacks svaku posebno
// u movies, kad se izabere movie ima select movie botun, triba napisat tu funkcionalnost
// vidit zasto display name ne zeli uzet u register formi
// kad se logiras ili registriras napravit redirect na home page ili negdi
// stavit api i osjetljive podatke u poseban file
// na logout isto napravit redirect na login/register svejedno
// profile page i sve vezano za nju

function App() {

  const userCtx = useContext(UserContext);
  console.log(userCtx)

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
      <MovieNightsProvider>
        <RouterProvider router={router} />
      </MovieNightsProvider>
    </UserProvider>
  )
}

export default App
