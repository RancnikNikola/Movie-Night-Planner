<section className="movie__details__container">
<h1>{movie && movie.title}</h1>
<div className="movie__header">
  
   
</div>
<div className="movie__body">
    {/* <img src={`https://image.tmdb.org/t/p/w200${movie && movie.poster_path}`} alt={movie && movie.title} /> */}
    <div className="movie__body__overview">
    <div id="actorsModal"></div>
    <ul className="about__movie">
        <li>
            {/* {movie && movie.genres.map((genre) => (
                <span key={genre.id}>{genre.name}</span>
            ))} */}
        </li>
        <li>
            {/* <span>{movie && movie.runtime} min</span> */}
            {/* <span>{movie && movie.vote_average}</span> */}
            {/* <span>Release date: {movie && movie.release_date}</span> */}
        </li>
        <li>
            {movie && movie.spoken_languages.map((language) => (
                    <span key={language.name}>{language.name}</span>
                ))}
        </li>
    </ul>
        <h2>Overview</h2>
        {/* <p>{movie && movie.overview}</p> */}
        {/* <p>{movie && movie.tagline}</p> */}
        <MovieActors movieId={movieId} />
    </div>
</div>
</section>