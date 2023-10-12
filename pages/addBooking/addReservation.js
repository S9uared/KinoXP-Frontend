import { handleHttpErrors, makeOptions } from "../../utils.js";
import { API_URL } from "../../settings.js";

let showingId = 2;
let seatList;

export function initReservation(showingIdIn) {
  showingId = showingIdIn;
  document
    .getElementById("make-reservation-btn")
    .addEventListener("click", makeReservation);

  seatList = getSeatList();
  //console.log(seatList);
}

async function makeReservation() {
  const reservation = {
    showingId: showingId,
    seatIds: seatList,
  };
  collectCustomerInfo(reservation);

  const reservationUrl = API_URL + "/reservations";
  const options = makeOptions("POST", reservation);
  await fetch(reservationUrl, options).then(handleHttpErrors);
}

function collectCustomerInfo(reservation) {
  reservation.firstName = document.getElementById("firstName").value;
  reservation.lastName = document.getElementById("lastName").value;
  reservation.phoneNumber = document.getElementById("phone").value;
  reservation.email = document.getElementById("email").value;
}
