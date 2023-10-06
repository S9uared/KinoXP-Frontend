import "./navigo_EditedByLars.js"  //Will create the global Navigo, with a few changes, object used below

import {
    setActiveLink, loadHtml, renderHtml} from "./utils.js"


    window.addEventListener("load", async () => {
        
        //Add html pages in this format for client redirect  
        //const templateCars = await loadHtml("./pages/cars/cars.html")

         //If token existed, for example after a refresh, set UI accordingly
  const token = localStorage.getItem("token")
  toggleLoginStatus(token)

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
    //   "/": () => document.getElementById("content").innerHTML = `
    //     <h2>Home</h2>
    //     <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/cars.png">
    //     <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
    //       Car's 'R' Us - Created, as a help to make GREAT fullstack developers <span style='font-size:2em;'>&#128516;</span>
    //     </p>
    //  `,
        "/movies": () => {
        renderHtml(templateCars, "content")
        initCars()
      },
      "/login": () => {
        renderHtml(templateLogin, "content")
        initLogin()
      }
    
    })
      .notFound(() => {
        renderHtml(templateNotFound, "content")
      })
      .resolve()
    


    });