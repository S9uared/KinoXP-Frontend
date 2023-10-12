import { API_URL } from "../../settings.js";
import {
  makeOptions,
  sanitizeStringWithTableRows,
  handleHttpErrors,
} from "../../utils.js";
import { initReservation } from "../addBooking/addReservation.js";

const URL = API_URL + "/movies";
const seatUrl = API_URL + "/seats";
let reserveSeatList = [];
let theater;
let showing;
let seatOuterBox;
let showingId;

export async function initMovieDetails(match) {
  document.getElementById("seat-div-box").style.display = "none";
  document.getElementById("modal").style.display = "none";

  document
    .getElementById("showing-details")
    .addEventListener("click", getShowingId);
  document
    .getElementById("confirm-seats-btn")
    .addEventListener(
      "click",
      () => (document.getElementById("modal").style.display = "block")
    );

  seatOuterBox = document.getElementById("seats-outerbox");
  seatOuterBox.addEventListener("click", updateSeatList);
  if (match?.params?.id && match?.params?.date) {
    const id = match.params.id;
    const date = match.params.date;
    document.getElementById("movie-details").innerHTML = "";
    document.getElementById("showing-details").innerHtml = "";
    fetAndRenderMovie(id, date);
  }
}

export function getSeatList() {
  return reserveSeatList;
}

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
            <h1 id="movie-title" class="movie-title">${movie.Title}</h6>          
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
          ${showing.time}
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

function getShowingId(evt) {
  const target = evt.target;
  if (!target.id.includes("showing_")) {
    return;
  }
  showingId = target.id.replace("showing_", "");
  setupSeats(showingId);
  document.getElementById("seat-div-box").style.display = "block";
}

//Seats.js

async function setupSeats(showId) {
  //Assuming each seat needs a 20px width/height box, and a little extra for space between seats.

  reserveSeatList = [];

  try {
    showing = await fetchShow(showId);
    theater = await fetchTheater(showing.theaterId); //showing.theaterId
    fetchSeatsInTheater(showing); //give showing alongside
  } catch (error) {
    console.error(error);
  }
  const boxWidth = 7 + `${theater.seatsPerRow}px`;
  const boxHeight = 8 + `${theater.rows}px`;
  seatOuterBox.style.width = boxWidth;
  seatOuterBox.style.height = boxHeight;

  const boxColumns = theater.seatsPerRow;
  const boxRows = theater.rows;
  seatOuterBox.style.gridTemplateColumns = "repeat(" + boxColumns + ", 1fr)";
  seatOuterBox.style.gridTemplateRows = "repeat(" + boxRows + ", 1fr)";
}

async function fetchShow(showId) {
  let showUrl = API_URL + "/showings/" + showId;
  const data = await fetch(showUrl).then(handleHttpErrors);
  const showing = data;
  return showing;
}

async function fetchTheater(theaterId) {
  const theaterUrl = API_URL + "/theaters/" + theaterId;
  const data = await fetch(theaterUrl).then(handleHttpErrors);
  const theaterData = data;
  return theaterData;
}

async function fetchSeatsInTheater(showing) {
  const tempUrl = seatUrl + "/theater/" + showing.theaterId;
  try {
    const seatData = await fetch(tempUrl).then(handleHttpErrors);
    const reservationData = await findOccupiedSeats(showing.id);
    const reservedIds = reservationData.flatMap((reservation) =>
      reservation.seats.map((seat) => seat.id)
    );

    const seatVisual = seatData
      .map((seat) => {
        const isReserved = reservedIds.includes(seat.id);
        const backgroundColor = isReserved ? `red` : `lightgreen`;

        return `<div class="seat-div" id=${seat.id} style="background-color: ${backgroundColor}"></div>`;
      })
      .join("");

    seatOuterBox.innerHTML = seatVisual;
  } catch (error) {
    console.error(error);
  }
}

async function findOccupiedSeats(showingId) {
  const resUrl = API_URL + "/reservations/showing/" + showingId;
  const occupiedSeats = await fetch(resUrl).then(handleHttpErrors);
  return occupiedSeats;
}
function updateSeatList(event) {
  const clickedSeat = event.target;
  //Gets styles from stylesheet too
  const computedStyle = window.getComputedStyle(clickedSeat);
  if (computedStyle.backgroundColor === "rgb(255, 0, 0)") {
    console.log("Seat already reserved, sorry");
  } else if (computedStyle.backgroundColor === "rgb(144, 238, 144)") {
    clickedSeat.style.backgroundColor = "blue";
    reserveSeatList.push(clickedSeat.id);
  } else if (computedStyle.backgroundColor === "rgb(0, 0, 255)") {
    clickedSeat.style.backgroundColor = "lightgreen";
    const indexToDelete = reserveSeatList.indexOf(clickedSeat.id);
    reserveSeatList.splice(indexToDelete, 1);
  }
  reserveSeatList.sort();
  console.log(reserveSeatList);
}