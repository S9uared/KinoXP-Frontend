
import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
import { setActiveLink, loadHtml, renderHtml } from "./utils.js";
import { initReservation } from "./pages/addBooking/addReservation.js";
import { initProgram } from "./pages/program/program.js";
import { initMovieDetails } from "./pages/movieDetails/movieDetails.js";

import { initLogin, logout, toggleLoginStatus } from "./pages/login/login.js";
import { initStatistics } from "./pages/showStatistic/statistic.js";

window.addEventListener("load", async () => {
  //Add html pages in this format for client redirect
  //const templateCars = await loadHtml("./pages/cars/cars.html")

  const templateProgram = await loadHtml("./pages/program/program.html");

  const templateMovieDetails = await loadHtml(
    "./pages/movieDetails/movieDetails.html"
  );
  const templateMovieSchedule = await loadHtml(
    "./pages/showMovieSchedule/schedule.html"
  );
  const templateMovieSeats = await loadHtml("./pages/showSeats/seats.html");
  const templateReservation = await loadHtml(
    "./pages/addBooking/addReservation.html"
  );
 
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");
  //If token existed, for example after a refresh, set UI accordingly
  const token = localStorage.getItem("token");

  toggleLoginStatus(token);

 const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url)
        done()
      }
    })
    .on({
      //For very simple "templates", you can just insert your HTML directly like below
      //Add ',' between each url redirect.
    //   "/": () => document.getElementById("content").innerHTML = `
    //     <h2>Home</h2>
    //     <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/cars.png">
    //     <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
    //       Car's 'R' Us - Created, as a help to make GREAT fullstack developers <span style='font-size:2em;'>&#128516;</span>
    //     </p>
    //  `,
        
      
      "/": () => {
        renderHtml(templateProgram, "content");
        initProgram();
      },
      "/movie-details": (match) => {
        renderHtml(templateMovieDetails, "content");
        initMovieDetails(match);
      },
      "/movie/time": () => {
        renderHtml(templateMovieSchedule, "content");
        // initMovieTimes()
      },
      /* "/movie/seats": () => {
        renderHtml(templateMovieSeats, "seat-div-box");
        initMovieSeats();
      }, */
      "/movie/reservation": () => {
        renderHtml(templateReservation, "content");
        initReservation();
      },
      "/mytickets": () => {
        renderHtml(templateMyTickets, "content");
        // initMyTickets()
      },
      "/employee/login": () => {
        renderHtml(templateLogin, "content");
        initLogin();
      },
      "/employee/program": () => {
        renderHtml(templateEmpProgram, "content");
        //initEmpProgram()
      },
      "/employee/booking": () => {
        renderHtml(templateEmpBooking, "content");
        //initEmpBooking()
      },
      "/logout": () => {
        renderHtml(templateLogin, "content");
        logout();

      },
        "/logout": () => {
          renderHtml(templateLogin, "content")
          logout()
        }
    })
      .notFound(() => {
        renderHtml(templateNotFound, "content")
      })
      .resolve()

    });