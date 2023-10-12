import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
import { setActiveLink, loadHtml, renderHtml } from "./utils.js";
import { initProgram } from "./pages/program/program.js";
import { initMovieDetails } from "./pages/movieDetails/movieDetails.js";
import { initEmpProgram } from "./pages/employeeProgram/employeeProgram.js";
import { initManageMovies } from "./pages/manageMovies/manageMovies.js";
import { initTheaters } from "./pages/manageTheaters/theater.js";
import { initStatistics } from "./pages/showStatistic/statistic.js";
import { initLogin, logout, toggleLoginStatus } from "./pages/login/login.js";

window.addEventListener("load", async () => {
  //Add html pages in this format for client redirect
  //const templateCars = await loadHtml("./pages/cars/cars.html")

  const templateProgram = await loadHtml("./pages/program/program.html");
  const templateMovieDetails = await loadHtml("./pages/movieDetails/movieDetails.html");
  const templateEmpProgram = await loadHtml("./pages/employeeProgram/employeeProgram.html")
  const templateMovies = await loadHtml("./pages/manageMovies/manageMovies.html")
  const templateTheaters = await loadHtml("./pages/manageTheaters/theater.html")
  const templateStatistic = await loadHtml("./pages/showStatistic/statistic.html")
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");

  //If token existed, for example after a refresh, set UI accordingly
  const token = localStorage.getItem("token");
  toggleLoginStatus(token);

  const router = new Navigo("/", { hash: true });
  //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
  window.router = router;

  router
    .hooks({
      before(done, match) {
        setActiveLink("menu", match.url);
        done();
      },
    })
    .on({
      "/": () => {
        renderHtml(templateProgram, "content");
        initProgram();
      },

      "/movie-details": (match) => {
        renderHtml(templateMovieDetails, "content");
        initMovieDetails(match);
      },

      "/manage/program": () => {
        renderHtml(templateEmpProgram, "content");
        initEmpProgram();
      },
    
      "/manage/movies" : () => {
          renderHtml(templateMovies, "content")
          initManageMovies()
      },

      "/manage/theaters" : () => {
          renderHtml(templateTheaters, "content")
          initTheaters()
      },

      "/manage/statistics" : () => {
        renderHtml(templateStatistic, "content")
        initStatistics()
      },

      "/login": () => {
        renderHtml(templateLogin, "content");
        initLogin();
      },

      "/logout": () => {
        logout();
      },
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content");
    })
    .resolve();
});
