import {API_URL} from "../../settings.js";
import {handleHttpErrors, makeOptions, sanitizeStringWithTableRows,} from "../../utils.js";
const url = API_URL+"/theaters"

export function initTheaters(){
    fetchTheaters();
    document.querySelector(".theater-edit-btn").addEventListener("click", editTheater)
    document.getElementById("create-theater-btn").addEventListener("click", addTheater)
}

async function fetchTheaters(){
    try{
        const theaters = await fetch(url, makeOptions("GET", null, true)).then(handleHttpErrors)
        
        theaters.map(theater => 
            `<div class="theater-box" id=theater_${theater.id}>
                <h2>Theater ${theater.id}</h2>
                <p>Rows</p>
                <input class="theater-input" id="rows_${theater.id}" type="text" value="${theater.rows}">
                <p>Seats per row</p>
                <input class="theater-input" id="seats_${theater.id}" type="text" value="${theater.seatsPerRow}">
                <button class="theater-edit-btn">Submit changes</button>
            </div>`
        ).toList()

    } catch(error){
        console.error(error)
    }
}

async function editTheater(){

}

async function addTheater(){
    
}