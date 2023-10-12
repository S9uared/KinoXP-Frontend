import { API_URL } from "../../settings.js";
import {
  handleHttpErrors,
  sanitizeStringWithTableRows,
  makeOptions,
} from "../../utils.js";
const URL_SHOWINGS = API_URL + "/showings";
const URL_MOVIES = API_URL + "/movies";

export async function initEmpProgram() {
  renderShowings();
}

async function getAndRenderShowings() {
  try {
    const showingsFromServer = await fetch(
      URL_SHOWINGS,
      makeOptions("GET", false, false)
    ).then(handleHttpErrors);
    renderAllData(showingsFromServer);
  } catch (err) {
    console.error("Could not fetch showings from server: " + err);
  }
}

async function renderShowings() {
  let showingIds = [];
  try {
    const showings = await fetch(
      URL_SHOWINGS,
      makeOptions("GET", null, false)
    ).then(handleHttpErrors);
    const movies = await fetch(
      URL_MOVIES,
      makeOptions("GET", false, false)
    ).then(handleHttpErrors);

    const showingDivs = showings
      .map((showing) => {
        showingIds.push(showing.id);
        let checked = " ";
        if (showing.type === "PREMIERE") {
          checked = "checked";
        }
        return `<div class="showing-box" id=showing_${showing.id}>
            <h2>Showing</h2>
            <p>Movie</p>
            <select class="showing-input" id="movie_${showing.id}" value="${
          showing.movie.Title
        }">
            ${generateMovieSelect(movies, showing.movie.id)}
            </select>
            <p>Present Date ${showing.date}</p>
            <input class="showing-input" id="date_${showing.id}" type="date" >
            <p>Time</p>
            <input class="showing-input" id="time_${
              showing.id
            }" type="time" value="${showing.time}">
            <p>Theatre</p>
            <input class="showing-input" id="theatre_${
              showing.id
            }" type="number" value="${showing.theaterId}">
            <p>Cleaning Time</p>
            <input class="showing-input" id="cleaning_${
              showing.id
            }" type="number"><br><br>
            <label for="premiere_${showing.id}">Premiere</label>
            <input class="showing-input" id="premiere_${
              showing.id
            }" type="checkbox" ${checked}>
            <br><br>
            <button class="showing-edit-btn" id="showing-btn_${
              showing.id
            }">Submit changes</button>
        </div>`;
      })
      .join("");

    document.getElementById("showings-outerbox").innerHTML = showingDivs;
    showingIds.forEach((id) => {
      document
        .getElementById("showing-btn_" + id)
        .addEventListener("click", editShowing);
      document
        .getElementById("premiere_" + id)
        .addEventListener("change", toggleCheckBox);
    });
  } catch (err) {
    console.error(err);
  }
}

async function editShowing(evt) {
  const clicked = evt.target;
  if (!clicked.id.includes("showing-btn_")) {
    return;
  }

  const showingId = clicked.id.replace("showing-btn_", "");
  const movieId = document.getElementById("movie_" + showingId).value;
  console.log(movieId);
  const date = document.getElementById("date_" + showingId).value;
  const time = document.getElementById("time_" + showingId).value;
  const isPremiere = document.getElementById("premiere_" + showingId).checked;
  console.log(isPremiere);
  const theaterId = document.getElementById("theatre_" + showingId).value;
  const cleaningTime = document.getElementById("cleaning_" + showingId).value;

  const editShowing = {
    date: formatDate(date),
    time: time,
    premiere: isPremiere,
    movieId: movieId,
    theaterId: theaterId,
    cleaningTime: cleaningTime,
  };

  if (window.confirm("TESTING")) {
    const editResponse = await fetch(
      URL_SHOWINGS + "/" + showingId,
      makeOptions("PUT", editShowing, true)
    ).then(handleHttpErrors);
    alert(editResponse);
  }
  renderShowings();
}

function formatDate(inputDate) {
  const [year, month, day] = inputDate.split("-");
  return `${day}-${month}-${year}`;
}

function toggleCheckBox(evt) {
  const clicked = evt.target;
  if (!clicked.id.includes("premiere_")) {
    return;
  }

  const showingId = clicked.id.replace("premiere_", "");
  let check = document.getElementById("premiere_" + showingId).checked;
  console.log(check);
  if (check === true) {
    check = false;
  } else {
    check = true;
  }
}

function generateMovieSelect(movies, selectedMovieId) {
  const movieSelect = movies
    .map((movie) => {
      const selected = movie.id === selectedMovieId ? "selected" : "";
      return `<option value="${movie.id}" ${selected}>${movie.Title}</option>`;
    })
    .join("\n");

  return movieSelect;
}
