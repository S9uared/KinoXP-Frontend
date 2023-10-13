import { API_URL } from "../../settings.js";
import {handleHttpErrors, sanitizeStringWithTableRows, makeOptions,} from "../../utils.js";
const showUrl = API_URL+"/showings"
const movieUrl = API_URL+"/movies"


  export function initFutureMovies(){
    setupMoviesWithoutShowings()
  }

  async function setupMoviesWithoutShowings(){
    try{
        const showList = await fetchShowings()
        const showMovieIds = new Set(showList.map(showing => showing.movie.id));
        const movieList = await fetchMovies()
        movieList.sort();

        const moviesNotInShow = movieList.filter(movie => !showMovieIds.has(movie.id));

        const futureMovies = moviesNotInShow.map(movie => 
        `
        <div class="showing-card" >
        <a href="https://www.imdb.com/title/${movie.imdbID}">
            <img src="${movie.Poster}" class="showing-pic">
            <div class="showing-card-content">
                <h6 class="showing-title">${movie.Title}</h6>
                <p class="showing-runtime">Year: ${movie.Year}</p>
                <p class="showing-runtime">Date: ${movie.Released}</p>
                <p class "showing-runtime">Genre: ${movie.Genre}</p>

            </div>
            </a>
        </div>
        
        `
        ).join("")
            document.getElementById("future-movie-outerbox").innerHTML = futureMovies;
    } catch(error){
        console.error(error);
    }


  }

  async function fetchShowings(){
    const showData = await fetch(showUrl).then(handleHttpErrors);
    return showData;
  }
  async function fetchMovies(){
    const movieData = await fetch(movieUrl).then(handleHttpErrors)
    return movieData;
  }

  