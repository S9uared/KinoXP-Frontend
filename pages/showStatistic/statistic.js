// import Chart from 'chart.js/auto';
import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
const url = API_URL+"/statistics"


export function initStatistics(){
    createMovieDivs()
    document.getElementById("movielist-outerbox").addEventListener("click", fetchStatisticsForMovie)
    document.getElementById("graph-box").addEventListener("click", hideGraph)
}

function hideGraph(){
    document.getElementById("graph-box").style.display = "none";
}
async function fetchStatisticsForMovie(event){
    const clickedMovie = event.target;
    const oneMovieUrl = url + "/movie/"+clickedMovie.id;
    try{
        const oneMovieStats = await fetch(oneMovieUrl, makeOptions("GET", null, true)).then(handleHttpErrors);
        setupGraphFromStats(oneMovieStats)
    } catch(error){
        console.error(error)
    }
}

async function createMovieDivs(){
    try{
        const statData = await fetch(url, makeOptions("GET", null, true)).then(handleHttpErrors)
        const filteredStats = removeDuplicates(statData);
        console.log(filteredStats);
        const tableRows = filteredStats.map(stat => 
                `<tr>
                <td>${stat.movieId}</td>
                <td>${stat.movieName}</td>
                <td>${stat.date}</td>
                <td>${stat.totalReservations}%</td>
                <td><button id="${stat.movieId}">...</button></td>
                </tr>`
            ).join("");
        document.getElementById("table-rows").innerHTML = tableRows;
    }
    catch(error){
        console.error(error)
    }
}


function setupGraphFromStats(stats){
    document.getElementById("graph-box").style.display = "block";
    const xValues = []
    const yValues = []
    if(stats instanceof Array){
        stats.map(stat => xValues.push(stat.date));
        stats.map(stat => yValues.push(stat.totalReservations));
    }
    if(stats instanceof Object){
        xValues.push(stats.date);
        yValues.push(stats.totalReservations)
    }

    new Chart("statistic-chart", {
        type : "line",
        data: {
            labels: xValues,
            datasets: [{
              fill: false,
              lineTension: 0.3,
              backgroundColor: "rgba(0,0,255,1.0)",
              borderColor: "rgba(0,0,255,0.1)",
              data: yValues
            }]
          },
          options: {
            legend: {display: false},
            scales: {
              yAxes: [{ticks: {min: 0, max:100}}],
            }
          }
        });
}
function removeDuplicates(arr) { 
    let sortedArr = arr.sort(function(a, b) {
        const dateA = new Date(a.date.split('-').reverse().join('-')); // Convert "dd-MM-yyyy" to "yyyy-MM-dd"
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateA - dateB; // Compare dateB to dateA for descending order
      });
    return [...new Map(arr.map(stat => [stat.movieId, stat])).values()]; 
} 
function compareFunction(a, b){
    let date1 = new Date(a);
    let date2 = new Date(b);
    if(date1 > date2){
        return 1;
    }
    if(date1 < date2){
        return -1;
    }
    return 0;
}