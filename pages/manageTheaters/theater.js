import {API_URL} from "../../settings.js";
import {handleHttpErrors, makeOptions, sanitizeStringWithTableRows,} from "../../utils.js";
const url = API_URL+"/theaters"
const theaterIds = [];
export function initTheaters(){
    fetchTheaters();
    document.getElementById("create-theater-submit").addEventListener("click", addTheater)
    document.getElementById("create-theater-btn").addEventListener("click", function (){
        document.getElementById("modal").style.display = "block"
    })
}


async function fetchTheaters(){
    try{
        const theaters = await fetch(url, makeOptions("GET", null, true)).then(handleHttpErrors)
        const theaterDivs = theaters.map(theater => {
           theaterIds.push(theater.id);
           return `<div class="theater-box" id=theater_${theater.id}>
                <p>Theater ${theater.id}</p>
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
    document.getElementById("create-theater-fail").innerText = ""
    const newTheater = {
        id : parseInt(document.getElementById("create-theater-id").value),
        rows : document.getElementById("create-theater-rows").value,
        seatsPerRow : document.getElementById("create-theater-seats").value
    }
    if(theaterIds.includes(newTheater.id, 0)){
        clearCreateInputFields()
        document.getElementById("create-theater-fail").innerText = "This theater id is already in use"
        return;
    }
    if(newTheater.id == 0){
        clearCreateInputFields()
        document.getElementById("create-theater-fail").innerText = "Id can not be below 1"
        return;
    }
    if((newTheater.rows == 0 && newTheater.seatsPerRow == 0)){
        clearCreateInputFields()
        document.getElementById("create-theater-fail").innerText = "Please add rows and or seats to the theater"
        return;
    }
    clearCreateInputFields()
    const postResponse = await fetch(url, makeOptions("POST", newTheater, true)).then(handleHttpErrors)
    document.getElementById("modal").style.display = "none";
    console.log(postResponse)
}
function clearCreateInputFields(){
    document.getElementById("create-theater-id").value = "";
    document.getElementById("create-theater-rows").value = "";
    document.getElementById("create-theater-seats").value = "";
}