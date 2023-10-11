// import Chart from 'chart.js/auto';
import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
const url = API_URL+"/statistics"


export function initStatistics(){
    createMovieDivs()
    document.getElementById("movielist-outerbox").addEventListener("click", fetchStatisticsForMovie)
}

async function fetchStatisticsForMovie(event){
    const clickedMovie = event.target;
    const oneMovieUrl = url + "/movie/"+clickedMovie.id;
    try{
        oneMovieStats = await fetch(oneMovieUrl, makeOptions("GET", null, true)).then(handleHttpErrors);
        setupGraphFromStats(oneMovieStats)
    } catch(error){
        console.error(error)
    }
}

async function createMovieDivs(){
    try{
        const statData = await fetch(url, makeOptions("GET", null, true)).then(handleHttpErrors)
        console.log(statData);
        const tableRows = statData.map(stat => 
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
    const xValues = []
    const yValues = []
    if(stats instanceof Array){
        xValues = stats.map(stat => stat.date).toList();
        yValues = stats.map(stat => stat.totalReservations).toList();
    }
    if(stats instanceof Object){
        xValues.push(stats.date);
        yValues.push(stats.totalReservations)
    }

    // new Chart("statistic-chart", {
    //     type : "line",
    //     data: {
    //         labels: xValues,
    //         datasets: [{
    //           fill: false,
    //           lineTension: 0,
    //           backgroundColor: "rgba(0,0,255,1.0)",
    //           borderColor: "rgba(0,0,255,0.1)",
    //           data: yValues
    //         }]
    //       },
    //       options: {
    //         legend: {display: false},
    //         scales: {
    //           yAxes: [{ticks: {min: 0, max:100}}],
    //         }
    //       }
    //     });
}