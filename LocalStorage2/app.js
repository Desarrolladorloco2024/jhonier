// Retrieve data from LocalStorage or initialize an empty array
let data = JSON.parse(localStorage.getItem("crudData")) || [];

const nameInput = document.getElementById("nameInput");
const updateIndexInput = document.getElementById("updateIndexInput");
const dataTableBody = document.querySelector("#dataTable tbody");

/**
 * Inserts a new item into the data array and LocalStorage.
 */
function insertData() {
    const name = nameInput.value.trim(); // Get value and remove whitespace
    if (name) {
        data.push(name);
        saveData();
        displayData();
        nameInput.value = ""; // Clear input field
    } else {
        alert("Por favor, ingresa un nombre para insertar.");
    }
}

/**
 * Updates an existing item in the data array and LocalStorage.
 * It uses the index from updateIndexInput.
 */
function updateData() {
    const name = nameInput.value.trim();
    const index = parseInt(updateIndexInput.value);

    if (name && !isNaN(index) && index >= 0 && index < data.length) {
        data[index] = name;
        saveData();
        displayData();
        nameInput.value = "";
        updateIndexInput.value = "";
    } else {
        alert("Por favor, ingresa un nombre y un índice válido para actualizar. El índice debe existir en la tabla.");
    }
}

/**
 * Deletes an item from the data array based on its index.
 * It uses the index from updateIndexInput.
 */
function deleteData() {
    const index = parseInt(updateIndexInput.value);

    if (!isNaN(index) && index >= 0 && index < data.length) {
        const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar "${data[index]}"?`);
        if (confirmDelete) {
            data.splice(index, 1); // Remove 1 element at the given index
            saveData();
            displayData();
            updateIndexInput.value = "";
        }
    } else {
        alert("Por favor, ingresa un índice válido para eliminar. El índice debe existir en la tabla.");
    }
}

/**
 * Displays all data from the 'data' array into the HTML table.
 */
function displayData() {
    dataTableBody.innerHTML = ""; // Clear existing table rows
    if (data.length === 0) {
        dataTableBody.innerHTML = '<tr><td colspan="2">No hay datos para mostrar.</td></tr>';
        return;
    }
    data.forEach((item, index) => {
        const row = dataTableBody.insertRow();
        const indexCell = row.insertCell(0);
        const nameCell = row.insertCell(1);

        indexCell.textContent = index; // Display the index
        nameCell.textContent = item; // Display the name/data
    });
}

/**
 * Saves the current 'data' array to LocalStorage.
 */
function saveData() {
    localStorage.setItem("crudData", JSON.stringify(data));
}

// Initial display of data when the page loads
document.addEventListener("DOMContentLoaded", displayData);