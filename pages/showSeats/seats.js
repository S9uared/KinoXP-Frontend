import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
import {getShowingId} from "../program/program.js"
const url = API_URL + "/seats"
const reserveSeatList = {}
const seatsInTheater = {}

export function initMovieSeats(){
    //Get showingId - Get customer info? Or save that for addBooking page?
    const seatBox = document.getElementById("seats-outerbox")
    getTheaterSetup(getShowingId())
    const theaterSetup = createSeatVisual()

    seatBox.addEventListener("click", UpdateSeatList)
    seatBox.innerHTML = theaterSetup
}

function createSeatVisual(){
    //go through list of seats. Maybe sort it first. Create divs with different ids. Return this long div string at the end. 
}

function getTheaterSetup(showId){
    const showing = fetchShow(showId)
    fetchSeatsInTheater(showing.theaterId)
}

async function fetchShow(showId){
    let showUrl = API_URL + "/" +showId;
    let showing = await fetch(showUrl).then(handleHttpErrors)
    return showing;
}

async function fetchSeatsInTheater(theaterId){
    const tempUrl = url + "/theater/"+theaterId
    seatsInTheater = await fetch(tempUrl).handleHttpErrors;
}


function UpdateSeatList(event){
    const clickedSeat = event.target;
    if(clickedSeat.style.backgroundColor === red){
        console.log("Seat already reserved, sorry")
    }
    if(clickedSeat.style.backgroundColor === green){
        reserveSeatList.add(clickedSeat.id);
        clickedSeat.style.color = blue;
    }
    if(clickedSeat.style.backgroundColor === blue){
        reserveSeatList.remove(clickedSeat.id);
        clickedSeat.style.color = red;
    }
}

export function getSeatList(){
    return reserveSeatList;
}




