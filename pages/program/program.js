import { API_URL } from "../../settings.js";
const URL = API_URL + "/showings";
import {
  makeOptions,
  sanitizeStringWithTableRows,
  handleHttpErrors,
} from "../../utils.js";

export async function initProgram() {
  document.getElementById("showings-result").onclick = showMovieDetails;
  initShowings();
  document
    .getElementById("input-showing-date")
    .addEventListener("change", findShowingsByDate);
}

async function findShowingsByDate() {
  const date = document.getElementById("input-showing-date").value;

  try {
    const response = await fetch(
      URL + "/date/" + date,
      makeOptions("GET", null, false)
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const showings = await response.json();

    if (!Array.isArray(showings)) {
      throw new Error("Response data is not an array");
    }

    const cards = showings
      .map(
        (showing) => `      
              <div id="showing-movieId-${showing.movie.id}" class="showing-card">
              <a class="nav-link" href="/movie-details" data-navigo>
                  <img 
                  src="${showing.movie.Poster}" 
                  loading="lazy"
                  class="showing-pic"
                  />
              </a>    
                  <div class="showing-card-content">
                      <h6 class="showing-title">${showing.movie.Title}</h6>
                      <p class="showing-runtime">Runtime: ${showing.movie.Runtime}</p>
                      <p class="showing-runtime">Date: ${showing.date}</p>
                      <p class="showing-runtime">Time: ${showing.time}</p>
                  </div>
              </div>          
        `
      )
      .join("");

    document.getElementById("showings-result").innerHTML = cards;
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error appropriately, e.g., display an error message to the user.
  }
}

async function initShowings() {
  try {
    const response = await fetch(URL, makeOptions("GET", null, false));

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const showings = await response.json();

    if (!Array.isArray(showings)) {
      throw new Error("Response data is not an array");
    }

    const cards = showings
      .map(
        (showing) => `
        <div class="showing-card">
            <img id="movie_${showing.movie.id}"
            src="${showing.movie.Poster}" 
            loading="lazy"
            class="showing-pic"
            data-date="${showing.date}"
            />
            <div class="showing-card-content">
                <h6 class="showing-title">${showing.movie.Title}</h6>
                <p class="showing-runtime">Runtime: ${showing.movie.Runtime}</p>
                <p class="showing-runtime">Date: ${showing.date}</p>
                <p class="showing-runtime">Time: ${showing.time}</p>
            </div>
        </div>   
        `
      )
      .join("");

    document.getElementById("showings-result").innerHTML = cards;
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

async function showMovieDetails(evt) {
  const target = evt.target;
  if (!target.id.includes("movie_")) {
    return;
  }
  const id = target.id.replace("movie_", "");
  const date = target.getAttribute("data-date"); // Get the date attribute
  // Now you have the 'date' available for further use.
  // @ts-ignore
  window.router.navigate("movie-details?id=" + id + "&date=" + date);
}

// Slideshow
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".slide");
  let slideIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.opacity = i === index ? 1 : 0; // Show the selected slide
    });
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length; // Move to the next slide
    showSlide(slideIndex);
    setTimeout(nextSlide, 5000); // Call nextSlide again after 5 seconds
  }

  showSlide(slideIndex); // Show the initial slide
  setTimeout(nextSlide, 5000); // Start the slideshow
});