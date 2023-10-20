//  import Chart from 'chart.js/auto';
import { API_URL } from '../../settings.js'
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from '../../utils.js'
const url = API_URL+"/statistics"


export function initStatistics(){
    createMovieDivs()
    document.getElementById("update-stat-btn").addEventListener("click", createStatsForPastWeek)
    document.getElementById("movielist-outerbox").addEventListener("click", fetchStatisticsForMovie)
    document.getElementById("graph-box").addEventListener("click", hideGraph)
}

function hideGraph(){
    document.getElementById("graph-box").style.display = "none";
    Chart.getChart("statistic-chart").destroy();
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



async function createStatsForPastWeek(){
    const movieUrl = API_URL+"/movies"
    const movieList = await fetch(movieUrl).then(handleHttpErrors)
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const formattedToday = dd + '-' + mm + '-' + yyyy;
    
    try {
        const createStatResponse = movieList.map(async (movie) => {
            const newStat = {
                movieId : movie.id,
                date : formattedToday
            }
            const response = await fetch(url, makeOptions("POST", newStat, true)).then(handleHttpErrors)
            return response;
        })
    } catch (error) {
        console.error(error)
    }
    createMovieDivs()
}

async function createMovieDivs(){
    try{
        const statData = await fetch(url, makeOptions("GET", null, true)).then(handleHttpErrors)
        const filteredStats = removeDuplicates(statData);
        const tableRows = filteredStats.map(stat => 
                `<tr>
                <td><p>${stat.movieId}</p></td>
                <td><p>${stat.movieName}</p></td>
                <td><p>${stat.date}</p></td>
                <td><p>${stat.totalReservations}%</p></td>
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
    const activeChart = Chart.getChart("statistic-chart")
    if(activeChart){
        activeChart.destroy();
    }
    document.getElementById("graph-box").style.display = "block";
    const xValues = []
    const yValues = []
    if(stats instanceof Array){
        stats.map(stat => xValues.unshift(stat.date));
        stats.map(stat => yValues.unshift(stat.totalReservations));
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
            plugins: {
                legend: {
                    display: false,
                }
                
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Average seats sold in %' // Change this to your desired x-axis title
                    },
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    ticks: {
                        stepSize: 10
                    }
                },
            }
          }
        });
}
function removeDuplicates(arr) { 
    let sortedArr = arr.sort(function(a, b) {
        const dateA = new Date(a.date.split('-').reverse().join('-')); // Convert "dd-MM-yyyy" to "yyyy-MM-dd"
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateB - dateA; // Compare dateB to dateA for descending order
      });
    return [...new Map(arr.map(stat => [stat.movieId, stat])).values()]; 
} 