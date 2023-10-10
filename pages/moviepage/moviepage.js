// Fetch movie details by IMDb ID
const imdbId = "your_movie_imdb_id"; // Replace with the IMDb ID of the movie you want to display
fetch(`/api/movies/details/${imdbId}`)
    .then((response) => response.json())
    .then((movieData) => {
        // Update the HTML content with movie details
        document.getElementById("movie-title").textContent = movieData.title;
        document.getElementById("movie-poster").src = movieData.poster;
        
        // Add code to update showing times if needed
    })
    .catch((error) => {
        console.error("Error fetching movie details:", error);
    });