import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
//import {getShowingId} from "../program/program.js"
const url = API_URL + "/seats"
const reserveSeatList = {}
const seatsInTheater = {}
let theater;

export function initMovieSeats(){
    //Get showingId - Get customer info? Or save that for addBooking page?
    const seatOuterBox = document.getElementById("seats-outerbox")
    seatOuterBox.addEventListener("click", UpdateSeatList)
    //getTheaterSetup(getShowingId())

    setupSeatOuterBox(theater.rows, theater.seatsPerRow)
    seatOuterBox.innerHTML = createSeatVisual()
}

function createSeatVisual(){
    const seatVisual = seatsInTheater.map(seat => `<div class="seat-div" id=${seat.id}></div>`).join("")
    return seatVisual;
    //go through list of seats. Maybe sort it first. Create divs with different ids. Return this long div string at the end. 
}

function setupSeatOuterBox(rows, seatsPerRow){
    //Assuming each seat needs a 20px width/height box, and a little extra for space between seats.
    //Adjust accordingly
    const boxWidth = (seatsPerRow*20)+50+"px";
    const boxHeight = (rows*20)+50+"px";
    seatOuterBox.style.width = boxWidth;
    seatOuterBox.style.height = boxHeight;
    const boxColumns = "repeat("+seatsPerRow+", 100px)";
    const boxRows = "repeat("+rows+", 100px)";
    seatOuterBox.style.gridTemplateColumns = boxColumns;
    seatOuterBox.style.gridTemplateRows = boxRows;
}  


function getTheaterSetup(showId){
    const showing = fetchShow(showId)
    fetchTheater(showing.theaterId)
    fetchSeatsInTheater(showing.theaterId)
}

async function fetchShow(showId){
    let showUrl = API_URL + "/" +showId;
    let showing = await fetch(showUrl).then(handleHttpErrors)
    return showing;
}

async function fetchTheater(theaterId){
    const theaterUrl = API_URL + "/theaters/"+theaterId
    theater = await fetch(theaterUrl).then(handleHttpErrors)
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




