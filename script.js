// Function to retrieve interns data from local storage
function getInternsFromStorage() {
    const internsJSON = localStorage.getItem('interns');
    if (internsJSON) {
        return JSON.parse(internsJSON);
    } else {
        return [];
    }
}



// Function to save interns data to local storage
function saveInternsToStorage(interns) {
    const internsJSON = JSON.stringify(interns);
    localStorage.setItem('interns', internsJSON);
}



// Function to create a new intern
function createIntern(name) {
    const interns = getInternsFromStorage();
    const newIntern = { name };
    interns.push(newIntern);
    saveInternsToStorage(interns);
}




// Function to update an intern's name by index 
// (tracking interns by their positions in the array) 

function updateInternName(index, newName) {
    const interns = getInternsFromStorage();
    const internToUpdate = interns[index];
    internToUpdate.name = newName;
    saveInternsToStorage(interns);
}


// Function to delete an intern by index 
// (tracking interns by their positions in the array)

function deleteIntern(index) {
    const interns = getInternsFromStorage();
    interns.splice(index, 1);
    saveInternsToStorage(interns);
}



// Function to read all interns and display them on the Intern List
function readInterns() {
    const interns = getInternsFromStorage();
    const internsList = document.getElementById('interns');
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
                readInterns();
            }
        });
        listItem.appendChild(updateButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure you want to delete this intern?');
            if (confirmDelete) {
                deleteIntern(index);
                readInterns();
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

    readInterns();
}



// Add event listener to the form submit event
const internForm = document.getElementById('intern-form');
internForm.addEventListener('submit', addIntern);


// Function to generate a unique intern ID
function generateInternId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


// Function to read intern logs from local storage
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



// Function to populate the intern logs table
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



// Function to calculate the duration between two times
function calculateDuration(arrivalTime, departureTime) {
    const arrival = new Date(`1970/01/01 ${arrivalTime}`);
    const departure = new Date(`1970/01/01 ${departureTime}`);
    const durationMs = departure - arrival;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    return { hours, minutes };
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

    refreshData();

    // Reset the log form
    document.getElementById('intern-select').value = '';
    document.getElementById('arrival-time').value = '';
    document.getElementById('departure-time').value = '';
}


// Function to populate the intern logs table
function populateInternLogsTable() {
    const internLogs = getInternLogsFromStorage();
    const internLogsTable = document.getElementById('intern-logs-table');
    internLogsTable.innerHTML = '';

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
    arrivalHeader.textContent = 'Arrival Time';
    const departureHeader = document.createElement('th');
    departureHeader.textContent = 'Departure Time';
    const durationHeader = document.createElement('th');
    durationHeader.textContent = 'Work Time';

    headerRow.appendChild(internHeader);
    headerRow.appendChild(arrivalHeader);
    headerRow.appendChild(departureHeader);
    headerRow.appendChild(durationHeader);
    thead.appendChild(headerRow);

    internLogs.forEach((log) => {
        const intern = getInternsFromStorage()[log.internIndex];
        const row = document.createElement('tr');
        const internCell = document.createElement('td');
        internCell.textContent = intern.name;
        const arrivalCell = document.createElement('td');
        arrivalCell.textContent = log.arrivalTime;
        const departureCell = document.createElement('td');
        departureCell.textContent = log.departureTime;
        const durationCell = document.createElement('td');
        const duration = calculateDuration(log.arrivalTime, log.departureTime);
        durationCell.textContent = `${duration.hours}h ${duration.minutes}m`;

        row.appendChild(internCell);
        row.appendChild(arrivalCell);
        row.appendChild(departureCell);
        row.appendChild(durationCell);
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    internLogsTable.appendChild(table);
}



// Function to refresh the interns and intern logs from local storage
function refreshData() {
    populateInternSelect();
    populateInternLogsTable();
}


// Function to add or update an intern
function addOrUpdateIntern(intern) {
    const interns = getInternsFromStorage();
    const existingInternIndex = interns.findIndex((item) => item.id === intern.id);

    if (existingInternIndex !== -1) {
        interns[existingInternIndex] = intern;
    } else {
        interns.push(intern);
    }

    saveInternsToStorage(interns);
    refreshData();
}


// Add event listener to the intern form submit event
internForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const internNameInput = document.getElementById('name');
    const internName = internNameInput.value.trim();

    if (internName !== '') {
        const intern = { id: generateInternId(), name: internName };
        addOrUpdateIntern(intern);

        // Reset the intern form
        internNameInput.value = '';
    }
});

// Add event listener to the log form submit event
const logForm = document.getElementById('log-form');
logForm.addEventListener('submit', logInternHours);



// Read and display interns and intern logs on page load
readInterns();
populateInternSelect();
populateInternLogsTable();

