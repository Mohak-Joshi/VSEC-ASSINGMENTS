function calculate() {

    let name = document.getElementById("name").value;

    let mark1 = Number(document.getElementById("mark1").value);
    let mark2 = Number(document.getElementById("mark2").value);
    let mark3 = Number(document.getElementById("mark3").value);
    let mark4 = Number(document.getElementById("mark4").value);
    let mark5 = Number(document.getElementById("mark5").value);

    let total = mark1 + mark2 + mark3 + mark4 + mark5;

    let percentage = (total / 500) * 100;

    let table = document.getElementById("studentTable");

    let row = table.insertRow();

    row.insertCell(0).innerHTML = name;
    row.insertCell(1).innerHTML = total;
    row.insertCell(2).innerHTML = percentage + "%";
}