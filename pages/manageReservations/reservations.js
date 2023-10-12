import {API_URL} from "../../settings.js";
import {handleHttpErrors, makeOptions, sanitizeStringWithTableRows,} from "../../utils.js";
const url = API_URL+"/reservations";

let reservationList = [];

export function initReservations(){
    fetchReservations()
    document.getElementById("phone-search-btn").addEventListener("click", createReservationTable)
    document.getElementById("reset-search-btn").addEventListener("click", resetSearch)
}


async function createReservationTable(){
    const filteredList = filterByPhone()
    try{
        const tableData = await Promise.all(filteredList.map(async (reservation) => {
            let movie, showing;
            try{
                showing = await fetch(API_URL+"/showings/"+reservation.showingId).then(handleHttpErrors);
                movie = await fetch(API_URL+"/movies/"+showing.movieId).then(handleHttpErrors);
    }catch(error){
        console.error(error)
    }
        const theaterId = reservation.seats[0].theaterId;
        const seatPositions = reservation.seats.map(seat => `Row ${seat.rowNumber}, Seat ${seat.seatNumber}`).join(',\n ');

        return `<tr>
                <td><p>${reservation.customerInfo.phoneNumber}</p></td>
                <td><p>${reservation.customerInfo.firstName} ${reservation.customerInfo.lastName}</p></td>
                <td><p>${reservation.id}</p></td>
                <td><p>${movie.Title}</p></td>
                <td><p>${showing.date}</p></td>
                <td><p>${theaterId}</p></td>
                <td><p>${seatPositions}</p></td>
                <td><button>Delete</button></td>
                </tr>`
        }))
    }catch(error){
        console.error(error)
    }

    //Need movie name, showing date,
    //Get showing with showid, and get movie from showing.movieId
    //Already have number, name, reservation id, seats, seats.theaterid 
}

async function fetchReservations(){
    try{
        const reservationData = await fetch(url, makeOptions("GET", null, true)).then(handleHttpErrors);
        reservationList = reservationData;
    }catch(error){
        console.error(error);
    }
}

// async function fetchShowing(showId){
//     try {
//         const data = await fetch(API_URL+"/showings/"+showId).then(handleHttpErrors);
//         return data;
//     } catch (error) {
//         console.error(error)
//     }
// }

// async function fetchMovie(movieId){
//     try {
//         const data = await fetch(API_URL+"/movies/"+movieId).then(handleHttpErrors)
//         return data;
//     } catch (error) {
//         console.error(error)
//     }
// }

function filterByPhone(){
    document.getElementById("search-prompt").innerText = "";
    const phoneNumber = document.getElementById("phonenumber-input").value;
    if(!phoneNumber){
        resetSearch();
    }
    const filteredReservations = reservationList.filter(reservation => phoneNumber === reservation.customerInfo.phoneNumber);
    return filteredReservations;
}

function resetSearch(){
    document.getElementById("search-prompt").innerText = "Search for a phone number to find reservations"
    document.getElementById("phonenumber-input").value = "";
}