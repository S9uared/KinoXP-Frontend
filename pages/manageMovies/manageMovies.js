import {API_URL} from "../../settings.js";
import {handleHttpErrors, makeOptions, sanitizeStringWithTableRows,} from "../../utils.js";
const movieUrl = API_URL+"/movies"
const imdbIdS = []
const movieIds = []

export function initManageMovies(){
    fetchMovies();
    document.getElementById("add-movie-btn").addEventListener("click", addMovie)
}

async function fetchMovies(){
    try{
        const movieData = await fetch(movieUrl, makeOptions("GET", null, true)).then(handleHttpErrors)
        const tableRows = movieData.map(movie => {
            imdbIdS.push(movie.imdbID)
            movieIds.push(movie.id)
            return `<tr class="movie-rows">
            <td>${movie.imdbID}</td>
            <td>${movie.Title}</td>
            <td>${movie.Plot}</td>
            <td>${movie.Released}</td>
            <td>${movie.imdbRating}</td>
            <td><button id="delete_${movie.id}">Delete</button></td>
            </tr>`
        }).join("");
        document.getElementById("table-rows").innerHTML = tableRows;
        for(let i = 0; i < movieIds.length; i++){
            document.getElementById("delete_"+movieIds[i]).addEventListener("click", deleteMovie)
        }

    } catch(error){
        console.error(error)
    }
}

function deleteMovie(event){
    console.log("we made it in to delete function")
    const clickedMovie = event.target;
    if(!clickedMovie.id.includes("delete_")){
        return;
    }
    const movieId = clickedMovie.id.replace("delete_", "");
    if(window.confirm("Are you sure you want to delete this movie?")){
        fetch(movieUrl+"/"+movieId, makeOptions("DELETE", null, true))
    }
}
async function addMovie(){
    document.getElementById("add-movie-failure").innerText = ""
    const imdbId = document.getElementById("imdb-id-input").value;
    if(imdbId && !imdbIdS.includes(imdbId)){
        try{
        const response = await fetch(movieUrl+"/"+imdbId, makeOptions("POST", null, true))
        document.getElementById("imdb-id-input").value = "";
        } catch(error){
            console.error(error)
        }
        return;
    } else {
        document.getElementById("imdb-id-input").value = "";
        document.getElementById("add-movie-failure").innerText = "Invalid or duplicate imdbId"
    }

    
}