import {API_URL} from "../../settings.js";
import {handleHttpErrors, makeOptions, sanitizeStringWithTableRows,} from "../../utils.js";
const url = API_URL+"/theaters"

export function initTheaters(){
    fetchTheaters();
    document.getElementById("create-theater-btn").addEventListener("click", addTheater)
}

async function fetchTheaters(){
    let theaterIds = [];
    try{
        const theaters = await fetch(url, makeOptions("GET", null, true)).then(handleHttpErrors)
        const theaterDivs = theaters.map(theater => {
           theaterIds.push(theater.id);
           return `<div class="theater-box" id=theater_${theater.id}>
                <h2>Theater ${theater.id}</h2>
                <p>Rows</p>
                <input class="theater-input" id="rows_${theater.id}" type="text" value="${theater.rows}">
                <p>Seats per row</p>
                <input class="theater-input" id="seats_${theater.id}" type="text" value="${theater.seatsPerRow}">
                <br><br>
                <button class="theater-edit-btn" id="btn_${theater.id}">Submit changes</button>
            </div>`
        }).join("")
            document.getElementById("theater-outerbox").innerHTML = theaterDivs;
            for(let i = 0; i < theaterIds.length; i++){
                document.getElementById("btn_"+theaterIds[i]).addEventListener("click", editTheater)
            }
    } catch(error){
        console.error(error)
    }
}

async function editTheater(event){
    const clickedTheater = event.target;
    if (!clickedTheater.id.includes("btn_")) {
        return;
    }
      const theaterId = clickedTheater.id.replace("btn_", "");
      const rowInput = document.querySelector(`#rows_${theaterId}`).value;
      const seatInput = document.querySelector(`#seats_${theaterId}`).value;
      
    if(rowInput == 0 && seatInput == 0){
        if(window.confirm("Submitting 0 rows & 0 seats will delete this theater")){
            const response = await fetch(url+"/"+theaterId, makeOptions("DELETE", null, true)).then(handleHttpErrors);
            return;
        }
    }
    const editTheater = {
        id : theaterId,
        rows : rowInput,
        seatsPerRow : seatInput
    }
    if(window.confirm("Be cautious!\nAltering seats or rows may conflict with existing reservations")){
        const editResponse = await fetch(url+"/"+theaterId, makeOptions("PUT", editTheater, true)).then(handleHttpErrors)
        console.log(editResponse); 
    }
     
}

async function addTheater(){
    const newTheater = {
        id : document.getElementById("create-theater-id").value,
        rows : document.getElementById("create-theater-rows").value,
        seatsPerRow : document.getElementById("create-theater-seats").value
    }
    document.getElementById("create-theater-id").value = "";
    document.getElementById("create-theater-rows").value = "";
    document.getElementById("create-theater-seats").value = "";
    const postResponse = await fetch(url, makeOptions("POST", newTheater, true)).then(handleHttpErrors)
    console.log(postResponse)
}