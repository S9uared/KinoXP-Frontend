import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
//import {getShowingId} from "../program/program.js"
const url = API_URL + "/seats"
const reserveSeatList = []
let seatOuterBox;
let theater;
let showing; 

export function getSeatList(){
    return reserveSeatList;
}

//Works with template objects as data right now. Need to figure out fetch and why the data returned does not work as intended

export async function initMovieSeats(){
    seatOuterBox = document.getElementById("seats-outerbox")
    seatOuterBox.addEventListener("click", UpdateSeatList)
    
    //Get showingId function - Get customer info? Or save that for addBooking page?

    try{
        setupSeats(1)//Show id add here
        document.getElementById(802).style.backgroundColor = "red";
    }
    catch(error){
        console.error(error)
    }

}


async function setupSeats(showId){
    //Assuming each seat needs a 20px width/height box, and a little extra for space between seats.
    
    try{
        showing = fetchShow(showId)
        theater = await fetchTheater(1)//showing.theaterId
        fetchSeatsInTheater(showing) //give showing alongside
    }
    catch(eror){
        console.error(error)
    }
    const boxWidth = 7+`${theater.seatsPerRow}px`;
    const boxHeight = 8+`${theater.rows}px`;
    seatOuterBox.style.width = boxWidth;
    seatOuterBox.style.height = boxHeight;

    const boxColumns = theater.seatsPerRow; 
    const boxRows = theater.rows;
    seatOuterBox.style.gridTemplateColumns = "repeat("+boxColumns+", 1fr)";
    seatOuterBox.style.gridTemplateRows = "repeat("+boxRows+", 1fr)";

    

    
     //theater.id sættes ind her - 1 er som test data
    
}  

function fetchShow(showId){
    let showUrl = API_URL + "/showings/" +showId;
    const data = fetch(showUrl).then(handleHttpErrors)
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
    const theaterData = data;
    return theaterData;
}

async function fetchSeatsInTheater(showing){
    const tempUrl = url + "/theater/"+showing.theaterId
    try{
        const seatData = await fetch(tempUrl).then(handleHttpErrors);
        const reservedData = await findOccupiedSeats(showing.id);
        const reservedIds = reservedData.map(seat => seat.seatId);
        
        const seatVisual = data.map(seat => {

            const isReserved = reservedIds.includes(seat.id);
            const backgroundColor = isReserved ? `red` : `lightgreen`;

            return `<div class="seat-div" id=${seat.id} style="background-color: ${backgroundColor}"></div>`
            })
            .join("");
        
        seatOuterBox.innerHTML = seatVisual;
    }catch(error){
        console.error(error)
    }
}

async function findOccupiedSeats(showingId){ //Add showingId parameter to fetch
    const resUrl = API_URL+"/reservations/showing/"+showingId
    const occupiedSeats = await fetch(resUrl).then(handleHttpErrors);
    return occupiedSeats;
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




