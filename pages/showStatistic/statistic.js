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
    let statRows;
    if(statData instanceof Array){
        statRows = statData.map(stat => {
            `<tr>
            <td>${stat.movieId}</td>
            <td>${stat.movieName}</td>
            <td>${stat.date}</td>
            <td>${stat.totalReservations}</td>
            <td><button id="graph-${stat.movieId}">...</button></td>
            </tr>`
        }).join("");
    } else if (movieData instanceof Object){
        statRows = 
        `<tr>
        <td>${statData.movieId}</td>
        <td>${statData.movieName}</td>
        <td>${statData.date}</td>
        <td>${statData.totalReservations}</td>
        <td><button id="graph-${statData.movieId}">...</button></td>
        </tr>`
    }

}