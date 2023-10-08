import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
//import {getShowingId} from "../program/program.js"
const url = API_URL + "/seats"
const seatsInTheater = []
const redSeatsInTheater = []
const reserveSeatList = []
let seatOuterBox;
const theater = {
    id : 1,
    rows : 10,
    seatsPerRow: 10
}


export function getSeatList(){
    return reserveSeatList;
}

//Works with template objects as data right now. Need to figure out fetch and why the data returned does not work as intended

export function initMovieSeats(){
    //Get showingId - Get customer info? Or save that for addBooking page?
    seatOuterBox = document.getElementById("seats-outerbox")
    seatOuterBox.addEventListener("click", UpdateSeatList)
    window.addEventListener('unhandledrejection', function (event) {
        console.error('Unhandled promise rejection:', event.reason);
    });
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById(402).style.backgroundColor = "rgb(255, 0, 0)";
    });
    
    //getTheaterSetup(getShowingId()) //Add  later
    fetchTheater(1) //This line is instead of function above. Remove when showings can be fetched
    setupSeats()
    findOccupiedSeats(1)//add showingID parameter to fetch
    
}

async function findOccupiedSeats(showingId){ //Add showingId parameter to fetch
    // const resUrl = API_URL+"/reservations/showing/"+showingId
    // const data = await fetch(resUrl).then(handleHttpErrors)
    // if(data instanceof Array && data.length>0){
    //     redSeatsInTheater.map(seat => document.getElementById(seat.id).style.backgroundColor = "rgb(255, 0, 0)")
    // }
    // else if(data instanceof Object){
        
    //     console.log("Only one seat found")
    // }
    // else{
    //     console.log("No reserved seats for this showing yet")
    // }
    //document.getElementById(402).style.backgroundColor = "rgb(255, 0, 0)";
}

function setupSeats(){
    //Assuming each seat needs a 20px width/height box, and a little extra for space between seats.
    //Adjust accordingly
    const boxWidth = 7+`${theater.seatsPerRow}px`;
    const boxHeight = 8+`${theater.rows}px`;
    seatOuterBox.style.width = boxWidth;
    seatOuterBox.style.height = boxHeight;

    const boxColumns = `repeat(${theater.seatsPerRow}, 1fr)`; 
    const boxRows = `repeat(${theater.rows}, 1fr)`;
    seatOuterBox.style.gridTemplateColumns = "repeat(16, 1fr)";
    seatOuterBox.style.gridTemplateRows = "repeat(25, 1fr)";

    fetchSeatsInTheater(1)

    
     //theater.id sættes ind her - 1 er som test data
    
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
    theater.id = data.id
    theater.rows = data.rows
    theater.seatsPerRow = data.seatsPerRow
    console.log(theater);
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




