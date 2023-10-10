import "./navigo_EditedByLars.js"; //Will create the global Navigo, with a few changes, object used below
import { setActiveLink, loadHtml, renderHtml } from "./utils.js";
import { initMovieSeats } from "./pages/showSeats/seats.js";
import { initProgram } from "./pages/program/program.js";

window.addEventListener("load", async () => {
  //Add html pages in this format for client redirect
  //const templateCars = await loadHtml("./pages/cars/cars.html")
  const templateFrontPage = await loadHtml("./pages/frontpage/frontpage.html");
  const templateProgram = await loadHtml("./pages/program/program.html");
  const templateMovieSchedule = await loadHtml(
    "./pages/showMovieSchedule/schedule.html"
  );
  const templateMovieSeats = await loadHtml("./pages/showSeats/seats.html");
  const templateBooking = await loadHtml("./pages/addBooking/booking.html");
  const templateMyTickets = await loadHtml(
    "./pages/findTickets/findTickets.html"
  );
  const templateLogin = await loadHtml("./pages/login/login.html");
  const templateNotFound = await loadHtml("./pages/notFound/notFound.html");
  //If token existed, for example after a refresh, set UI accordingly
  const token = localStorage.getItem("token");
  //toggleLoginStatus(token)

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
        renderHtml(templateFrontPage, "content");
        //initFrontPage()
      },

      "/program": () => {
        renderHtml(templateProgram, "content");
        initProgram();
      },

      "/movie/time": () => {
        renderHtml(templateMovieSchedule, "content");
        // initMovieTimes()
      },

      "/movie/seats": () => {
        renderHtml(templateMovieSeats, "content");
        initMovieSeats();
      },

      "/movie/booking": () => {
        renderHtml(templateBooking, "content");
        // initBooking()
      },

      "/mytickets": () => {
        renderHtml(templateMyTickets, "content");
        // initMyTickets()
      },

      "/employee/login": () => {
        renderHtml(templateLogin, "content");
        // initLogin()
      },

      "/employee/program": () => {
        renderHtml(templateEmpProgram, "content");
        //initEmpProgram()
      },

      "/employee/booking": () => {
        renderHtml(templateEmpBooking, "content");
        //initEmpBooking()
      },
    })
    .notFound(() => {
      renderHtml(templateNotFound, "content");
    })
    .resolve();
});
