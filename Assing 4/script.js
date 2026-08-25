let form = document.getElementById("movieForm");

let table = document.getElementById("movieTable");


form.addEventListener("submit", function(event) {

    event.preventDefault();


    let name = document.getElementById("movieName").value;

    let year = document.getElementById("movieYear").value;

    let genre = document.getElementById("movieGenre").value;

    let rating = document.getElementById("movieRating").value;

    let status = document.getElementById("movieStatus").value;


    let row = document.createElement("tr");


    row.innerHTML = `
        <td>${name}</td>
        <td>${year}</td>
        <td>${genre}</td>
        <td>⭐ ${rating}/10</td>
        <td>📋 ${status}</td>
    `;


    table.appendChild(row);


    form.reset();

});