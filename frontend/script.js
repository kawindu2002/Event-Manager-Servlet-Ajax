
const $eventForm = $('#eventForm');
const $eventIdInput = $('#eid');
const $eventNameInput = $('#ename');
const $eventDescriptionInput = $('#edescription');
const $eventDateInput = $('#edate');
const $eventPlaceInput = $('#eplace');
const $eventTableBody = $('#eventTableBody');
const $saveEventBtn = $('#saveEventBtn');
const $updateEventBtn = $('#updateEventBtn');
const $deleteEventBtn = $('#deleteEventBtn');
const $resetEventBtn = $('#resetEventBtn');

const apiUrl = 'http://localhost:8080/Event_Manager_Servlet_Ajax_Web_exploded/event';

//WE CALL THIS READY FUNCTION WHEN PAGE IS LOADED
$(document).ready(function () {
        resetEventForm();
        loadEvents();
});

//THIS FUNCTION WILL REQUEST THE SERVER AND GET DATA TO TABLES
function loadEvents() {
        $.ajax({
                url: apiUrl,
                method: 'GET',
                success: loadEventsTable,
                error: function () {
                        alert("Error loading events");
                }
        });
}

//THIS FUNCTION WILL LOAD THE DATA INTO TABLES
function loadEventsTable(response) {
        $eventForm[0].reset();
        
        $eventTableBody.empty();
        response.forEach(event => {
                const row = `
                                <tr data-event='${JSON.stringify(event)}'>
                                    <td>${event.eid}</td>
                                    <td>${event.ename}</td>
                                    <td>${event.edescription}</td>
                                    <td>${event.edate}</td>
                                    <td>${event.eplace}</td>
                                    <td>
                                        <button class="update-btn EditEventBtn"><i class="fas fa-edit"></i> Edit</button>
                                    </td>
                                </tr>
                        `;
                $eventTableBody.append(row);
        });
        
        addEventTableListeners();
}

// FUNCTION TO ADD LISTENERS TO EDIT BTN
function addEventTableListeners() {
        $eventTableBody.find('.EditEventBtn').on('click', function () {
                // FIND THE TABLE ROW OF EDIT BTN
                const $row = $(this).closest('tr');
                // GETS ALL THE DATA VALUES FROM THAT ROW & FILL THE FORM WITH THIS EVENT'S DATA.
                populateEventForm($row.data('event'));
                
        });
}

// FUNCTION TO ADD TABLE DATA TO INPUT FIELDS
function populateEventForm(data) {
        // INSERT DATA INTO FIELDS
        $eventIdInput.val(data.eid);
        $eventNameInput.val(data.ename);
        $eventDescriptionInput.val(data.edescription);
        $eventDateInput.val(data.edate);
        $eventPlaceInput.val(data.eplace);
        
}

// Function to reset item form
function resetEventForm() {
        $eventForm[0].reset();
}


// FUNCTION TO SAVE AN EVENT
function saveEvent() {
        
        const event_data = {
                eid: $eventIdInput.val(),
                ename: $eventNameInput.val(),
                edescription: $eventDescriptionInput.val(),
                edate: $eventDateInput.val(),
                eplace: $eventPlaceInput.val()
        };
        
        $.ajax({
                url: apiUrl,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(event_data),
                success: function () {
                        alert('Event created');
                        loadEvents();
                        resetEventForm();
                },
                error: function () {
                        alert("Error creating event");
                }
        });
}


// Function to update an event
function updateEvent() {
        // const event = JSON.parse($(this).closest('tr').attr('data-event'));
        
        const idToUpdate = $eventIdInput.val();
        const newName = $eventNameInput.val();
        const newDesc = $eventDescriptionInput.val();
        const newDate = $eventDateInput.val();
        const newPlace = $eventPlaceInput.val();
        
        
        if (!newName || !newDate || !newPlace) {
                alert("Name, Date, and Place are required.");
                return;
        }
        
        const updatedEvent = {
                eid: idToUpdate,
                ename: newName,
                edescription: newDesc,
                edate: newDate,
                eplace: newPlace
        };
        
        $.ajax({
                url: apiUrl,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(updatedEvent),
                success: function () {
                        alert('Event updated');
                        loadEvents();
                        resetEventForm();
                },
                error: function () {
                        alert("Error updating event");
                }
        });
}



// Function to delete items
function deleteEvent() {

        const idToDelete = $eventIdInput.val();
        if (confirm("Are you sure you want to delete this event?")) {
                $.ajax({
                        url: apiUrl + "?eid=" + idToDelete,
                        method: 'DELETE',
                        success: function () {
                                alert('Event deleted');
                                loadEvents();
                                resetEventForm();
                        },
                        error: function () {
                                alert("Error deleting event");
                        }
                });
        }
        
}


//Button click bindings

// Save item when save button clicked
$saveEventBtn.on('click', saveEvent);

// Update item when update button clicked
$updateEventBtn.on('click', updateEvent);

// Delete item when delete button clicked
$deleteEventBtn.on('click', deleteEvent);

// Reset item form when reset button clicked
$resetEventBtn.on('click', resetEventForm);

