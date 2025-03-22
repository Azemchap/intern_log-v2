// Function to retrieve interns data from local storage
function getInternsFromStorage() {
    const internsJSON = localStorage.getItem('interns');
    return internsJSON ? JSON.parse(internsJSON) : [];
}

// Function to save interns data to local storage
function saveInternsToStorage(interns) {
    localStorage.setItem('interns', JSON.stringify(interns));
}

// Function to create a new intern
function createIntern(name) {
    const interns = getInternsFromStorage();
    const newIntern = { name };
    interns.push(newIntern);
    saveInternsToStorage(interns);
}

// Function to update an intern's name by index 
function updateInternName(index, newName) {
    const interns = getInternsFromStorage();
    interns[index].name = newName;
    saveInternsToStorage(interns);
}

// Function to delete an intern by index 
function deleteIntern(index) {
    const interns = getInternsFromStorage();
    interns.splice(index, 1);
    saveInternsToStorage(interns);
}

// Function to read all interns and display them on the Intern List
function readInterns(internsListId) {
    const interns = getInternsFromStorage();
    const internsList = document.getElementById(internsListId);
    internsList.innerHTML = '';

    interns.forEach((intern, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'intern-item';

        const internNameElement = document.createElement('div');
        internNameElement.className = 'intern-name';
        internNameElement.textContent = intern.name;
        listItem.appendChild(internNameElement);

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.addEventListener('click', () => {
            const newName = prompt('Enter the updated name:');
            if (newName) {
                updateInternName(index, newName);
                readInterns(internsListId); // Refresh the list
            }
        });
        listItem.appendChild(updateButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure you want to delete this intern?');
            if (confirmDelete) {
                deleteIntern(index);
                readInterns(internsListId); // Refresh the list
            }
        });
        listItem.appendChild(deleteButton);

        internsList.appendChild(listItem);
    });
}

// Function to handle create new intern when the form is submitted
function addIntern(event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const name = nameInput.value;

    createIntern(name);
    nameInput.value = '';
    readInterns('interns'); // Refresh the intern list
}

// Function to retrieve intern logs from local storage
function getInternLogsFromStorage() {
    const internLogs = localStorage.getItem('internLogs');
    return internLogs ? JSON.parse(internLogs) : [];
}

// Function to save intern logs to local storage
function saveInternLogsToStorage(internLogs) {
    localStorage.setItem('internLogs', JSON.stringify(internLogs));
}

// Function to populate the intern select dropdown
function populateInternSelect() {
    const interns = getInternsFromStorage();
    const internSelect = document.getElementById('intern-select');
    internSelect.innerHTML = '<option value="" disabled selected>Select an intern</option>';

    interns.forEach((intern, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = intern.name;
        internSelect.appendChild(option);
    });
}

// Function to log intern hours
function logInternHours(event) {
    event.preventDefault();

    const internIndex = document.getElementById('intern-select').value;
    const arrivalTime = document.getElementById('arrival-time').value;
    const departureTime = document.getElementById('departure-time').value;

    if (arrivalTime >= departureTime) {
        alert('Arrival time must be less than departure time.');
        return;
    }

    const internLogs = getInternLogsFromStorage();
    internLogs.push({ internIndex, arrivalTime, departureTime });
    saveInternLogsToStorage(internLogs);

    refreshData(); // Refresh the data displayed

    // Reset the log form
    document.getElementById('intern-select').value = '';
    document.getElementById('arrival-time').value = '';
    document.getElementById('departure-time').value = '';
}

// Function to populate the intern logs table
function populateInternLogsTable() {
    const internLogs = getInternLogsFromStorage();
    const internLogsTable = document.getElementById('intern-logs-table');
    internLogsTable.innerHTML = ''; // Clear the table before populating

    if (internLogs.length === 0) {
        internLogsTable.textContent = 'No intern logs available.';
        return;
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headerRow = document.createElement('tr');
    const internHeader = document.createElement('th');
    internHeader.textContent = 'Intern';
    const arrivalHeader = document.createElement('th');
    arrivalHeader.textContent = 'Arrival';
    const departureHeader = document.createElement('th');
    departureHeader.textContent = 'Departure';
    const durationHeader = document.createElement('th');
    durationHeader.textContent = 'Work Time';
    const actionsHeader = document.createElement('th');
    actionsHeader.textContent = 'Actions';

    headerRow.appendChild(internHeader);
    headerRow.appendChild(arrivalHeader);
    headerRow.appendChild(departureHeader);
    headerRow.appendChild(durationHeader);
    headerRow.appendChild(actionsHeader);
    thead.appendChild(headerRow);

    internLogs.forEach((log, index) => {
        const interns = getInternsFromStorage();
        const intern = interns[log.internIndex];

        const row = document.createElement('tr');
        const internCell = document.createElement('td');
        internCell.textContent = intern ? intern.name : 'Unknown Intern';
        const arrivalCell = document.createElement('td');
        arrivalCell.textContent = log.arrivalTime;
        const departureCell = document.createElement('td');
        departureCell.textContent = log.departureTime;
        const durationCell = document.createElement('td');
        const duration = calculateDuration(log.arrivalTime, log.departureTime);
        durationCell.textContent = `${duration.hours}h ${duration.minutes}m`;

        // Create Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit'; // Add class for styling
        editButton.addEventListener('click', () => {
            editLog(index); // Call editLog function with log index
        });

        // Create Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete'; // Add class for styling
        deleteButton.addEventListener('click', () => {
            deleteLog(index); // Call deleteLog function with log index
        });

        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions'; // Add class for flex styling
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        row.appendChild(internCell);
        row.appendChild(arrivalCell);
        row.appendChild(departureCell);
        row.appendChild(durationCell);
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    internLogsTable.appendChild(table);
}

// Function to calculate the duration between two times
function calculateDuration(arrivalTime, departureTime) {
    const arrival = new Date(`1970/01/01 ${arrivalTime}`);
    const departure = new Date(`1970/01/01 ${departureTime}`);
    const durationMs = departure - arrival;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    return { hours, minutes };
}

// Function to refresh the interns and intern logs from local storage
function refreshData() {
    populateInternSelect();
    populateInternLogsTable();
}

// Function to edit a log
function editLog(index) {
    const internLogs = getInternLogsFromStorage();
    const log = internLogs[index];

    // Prompt for new values
    const newArrivalTime = prompt('Enter new Arrival Time:', log.arrivalTime);
    const newDepartureTime = prompt('Enter new Departure Time:', log.departureTime);

    if (newArrivalTime && newDepartureTime) {
        if (newArrivalTime >= newDepartureTime) {
            alert('Arrival time must be less than departure time.');
            return;
        }

        // Update log
        log.arrivalTime = newArrivalTime;
        log.departureTime = newDepartureTime;
        saveInternLogsToStorage(internLogs);
        refreshData(); // Refresh the logs table
    }
}

// Function to delete a log
function deleteLog(index) {
    const internLogs = getInternLogsFromStorage();
    internLogs.splice(index, 1); // Remove the log
    saveInternLogsToStorage(internLogs);
    refreshData(); // Refresh the logs table
}

// Event listeners for both forms
const internForm = document.getElementById('intern-form');
if (internForm) {
    internForm.addEventListener('submit', addIntern);
}

const logForm = document.getElementById('log-form');
if (logForm) {
    logForm.addEventListener('submit', logInternHours);
}

// Use DOMContentLoaded to run code when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Auto-fetch interns and logs on window start
    if (document.getElementById('interns')) {
        readInterns('interns'); // Load interns on the add intern page
    }

    if (document.getElementById('intern-logs-table')) {
        populateInternLogsTable(); // Populate logs table on the log hours page
        populateInternSelect(); // Populate select on the log hours page
    }
});