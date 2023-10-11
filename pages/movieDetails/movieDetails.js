import { API_URL } from "../../settings.js";
const URL = API_URL + "/movies";
import {
  makeOptions,
  sanitizeStringWithTableRows,
  handleHttpErrors,
} from "../../utils.js";

export async function initMovieDetails(match) {
  if (match?.params?.id && match?.params?.date) {
    const id = match.params.id;
    const date = match.params.date;
    document.getElementById("movie-details").innerHTML = "";
    fetAndRenderMovie(id, date);
  }
}

const navigoRoute = "movie-details";

async function fetAndRenderMovie(idFromUrl, dateFromUrl) {
  try {
    const movie = await fetch(URL + "/" + idFromUrl).then(handleHttpErrors);

    const showingsForMovieAndDate = await fetch(
      API_URL + "/showings/" + idFromUrl + "/" + dateFromUrl
    ).then(handleHttpErrors);

    const movieStr = `
      <div class="movie-card">
        <img
        src="${movie.Poster}" 
        loading="lazy"
        class="movie-pic"
        />
        <div class="movie-card-content">
            <h6 class="movie-title">${movie.Title}</h6>          
            <p class="movie-runtime">Runtime: ${movie.Runtime}</p>
            <p class="movie-runtime">Genre: ${movie.Genre}</p>
            <p class="movie-runtime">Director: ${movie.Director}</p>
            <p class="movie-runtime">Actors: ${movie.Actors}</p>
            <p class="movie-runtime">Plot: ${movie.Plot}</p>

        </div>
      </div> 
    `;

    const showingsStr = showingsForMovieAndDate
      .map(
        (showing) => `
        <div id="showing_${showing.id}" class="showing-times">
          <p>${showing.time}</p>
        </div>
    `
      )
      .join("");

    document.getElementById("movie-details").innerHTML = movieStr;
    document.getElementById("showing-details").innerHTML = showingsStr;
  } catch (error) {
    console.error(error);
  }
}

export function getShowingId(evt) {
  const target = evt.target;
  if (!target.id.includes("showing_")) {
    return;
  }

  const showingId = target.id.replace("showing_", "");
}
