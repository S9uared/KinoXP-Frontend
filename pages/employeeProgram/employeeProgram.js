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
            <h2>Showing ${showing.id}</h2>
            <label for="movie_${showing.id}">Movie</label>
            <select class="showing-input" id="movie_${showing.id}" value="${
          showing.movie.Title
        }">
            ${generateMovieSelect(movies, showing.movie.id)}
            </select>
            <label for="date_${showing.id}">Present Date ${showing.date}</label>
            <input class="showing-input" id="date_${
              showing.id
            }" type="date" >          
            <label for="time_${showing.id}">Time</label>
            <input class="showing-input" id="time_${
              showing.id
            }" type="time" value="${showing.time}">
            <label for="theatre_${showing.id}">Theatre</label>
            <input class="showing-input" id="theatre_${
              showing.id
            }" type="number" value="${showing.theaterId}">
            <label for="cleaning_${showing.id}">Cleaning Time</label>
            <input class="showing-input" id="cleaning_${
              showing.id
            }" type="number">
            <label for="ending-time">Ending Time</label>
            <p class="showing-input" id="ending-time">${showing.endingTime}</p>
            <div>
            <label for="premiere_${showing.id}">Premiere</label>
            <input class="showing-input" id="premiere_${
              showing.id
            }" type="checkbox" ${checked}>
            </div>
            <br><br>
            <p id="error_${showing.id}"></p>
            <div class="manage-showing-btn">
            <button class="showing-edit-btn" id="showing-btn_${
              showing.id
            }">Submit changes</button>
            <button class="showing-delete-btn" id="showing-delete-btn_${
              showing.id
            }">Delete</button>
            </div>
        </div>`;
      })
      .join("");

    document.getElementById("showings-outerbox").innerHTML =
      getAddShowingBox(movies) + showingDivs;
    document
      .getElementById("add-showing-btn")
      .addEventListener("click", addShowing);
    showingIds.forEach((id) => {
      document
        .getElementById("showing-btn_" + id)
        .addEventListener("click", editShowing);
      document
        .getElementById("showing-delete-btn_" + id)
        .addEventListener("click", deleteShowing);
      document
        .getElementById("premiere_" + id)
        .addEventListener("change", toggleCheckBox);
    });
  } catch (err) {
    alert(err.message);
  }
}

async function deleteShowing(evt) {
  const clicked = evt.target;
  if (!clicked.id.includes("showing-delete-btn_")) {
    return;
  }

  const showingId = clicked.id.replace("showing-delete-btn_", "");

  if (window.confirm(`Are you sure you want to delete showing ${showingId}?`)) {
    const response = await fetch(
      URL_SHOWINGS + "/" + showingId,
      makeOptions("DELETE", false, true)
    );
    if (response.ok) {
      // Successful deletion, you can handle it here
      renderShowings();
    } else {
      // Handle non-successful response (e.g., error message from the server)
      const errorData = await response.json();
      document.getElementById("error_" + showingId).innerText =
        errorData.message;
    }
  }
}

async function addShowing() {
  const movieId = document.getElementById("add-showing-movie").value;
  const date = document.getElementById("add-showing-date").value;
  const time = document.getElementById("add-showing-time").value;
  const isPremiere = document.getElementById("add-showing-premiere").checked;
  const theaterId = document.getElementById("add-showing-theatre").value;
  const cleaningTime = document.getElementById("add-showing-cleaning").value;

  const addShowing = {
    date: formatDate(date),
    time: time,
    premiere: isPremiere,
    movieId: movieId,
    theaterId: theaterId,
    cleaningTime: cleaningTime,
  };

  try {
    await fetch(URL_SHOWINGS, makeOptions("POST", addShowing, true)).then(
      handleHttpErrors
    );
    renderShowings();
  } catch (err) {
    document.getElementById("add-showing-error").innerText = err.message;
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

  if (window.confirm("Are you sure you want to go through with the action?")) {
    try {
      await fetch(
        URL_SHOWINGS + "/" + showingId,
        makeOptions("PUT", editShowing, true)
      ).then(handleHttpErrors);
      renderShowings();
    } catch (err) {
      document.getElementById("error_" + showingId).innerText = err.message;
    }
  }
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
  if (selectedMovieId == null) {
    selectedMovieId = 0;
  }
  const movieSelect = movies
    .map((movie) => {
      const selected = movie.id === selectedMovieId ? "selected" : "";
      return `<option value="${movie.id}" ${selected}>${movie.Title}</option>`;
    })
    .join("\n");

  return movieSelect;
}

function getAddShowingBox(movies) {
  const addShowingBox = `<div class="showing-box" id="add-showing-box">
  <h2>Add Showing</h2>
  <label for="add-showing-movie">Movie</label>
  <select class="showing-input" id="add-showing-movie">
    ${generateMovieSelect(movies)}
  </select>
  <label for="add-showing-date">Date</label>
  <input class="showing-input" id="add-showing-date" type="date" />
  <label for="add-showing-time">Time</label>
  <input class="showing-input" id="add-showing-time" type="time" />
  <label for="add-showing-theatre">Theatre</label>
  <input class="showing-input" id="add-showing-theatre" type="number" />
  <label for="add-showing-cleaning">Cleaning Time</label>
  <input class="showing-input" id="add-showing-cleaning" type="number" />
  <div>
    <label for="add-showing-premiere">Premiere</label>
    <input class="showing-input" id="add-showing-premiere" type="checkbox"/>
  </div>
  <br /><br />
  <p id="add-showing-error"></p>
  <button class="showing-add-btn" id="add-showing-btn">Add</button>
</div>`;
  return addShowingBox;
}
