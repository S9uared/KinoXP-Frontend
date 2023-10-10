import { getSeatList } from '../showSeats/seats.js';

let showingId = 1;
let seatOuterBox;

export function setShowingId(id) {
    showingId = id;
}

export async function initMovieSeats() {
    seatOuterBox = document.getElementById("seats-outerbox")
    seatOuterBox.addEventListener("click", UpdateSeatList)

    try {
        console.log("Showing ID: ", showingId);

        const customerInfo = await collectCustomerInfo();
        console.log("Customer Info: ", customerInfo);

        setupSeats(showingId);//Show id add here
        const seatList = getSeatList(); 
        console.log(seatList);
    } catch (error) {
        console.error(error);
    }
}

async function collectCustomerInfo() {
    const customerFirstName = prompt ("Enter your first name");
    const customerLastName = prompt ("Enter your last name");
    const customerPhone = prompt ("Enter your email");

    return {
        customerFirstName,
        customerLastName,
        customerPhone
    }
}