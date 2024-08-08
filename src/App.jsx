
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layout/root.layout'
import Error from './pages/error/error.pages'
import Home from './pages/home/home.pages'
import Login from './pages/login/login.pages'
import Register from './pages/register/register.pages'
import { AuthProvider } from './store/auth/auth.context'
import { ChatProvider } from './store/chat/chat.context'
import { MoviesProvider } from './store/movies/movies.context'
import { MovieNightsProvider } from './store/movieNights/movieNights.context'
import Movies from './pages/movies/movies.pages'
import MovieNights from './pages/movie-nights/movieNights.pages'
import MovieNightDetails from './pages/movie-night-details/movieNightDetails.pages'
import MovieDetails from './pages/movie-details/movieDetails.pages'
import UserProfile from './pages/user-profile/userProfile.pages'

function App() {

  const router = createBrowserRouter([
    { path: '/', element: <RootLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'register',
          element: <Register />
        },
        { 
          path: 'movies', 
          element: <Movies /> 
        },
        {
          path: 'movie-nights',
          element: <MovieNights />
        },
        { 
          path: 'movie-nights/:movieNightId',
          element: <MovieNightDetails /> 
        },
        { 
          path: 'movies/:movieId', 
          element: <MovieDetails /> 
        },
        { 
          path: 'profile/:profileId', 
          element: <UserProfile /> 
        }
      ]}
  ])

  return (
    <AuthProvider>
      <ChatProvider>
        <MoviesProvider>
          <MovieNightsProvider>
            <RouterProvider router={router} />
          </MovieNightsProvider>
        </MoviesProvider>
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
