import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
//import {getShowingId} from "../program/program.js"
const url = API_URL + "/seats"

const seat1 = {
    id : 1,
    row : 1,
    seat : 2
}
const seat2 = {
    id : 2,
    row : 3,
    seat : 5
}
const seatsInTheater = [seat1, seat2]
const redSeatsInTheater = [seat1]
const reserveSeatList = []
let seatOuterBox;
let theater = {
    id: 1,
    rows: 25,
    seatsPerRow: 16
};


export function getSeatList(){
    return reserveSeatList;
}

//Works with template objects as data right now. Need to figure out fetch and why the data returned does not work as intended

export function initMovieSeats(){
    //Get showingId - Get customer info? Or save that for addBooking page?
    seatOuterBox = document.getElementById("seats-outerbox")
    seatOuterBox.addEventListener("click", UpdateSeatList)
    
    
    //getTheaterSetup(getShowingId()) //Add  later
    theater = fetchTheater(1) //This line is instead of function above. Remove when showings can be fetched



    setupSeats(theater)
}

async function findOccupiedSeats(){ //Add showingId parameter to fetch
    // const resUrl = API_URL+"/reservations/showing/"+showingId
    // redSeatsInTheater = await fetch(resUrl).then(handleHttpErrors)
    
    redSeatsInTheater.map(seat => document.getElementById(seat.id).style.backgroundColor = "red")
}

function setupSeats(theater){
    //Assuming each seat needs a 20px width/height box, and a little extra for space between seats.
    //Adjust accordingly
    const boxWidth = (theater.seatsPerRow*30)+50+"px";
    const boxHeight = (theater.rows*30)+50+"px";
    seatOuterBox.style.width = boxWidth;
    seatOuterBox.style.height = boxHeight;
    const boxColumns = "repeat("+theater.seatsPerRow+", 1fr)";
    const boxRows = "repeat("+theater.rows+", 1fr)";
    seatOuterBox.style.gridTemplateColumns = boxColumns;
    seatOuterBox.style.gridTemplateRows = boxRows;

    fetchSeatsInTheater(1) //theater.id sættes ind her - 1 er som test data
    findOccupiedSeats();//add showingID parameter to fetch
}  


async function getTheaterSetup(showId){
        const showing = await fetchShow(showId)
        theater = fetchTheater(1) //Add showing.theaterId here
}

async function fetchShow(showId){
    let showUrl = API_URL + "/showings/" +showId;
    const data = await fetch(showUrl).then(handleHttpErrors)
    const showing = {
        id : data.id,
        theaterId : data.theaterId,
        movieId : data.movieId,
        date : data.date,
        time : data.time,
        type : data.type
    }
    return showing;
}

async function fetchTheater(theaterId){
    const theaterUrl = API_URL + "/theaters/"+theaterId
    const data = await fetch(theaterUrl).then(handleHttpErrors);
    const newTheater = {
        id : data.id,
        rows : data.rows,
        seatsPerRow : data.seatsPerRow
    }
    return newTheater;
}

async function fetchSeatsInTheater(theaterId){
    const tempUrl = url + "/theater/"+theaterId
    const data = await fetch(tempUrl).then(handleHttpErrors);
    const seatVisual = data.map(seat => 
        `<div class="seat-div" id=${seat.id}></div>`)
        .join("")
    seatOuterBox.innerHTML = seatVisual;
}

function UpdateSeatList(event){
    const clickedSeat = event.target;
    //Gets styles from stylesheet too
    const computedStyle = window.getComputedStyle(clickedSeat)
    if(computedStyle.backgroundColor === "rgb(255, 0, 0)"){
        console.log("Seat already reserved, sorry")
    }
    else if(computedStyle.backgroundColor === "rgb(144, 238, 144)"){
        clickedSeat.style.backgroundColor = "blue";
        reserveSeatList.push(clickedSeat.id);
    }
    else if(computedStyle.backgroundColor === "rgb(0, 0, 255)"){
        clickedSeat.style.backgroundColor = "lightgreen";
        const indexToDelete = reserveSeatList.indexOf(clickedSeat.id)
        reserveSeatList.splice(indexToDelete, 1)
    }
    reserveSeatList.sort();
    console.log(reserveSeatList)
}




