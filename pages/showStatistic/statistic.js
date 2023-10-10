import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'

const url = API_URL+"/statistics"


export function initStatistics(){
    fetchStatistics()
    document.getElementById("movielist-outerbox").addEventListener("click", fetchStatistics)
}

async function fetchStatistics(){
    try{
        const statData = await fetch(url).then(handleHttpErrors)
        
        createMovieDivs(statData)
    } catch(error){
        console.error(error)
    }
}

function createMovieDivs(statData){
    if(statData instanceof Array){
        const statRows = statData.map(stat => {
            `<tr>
            <td>${stat.movieId}</td>
            <td>${stat.movieName}</td>
            <td>${stat.date}</td>
            <td>${stat.totalReservations}</td>
            </tr>`
        }).join("");
    } else if (movieData instanceof Object){

    }

}